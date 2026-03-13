"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { useAdminAuth } from "@/contexts/admin-auth";
import { adminUpload } from "@/lib/adminApi";
import { apiFetch } from "@/lib/api";
import { GalleryImage } from "@/types";

export default function AdminGalleryPage() {
  const { token } = useAdminAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const r = await apiFetch<{ images: GalleryImage[] }>("/api/gallery");
    setImages(r.images || []);
  }

  useEffect(() => {
    refresh().catch(() => {});
  }, []);

  async function upload(file: File) {
    if (!token) return;
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("title", file.name);
      fd.append("category", "cakes");
      await adminUpload(`/api/gallery/upload`, token, fd);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    }
  }

  async function remove(id: string) {
    if (!token) return;
    setError(null);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).then(async (r) => {
        if (!r.ok) throw new Error((await r.json())?.message || "Delete failed");
      });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm sm:p-10">
        <div className="text-2xl font-extrabold tracking-tight">Gallery</div>
        <div className="mt-1 text-sm text-zinc-700">Upload and manage gallery images.</div>
      </div>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div> : null}

      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800">
          <Upload className="h-4 w-4" />
          Upload images
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              files.forEach((f) => upload(f));
            }}
          />
        </label>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img) => (
            <div key={img._id} className="overflow-hidden rounded-3xl border border-white/60 bg-white shadow-sm">
              <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-rose-100 to-amber-100">
                <Image src={img.imageUrl} alt={img.title || "Image"} fill className="object-cover" />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{img.title || "Sweet Crumbs"}</div>
                  <div className="text-xs text-zinc-600">{img.category || "gallery"}</div>
                </div>
                <button
                  onClick={() => remove(img._id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-zinc-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
          {!images.length ? <div className="text-sm text-zinc-700">No images yet.</div> : null}
        </div>
      </div>
    </div>
  );
}

