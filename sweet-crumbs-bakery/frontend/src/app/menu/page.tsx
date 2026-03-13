import { API_BASE_URL } from "@/lib/api";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

export const metadata = {
  title: "Menu",
  description: "Explore cakes, pastries, muffins, donuts, cookies and more.",
};

async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/api/products`, { cache: "no-store" });
  if (!res.ok) return { products: [] as Product[] };
  return (await res.json()) as { products: Product[] };
}

export default async function MenuPage() {
  const { products } = await getProducts();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Cakes & Menu</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-700">
          Choose your favorites. Add to cart and place an order in minutes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}

