"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Box, Image as ImageIcon, LayoutDashboard, LogOut, ReceiptIndianRupee } from "lucide-react";
import clsx from "clsx";
import { useEffect } from "react";
import { useAdminAuth } from "@/contexts/admin-auth";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/orders", label: "Orders", icon: ReceiptIndianRupee },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, logout } = useAdminAuth();

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!ready) return;
    if (!user && !isLogin) router.replace("/admin/login");
  }, [ready, user, isLogin, router]);

  if (isLogin) return <>{children}</>;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4 px-0 py-0 lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-[84px] hidden h-[calc(100dvh-92px)] overflow-auto rounded-3xl border border-white/60 bg-white/70 p-4 shadow-sm lg:block">
        <div className="px-3 py-2">
          <div className="text-sm font-extrabold tracking-tight">Sweet Crumbs</div>
          <div className="text-xs text-zinc-600">Owner Dashboard</div>
        </div>
        <nav className="mt-3 space-y-1">
          {nav.map((n) => {
            const active = pathname === n.href;
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={clsx(
                  "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition",
                  active ? "bg-rose-100 text-rose-700" : "text-zinc-700 hover:bg-zinc-100"
                )}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => {
            logout();
            router.replace("/admin/login");
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-zinc-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <section className="space-y-4">{children}</section>
    </div>
  );
}

