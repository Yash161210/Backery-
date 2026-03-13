const express = require("express");
const Product = require("../models/Product");
const { requireAuth, requireOwner } = require("../middleware/auth");
const { slugify } = require("../utils/slug");
const { upload } = require("../utils/upload");

const router = express.Router();

function absoluteImageUrl(req, relativeOrAbsolute) {
  if (!relativeOrAbsolute) return "";
  if (String(relativeOrAbsolute).startsWith("http")) return relativeOrAbsolute;
  const base = process.env.PUBLIC_API_BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${base}${relativeOrAbsolute.startsWith("/") ? "" : "/"}${relativeOrAbsolute}`;
}

// Public
router.get("/", async (req, res, next) => {
  try {
    const { featured, popular, active } = req.query;
    const filter = {};
    if (active !== "false") filter.isActive = true;
    if (featured === "true") filter.isFeatured = true;
    if (popular === "true") filter.isPopular = true;

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    res.json({
      products: products.map((p) => ({ ...p, imageUrl: absoluteImageUrl(req, p.imageUrl) })),
    });
  } catch (e) {
    next(e);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).lean();
    if (!product) return res.status(404).json({ message: "Not found" });
    return res.json({ product: { ...product, imageUrl: absoluteImageUrl(req, product.imageUrl) } });
  } catch (e) {
    next(e);
  }
});

// Owner
router.post("/", requireAuth, requireOwner, async (req, res, next) => {
  try {
    const body = req.body || {};
    const name = String(body.name || "").trim();
    const price = Number(body.price);
    if (!name) return res.status(400).json({ message: "Name required" });
    if (!Number.isFinite(price)) return res.status(400).json({ message: "Valid price required" });

    const slug = body.slug ? slugify(body.slug) : slugify(name);
    const doc = await Product.create({
      name,
      slug,
      description: String(body.description || ""),
      price,
      currency: body.currency || "INR",
      flavor: String(body.flavor || ""),
      category: String(body.category || "Cake"),
      weightOptions: Array.isArray(body.weightOptions) ? body.weightOptions : [],
      isFeatured: Boolean(body.isFeatured),
      isPopular: Boolean(body.isPopular),
      isActive: body.isActive !== false,
      imageUrl: String(body.imageUrl || ""),
    });
    return res.status(201).json({ product: doc });
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: "Slug already exists" });
    return next(e);
  }
});

router.put("/:id", requireAuth, requireOwner, async (req, res, next) => {
  try {
    const body = req.body || {};
    const update = { ...body };
    if (update.name) update.name = String(update.name).trim();
    if (update.slug) update.slug = slugify(update.slug);
    if (update.price !== undefined) update.price = Number(update.price);
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ message: "Not found" });
    return res.json({ product });
  } catch (e) {
    return next(e);
  }
});

router.delete("/:id", requireAuth, requireOwner, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    return res.json({ ok: true });
  } catch (e) {
    return next(e);
  }
});

router.post("/:id/image", requireAuth, requireOwner, upload.single("image"), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    const rel = `/uploads/${req.file.filename}`;
    product.imageUrl = rel;
    await product.save();
    return res.json({ imageUrl: absoluteImageUrl(req, rel), product });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;

