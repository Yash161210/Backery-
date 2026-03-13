import Image from "next/image";
import { API_BASE_URL } from "@/lib/api";
import { GalleryImage } from "@/types";

export const metadata = {
  title: "Gallery",
  description: "Explore our bakery creations: cakes, cupcakes, pastries, cookies, and bread.",
};

async function getImages() {
  const res = await fetch(`${API_BASE_URL}/api/gallery`, { cache: "no-store" });
  if (!res.ok) return { images: [] as GalleryImage[] };
  return (await res.json()) as { images: GalleryImage[] };
}

export default async function GalleryPage() {
  const { images } = await getImages();
  const galleryItems: GalleryImage[] =
    images.length > 0
      ? images
      : [
          { _id: "1", imageUrl: "/placeholder-cake.svg", title: "Cakes" },
          { _id: "2", imageUrl: "/placeholder-cake.svg", title: "Cupcakes" },
          { _id: "3", imageUrl: "/placeholder-cake.svg", title: "Pastries" },
          { _id: "4", imageUrl: "/placeholder-cake.svg", title: "Cookies" },
          { _id: "5", imageUrl: "/placeholder-cake.svg", title: "Bread" },
        ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Gallery</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-700">
          A little peek into our daily bakes—cakes, cupcakes, pastries, cookies, and breads.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems.map((img) => (
          <div
            key={img._id}
            className="group overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-sm"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-rose-100 to-amber-100">
              <Image
                src={img.imageUrl}
                alt={img.title || "Bakery image"}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-4">
              <div className="text-sm font-semibold text-zinc-900">{img.title || "Sweet Crumbs"}</div>
              {img.category ? <div className="mt-1 text-xs text-zinc-600">{img.category}</div> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

