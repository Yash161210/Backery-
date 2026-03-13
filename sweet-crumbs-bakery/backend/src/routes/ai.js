const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

function pickFallback({ budget, taste, occasion, people }, products) {
  const b = Number(budget);
  const p = Math.max(1, Number(people || 1));
  const tasteLc = String(taste || "").toLowerCase();
  const occLc = String(occasion || "").toLowerCase();

  const scored = products.map((prod) => {
    let score = 0;
    if (Number.isFinite(b)) {
      const diff = Math.abs(prod.price - b);
      score += Math.max(0, 300 - diff) / 10;
      if (prod.price <= b) score += 10;
    }
    if (tasteLc && String(prod.flavor || "").toLowerCase().includes(tasteLc)) score += 20;
    if (occLc.includes("wedding") && /fondant|custom|truffle/i.test(prod.name)) score += 15;
    if (occLc.includes("birthday") && /truffle|chocolate|black forest|red velvet/i.test(prod.name)) score += 15;
    if (p >= 10 && /custom|fondant/i.test(prod.name)) score += 10;
    if (prod.isPopular) score += 8;
    if (prod.isFeatured) score += 5;
    return { prod, score };
  });

  scored.sort((a, b2) => b2.score - a.score);
  return scored[0]?.prod || products[0];
}

async function callEuri({ budget, taste, occasion, people, menuText }) {
  const apiKey = process.env.EURI_API_KEY;
  if (!apiKey) return null;

  const baseUrl = process.env.EURI_BASE_URL || "https://api.euri.ai/v1";
  const model = process.env.EURI_MODEL || "gpt-4o-mini";

  const system = `You are Sweet Crumbs Bakery's AI cake recommendation assistant.
Return ONLY a JSON object with keys:
recommendedCake, whyItFits, estimatedPrice, suggestedFlavor.
estimatedPrice must be a number (INR).`;

  const user = `Customer inputs:
- Budget (INR): ${budget}
- Taste preference: ${taste}
- Occasion: ${occasion}
- Number of people: ${people}

Menu/products (may be partial):
${menuText}

Choose the best match. If budget is too low for cakes, suggest a smaller item (muffin/cupcake/donut) and explain.`;

  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.4,
    }),
  });

  if (!resp.ok) return null;
  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch {
    // Sometimes models wrap JSON in text; best-effort extract
    const match = String(content).match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]);
  }
}

router.post("/recommend", async (req, res, next) => {
  try {
    const { budget, tastePreference, occasion, people } = req.body || {};
    if (!budget || !tastePreference || !occasion || !people) {
      return res.status(400).json({ message: "budget, tastePreference, occasion, people are required" });
    }

    const products = await Product.find({ isActive: true }).sort({ isPopular: -1, createdAt: -1 }).lean();
    const menuText = products
      .slice(0, 50)
      .map((p) => `- ${p.name} (₹${p.price}) | flavor: ${p.flavor || "N/A"} | category: ${p.category || "N/A"}`)
      .join("\n");

    const ai = await callEuri({
      budget,
      taste: tastePreference,
      occasion,
      people,
      menuText,
    });

    if (ai?.recommendedCake) {
      return res.json({
        recommendedCake: ai.recommendedCake,
        whyItFits: ai.whyItFits || "",
        estimatedPrice: Number(ai.estimatedPrice) || Number(budget),
        suggestedFlavor: ai.suggestedFlavor || String(tastePreference),
        provider: "euri",
      });
    }

    const fallback = pickFallback(
      { budget, taste: tastePreference, occasion, people },
      products.length
        ? products
        : [
            { name: "Chocolate Cake", price: 450, flavor: "chocolate", isPopular: true, isFeatured: true },
            { name: "Red Velvet Cake", price: 550, flavor: "red velvet", isPopular: true },
          ]
    );

    return res.json({
      recommendedCake: fallback.name,
      whyItFits: `Based on your budget and preference for ${tastePreference}, this is a strong match for a ${occasion}.`,
      estimatedPrice: fallback.price,
      suggestedFlavor: fallback.flavor || String(tastePreference),
      provider: "fallback",
    });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;

