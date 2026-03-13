"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/contexts/admin-auth";
import { adminGet, adminPut } from "@/lib/adminApi";
import { Order } from "@/types";
import { formatINR } from "@/lib/format";

const statuses = ["new", "confirmed", "baking", "ready", "delivered", "cancelled"] as const;

export default function AdminOrdersPage() {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    const r = await adminGet<{ orders: Order[] }>("/api/orders", token);
    setOrders(r.orders || []);
  }, [token]);

  useEffect(() => {
    refresh().catch(() => {});
  }, [refresh]);

  async function updateStatus(id: string, status: string) {
    if (!token) return;
    setError(null);
    try {
      await adminPut(`/api/orders/${id}/status`, token, { status });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm sm:p-10">
        <div className="text-2xl font-extrabold tracking-tight">Orders</div>
        <div className="mt-1 text-sm text-zinc-700">View and update order statuses.</div>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}

      <div className="overflow-auto rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="text-xs text-zinc-600">
            <tr>
              <th className="px-2 py-2">Order</th>
              <th className="px-2 py-2">Customer</th>
              <th className="px-2 py-2">Items</th>
              <th className="px-2 py-2">Subtotal</th>
              <th className="px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t border-white/70">
                <td className="px-2 py-3">
                  <div className="font-semibold">{o._id.slice(-6)}</div>
                  <div className="text-xs text-zinc-600">{new Date(o.createdAt).toLocaleString()}</div>
                </td>
                <td className="px-2 py-3">
                  <div className="font-semibold">{o.customer.name}</div>
                  <div className="text-xs text-zinc-600">{o.customer.phone}</div>
                </td>
                <td className="px-2 py-3">
                  <div className="text-xs text-zinc-700">
                    {o.items.map((i) => (
                      <div key={`${o._id}-${i.productId}`}>
                        {i.name} × {i.quantity}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-2 py-3 font-semibold">{formatINR(o.subtotal)}</td>
                <td className="px-2 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!orders.length ? (
              <tr>
                <td className="px-2 py-6 text-zinc-600" colSpan={5}>
                  No orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

