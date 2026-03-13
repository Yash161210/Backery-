"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "@/contexts/admin-auth";
import { adminGet } from "@/lib/adminApi";
import { Product, Order } from "@/types";

export default function AdminDashboardPage() {
  const { token, user } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/api/products?active=false`, {
        cache: "no-store",
      }).then((r) => r.json() as Promise<{ products: Product[] }>),
      adminGet<{ orders: Order[] }>("/api/orders", token),
    ])
      .then(([p, o]) => {
        setProducts(p.products || []);
        setOrders(o.orders || []);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.subtotal || 0), 0);
  const newOrders = orders.filter((o) => o.status === "new").length;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm sm:p-10">
        <div className="text-2xl font-extrabold tracking-tight">Dashboard</div>
        <div className="mt-1 text-sm text-zinc-700">Welcome {user?.email || "owner"}.</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Products", value: products.length },
          { label: "Orders", value: orders.length },
          { label: "New orders", value: newOrders },
          { label: "Revenue (subtotal)", value: `₹${Math.round(totalRevenue)}` },
        ].map((c) => (
          <div key={c.label} className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm">
            <div className="text-xs font-semibold text-zinc-600">{c.label}</div>
            <div className="mt-2 text-3xl font-extrabold tracking-tight">{loading ? "…" : c.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm">
        <div className="text-sm font-semibold">Quick actions</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <a className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-500" href="/admin/products">
            Manage products
          </a>
          <a className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800" href="/admin/orders">
            View orders
          </a>
          <a className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-zinc-50" href="/admin/gallery">
            Manage gallery
          </a>
        </div>
      </div>
    </div>
  );
}

