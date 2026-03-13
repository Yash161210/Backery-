"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Save, Trash2, Upload } from "lucide-react";
import { useAdminAuth } from "@/contexts/admin-auth";
import { adminPost, adminPut, adminUpload } from "@/lib/adminApi";
import { apiFetch } from "@/lib/api";
import { Product } from "@/types";
import { formatINR } from "@/lib/format";

type Draft = Partial<Product> & { price?: number };

export default function AdminProductsPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({ name: "", price: 0, flavor: "", category: "Cake", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(() => products.find((p) => p._id === selectedId) || null, [products, selectedId]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const r = await apiFetch<{ products: Product[] }>("/api/products?active=false");
      setProducts(r.products || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (selected) {
      setDraft({
        _id: selected._id,
        name: selected.name,
        slug: selected.slug,
        description: selected.description,
        price: selected.price,
        flavor: selected.flavor,
        category: selected.category,
        weightOptions: selected.weightOptions,
        isFeatured: selected.isFeatured,
        isPopular: selected.isPopular,
        imageUrl: selected.imageUrl,
      });
    }
  }, [selected]);

  async function create() {
    if (!token) return;
    setError(null);
    try {
      const r = await adminPost<{ product: Product }>("/api/products", token, draft);
      setSelectedId(r.product._id);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    }
  }

  async function save() {
    if (!token || !draft._id) return;
    setError(null);
    try {
      await adminPut<{ product: Product }>(`/api/products/${draft._id}`, token, draft);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function remove(id: string) {
    if (!token) return;
    setError(null);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json())?.message || "Delete failed");
      });
      setSelectedId(null);
      setDraft({ name: "", price: 0, flavor: "", category: "Cake", description: "" });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function uploadImage(file: File) {
    if (!token || !draft._id) return;
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const r = await adminUpload<{ imageUrl: string; product: Product }>(`/api/products/${draft._id}/image`, token, fd);
      setDraft((d) => ({ ...d, imageUrl: r.imageUrl }));
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm sm:p-10">
        <div className="text-2xl font-extrabold tracking-tight">Products</div>
        <div className="mt-1 text-sm text-zinc-700">Add, edit, delete products and upload images.</div>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_420px]">
        <div className="rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="text-sm font-semibold">All products</div>
            <button
              onClick={() => {
                setSelectedId(null);
                setDraft({ name: "", price: 0, flavor: "", category: "Cake", description: "" });
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-500"
            >
              <Plus className="h-4 w-4" />
              New
            </button>
          </div>
          <div className="mt-2 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-zinc-600">
                <tr>
                  <th className="px-2 py-2">Product</th>
                  <th className="px-2 py-2">Price</th>
                  <th className="px-2 py-2">Flavor</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-2 py-4 text-zinc-600" colSpan={4}>
                      Loading…
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr
                      key={p._id}
                      className={selectedId === p._id ? "bg-rose-50" : "hover:bg-white/60"}
                    >
                      <td className="px-2 py-3">
                        <button onClick={() => setSelectedId(p._id)} className="font-semibold hover:text-rose-700">
                          {p.name}
                        </button>
                        <div className="text-xs text-zinc-600">{p.category}</div>
                      </td>
                      <td className="px-2 py-3">{formatINR(p.price)}</td>
                      <td className="px-2 py-3 capitalize">{p.flavor || "-"}</td>
                      <td className="px-2 py-3">
                        <button
                          onClick={() => remove(p._id)}
                          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-zinc-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm">
          <div className="text-sm font-semibold">{draft._id ? "Edit product" : "Create product"}</div>

          <div className="mt-4 space-y-3">
            <label className="block space-y-1">
              <div className="text-xs font-semibold text-zinc-600">Name</div>
              <input
                value={draft.name || ""}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
            <label className="block space-y-1">
              <div className="text-xs font-semibold text-zinc-600">Slug (optional)</div>
              <input
                value={draft.slug || ""}
                onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
            <label className="block space-y-1">
              <div className="text-xs font-semibold text-zinc-600">Description</div>
              <textarea
                value={draft.description || ""}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                rows={3}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <div className="text-xs font-semibold text-zinc-600">Price (INR)</div>
                <input
                  value={draft.price ?? 0}
                  onChange={(e) => setDraft((d) => ({ ...d, price: Number(e.target.value) }))}
                  inputMode="numeric"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
                />
              </label>
              <label className="block space-y-1">
                <div className="text-xs font-semibold text-zinc-600">Flavor</div>
                <input
                  value={draft.flavor || ""}
                  onChange={(e) => setDraft((d) => ({ ...d, flavor: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
                />
              </label>
            </div>
            <label className="block space-y-1">
              <div className="text-xs font-semibold text-zinc-600">Category</div>
              <input
                value={draft.category || ""}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(draft.isFeatured)}
                  onChange={(e) => setDraft((d) => ({ ...d, isFeatured: e.target.checked }))}
                />
                Featured
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(draft.isPopular)}
                  onChange={(e) => setDraft((d) => ({ ...d, isPopular: e.target.checked }))}
                />
                Popular
              </label>
            </div>

            {draft.imageUrl ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 to-amber-100">
                <Image src={draft.imageUrl} alt={draft.name || "Product"} fill className="object-cover" />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-600">
                Upload an image after creating the product.
              </div>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              {!draft._id ? (
                <button
                  onClick={create}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-500"
                >
                  <Plus className="h-4 w-4" />
                  Create
                </button>
              ) : (
                <>
                  <button
                    onClick={save}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-zinc-50">
                    <Upload className="h-4 w-4" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file);
                      }}
                    />
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

