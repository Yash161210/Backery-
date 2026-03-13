"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Product } from "@/types";
import { formatINR } from "@/lib/format";
import { useCart } from "@/contexts/cart";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const image = product.imageUrl || "/placeholder-cake.svg";

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-rose-100 to-amber-100">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold leading-tight">{product.name}</div>
            <div className="mt-1 line-clamp-2 text-sm text-zinc-600">{product.description}</div>
          </div>
          <div className="shrink-0 rounded-full bg-zinc-900 px-3 py-1 text-sm font-semibold text-white">
            {formatINR(product.price)}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-700">
          {product.flavor ? <span className="rounded-full bg-rose-50 px-2 py-1">Flavor: {product.flavor}</span> : null}
          {product.weightOptions?.length ? (
            <span className="rounded-full bg-amber-50 px-2 py-1">{product.weightOptions[0]}+</span>
          ) : null}
        </div>
        <button
          onClick={() =>
            addItem(
              {
                productId: product._id,
                name: product.name,
                price: product.price,
                flavor: product.flavor,
                imageUrl: product.imageUrl,
              },
              1
            )
          }
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500"
        >
          <Plus className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

