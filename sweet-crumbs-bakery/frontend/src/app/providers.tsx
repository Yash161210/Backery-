"use client";

import { CartProvider } from "@/contexts/cart";
import { AdminAuthProvider } from "@/contexts/admin-auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <CartProvider>{children}</CartProvider>
    </AdminAuthProvider>
  );
}

