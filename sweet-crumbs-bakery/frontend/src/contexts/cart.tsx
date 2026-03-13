"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  flavor?: string;
  weight?: string;
  imageUrl?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartState | null>(null);
const LS_KEY = "sweet-crumbs-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const value = useMemo<CartState>(() => {
    const addItem: CartState["addItem"] = (item, quantity = 1) => {
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.productId === item.productId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
          return next;
        }
        return [...prev, { ...item, quantity }];
      });
    };
    const removeItem = (productId: string) => setItems((prev) => prev.filter((p) => p.productId !== productId));
    const updateQuantity = (productId: string, quantity: number) =>
      setItems((prev) =>
        prev
          .map((p) => (p.productId === productId ? { ...p, quantity: Math.max(1, quantity) } : p))
          .filter((p) => p.quantity > 0)
      );
    const clear = () => setItems([]);
    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const count = items.reduce((sum, it) => sum + it.quantity, 0);
    return { items, addItem, removeItem, updateQuantity, clear, subtotal, count };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

