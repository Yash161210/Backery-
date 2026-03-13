import Link from "next/link";
import { Sparkles, Star } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,63,94,0.18),transparent_55%),radial-gradient(circle_at_bottom,rgba(245,158,11,0.18),transparent_55%)]" />
        <div className="relative grid gap-8 p-8 sm:grid-cols-2 sm:p-12">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
              <Sparkles className="h-4 w-4" />
              Freshly baked daily
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Sweet Crumbs Bakery
            </h1>
            <p className="text-lg text-zinc-700">
              <span className="font-semibold">Freshly Baked Happiness Every Day</span>. Cakes, pastries,
              cookies, and more—crafted with premium ingredients.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-500"
              >
                Order now
              </Link>
              <Link
                href="/ai-recommendation"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Get AI cake recommendation
              </Link>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-700">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                4.9 rated
              </span>
              <span className="h-1 w-1 rounded-full bg-zinc-400" />
              <span>Custom cakes available</span>
            </div>
          </div>
          <div className="relative min-h-[260px] overflow-hidden rounded-2xl bg-gradient-to-br from-rose-200 via-amber-100 to-white">
            <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_30%_20%,#fb7185,transparent_45%),radial-gradient(circle_at_70%_70%,#f59e0b,transparent_45%)]" />
            <div className="relative flex h-full items-end p-6">
              <div className="rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm">
                Today’s highlight: Chocolate Truffle Cake
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedSections />
    </div>
  );
}

async function FeaturedSections() {
  const [featuredRes, popularRes] = await Promise.all([
    fetch(`${API_BASE_URL}/api/products?featured=true`, { cache: "no-store" }),
    fetch(`${API_BASE_URL}/api/products?popular=true`, { cache: "no-store" }),
  ]);

  const featured = featuredRes.ok ? ((await featuredRes.json()) as { products: Product[] }).products : [];
  const popular = popularRes.ok ? ((await popularRes.json()) as { products: Product[] }).products : [];

  return (
    <>
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured cakes</h2>
            <p className="mt-1 text-sm text-zinc-600">Handpicked favorites for your next celebration.</p>
          </div>
          <Link className="text-sm font-semibold text-rose-700 hover:text-rose-600" href="/menu">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(featured.length ? featured : popular).slice(0, 6).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Popular bakery items</h2>
          <p className="mt-1 text-sm text-zinc-600">Customer-loved classics, baked fresh every day.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.slice(0, 6).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { name: "Aditi", text: "The chocolate truffle is unreal. Super moist and not overly sweet." },
          { name: "Rohan", text: "Ordered cupcakes for a party—looked premium and tasted amazing." },
          { name: "Meera", text: "Quick service, great packaging, and the donuts were fresh and soft." },
        ].map((t) => (
          <div key={t.name} className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">{t.name}</div>
            <div className="mt-2 text-sm text-zinc-700">“{t.text}”</div>
          </div>
        ))}
      </section>
    </>
  );
}
