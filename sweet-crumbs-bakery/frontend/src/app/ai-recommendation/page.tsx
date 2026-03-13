"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatINR } from "@/lib/format";

type AiResult = {
  recommendedCake: string;
  whyItFits: string;
  estimatedPrice: number;
  suggestedFlavor: string;
  provider?: string;
};

export default function AiRecommendationPage() {
  const [budget, setBudget] = useState("600");
  const [tastePreference, setTastePreference] = useState("chocolate");
  const [occasion, setOccasion] = useState("birthday");
  const [people, setPeople] = useState("8");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await apiFetch<AiResult>("/api/ai/recommend", {
        method: "POST",
        body: JSON.stringify({
          budget: Number(budget),
          tastePreference,
          occasion,
          people: Number(people),
        }),
      });
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
          <Sparkles className="h-4 w-4" />
          AI Cake Recommendation
        </div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Find the perfect cake in seconds</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-700">
          Tell us your budget, taste, occasion, and how many people you’re serving. Our AI suggests the best match.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <div className="text-sm font-semibold">Budget (₹)</div>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
                inputMode="numeric"
              />
            </label>
            <label className="space-y-1">
              <div className="text-sm font-semibold">Number of people</div>
              <input
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
                inputMode="numeric"
              />
            </label>
            <label className="space-y-1">
              <div className="text-sm font-semibold">Taste preference</div>
              <select
                value={tastePreference}
                onChange={(e) => setTastePreference(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              >
                <option value="chocolate">Chocolate</option>
                <option value="fruity">Fruity</option>
                <option value="vanilla">Vanilla</option>
                <option value="red velvet">Red Velvet</option>
                <option value="buttery">Buttery</option>
                <option value="classic">Classic</option>
              </select>
            </label>
            <label className="space-y-1">
              <div className="text-sm font-semibold">Occasion</div>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              >
                <option value="birthday">Birthday</option>
                <option value="wedding">Wedding</option>
                <option value="anniversary">Anniversary</option>
                <option value="casual">Casual</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 disabled:opacity-70"
          >
            {loading ? "Thinking..." : "Recommend a cake"}
          </button>

          {error ? <div className="mt-3 text-sm font-semibold text-rose-700">{error}</div> : null}
        </form>

        <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm">
          <div className="text-sm font-semibold text-zinc-900">Your recommendation</div>
          {result ? (
            <div className="mt-4 space-y-3">
              <div className="text-2xl font-extrabold tracking-tight">{result.recommendedCake}</div>
              <div className="rounded-2xl bg-amber-50 p-4 text-sm text-zinc-800">
                <div className="font-semibold">Why it fits</div>
                <div className="mt-1">{result.whyItFits}</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <div className="text-xs font-semibold text-zinc-600">Estimated price</div>
                  <div className="mt-1 text-lg font-bold">{formatINR(result.estimatedPrice)}</div>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <div className="text-xs font-semibold text-zinc-600">Suggested flavor</div>
                  <div className="mt-1 text-lg font-bold capitalize">{result.suggestedFlavor}</div>
                </div>
              </div>
              <div className="text-xs text-zinc-500">Powered by: {result.provider || "ai"}</div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-zinc-700">
              Fill the form and click <span className="font-semibold">Recommend a cake</span>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

