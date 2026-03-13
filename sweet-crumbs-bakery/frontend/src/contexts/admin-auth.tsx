"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

type AdminUser = { email: string; role: "owner" };

type AdminAuthState = {
  token: string | null;
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  ready: boolean;
};

const AdminAuthContext = createContext<AdminAuthState | null>(null);
const LS_KEY = "sweet-crumbs-admin-token-v1";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(LS_KEY) : null;
    if (stored) setToken(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }
    apiFetch<{ user: AdminUser }>("/api/auth/me", { token })
      .then((r) => setUser(r.user))
      .catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(LS_KEY);
      });
  }, [token]);

  const value = useMemo<AdminAuthState>(() => {
    const login: AdminAuthState["login"] = async (email, password) => {
      const r = await apiFetch<{ token: string; user: AdminUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(r.token);
      setUser(r.user);
      localStorage.setItem(LS_KEY, r.token);
    };
    const logout = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem(LS_KEY);
    };
    return { token, user, login, logout, ready };
  }, [token, user, ready]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

