"use client";

import Image from "next/image";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useCart } from "@/contexts/cart";
import { formatINR } from "@/lib/format";
import { apiFetch } from "@/lib/api";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "placing" | "placed" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) return;
    setStatus("placing");
    setError(null);
    try {
      const r = await apiFetch<{ order: { _id: string } }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            flavor: i.flavor,
            weight: i.weight,
          })),
          customer: { name, phone, email, address, notes },
        }),
      });
      setOrderId(r.order._id);
      setStatus("placed");
      clear();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to place order");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Your cart</h1>
        <p className="mt-2 text-sm text-zinc-700">Review items and place your order.</p>
      </div>

      {status === "placed" ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900 shadow-sm">
          <div className="text-lg font-bold">Order placed!</div>
          <div className="mt-1 text-sm">
            Your order id is <span className="font-semibold">{orderId}</span>. We’ll contact you shortly.
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.length ? (
            items.map((it) => (
              <div
                key={it.productId}
                className="flex gap-4 rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm"
              >
                <div className="relative h-20 w-28 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100">
                  <Image
                    src={it.imageUrl || "/placeholder-cake.svg"}
                    alt={it.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{it.name}</div>
                      <div className="mt-1 text-xs text-zinc-600">{formatINR(it.price)} each</div>
                    </div>
                    <button
                      onClick={() => removeItem(it.productId)}
                      className="rounded-xl border border-zinc-200 bg-white p-2 hover:bg-zinc-50"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="text-xs font-semibold text-zinc-700">Qty</div>
                    <input
                      value={it.quantity}
                      onChange={(e) => updateQuantity(it.productId, Number(e.target.value))}
                      className="w-20 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
                      inputMode="numeric"
                    />
                    <div className="ml-auto text-sm font-semibold">{formatINR(it.price * it.quantity)}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm">
              <div className="text-sm font-semibold">Your cart is empty.</div>
              <div className="mt-1 text-sm text-zinc-700">Add items from the Menu page.</div>
            </div>
          )}
        </div>

        <form onSubmit={placeOrder} className="h-fit rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm">
          <div className="text-sm font-semibold text-zinc-900">Order details</div>
          <div className="mt-4 space-y-3">
            <label className="block space-y-1">
              <div className="text-xs font-semibold text-zinc-600">Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
            <label className="block space-y-1">
              <div className="text-xs font-semibold text-zinc-600">Phone</div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
            <label className="block space-y-1">
              <div className="text-xs font-semibold text-zinc-600">Email (optional)</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
            <label className="block space-y-1">
              <div className="text-xs font-semibold text-zinc-600">Address (optional)</div>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
            <label className="block space-y-1">
              <div className="text-xs font-semibold text-zinc-600">Notes (optional)</div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-amber-50 p-4">
            <div className="text-sm font-semibold">Subtotal</div>
            <div className="text-lg font-extrabold">{formatINR(subtotal)}</div>
          </div>

          <button
            disabled={!items.length || status === "placing"}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-60"
          >
            {status === "placing" ? "Placing order..." : "Place order"}
          </button>

          {status === "error" ? (
            <div className="mt-3 text-sm font-semibold text-rose-700">{error || "Order failed"}</div>
          ) : null}
        </form>
      </div>
    </div>
  );
}

