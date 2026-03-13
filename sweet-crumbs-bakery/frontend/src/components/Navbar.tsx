"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Sparkles } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/contexts/cart";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/ai-recommendation", label: "AI Recommend", icon: Sparkles },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-500 to-amber-400 shadow-sm" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Sweet Crumbs</div>
            <div className="text-xs text-zinc-600 group-hover:text-zinc-800">Bakery</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                  active ? "bg-rose-100 text-rose-700" : "text-zinc-700 hover:bg-zinc-100"
                )}
              >
                {Icon ? <Icon className="h-4 w-4" /> : null}
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-bold">
                {count}
              </span>
            ) : null}
          </Link>
          <Link
            href="/admin/login"
            className="hidden rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 sm:inline-flex"
          >
            Owner
          </Link>
        </div>
      </div>
    </header>
  );
}

