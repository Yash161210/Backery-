"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminAuth } from "@/contexts/admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("owner@sweetcrumbs.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.replace("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-sm">
        <div className="text-2xl font-extrabold tracking-tight">Owner login</div>
        <div className="mt-1 text-sm text-zinc-700">
          Sign in to manage products, gallery, and orders.
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block space-y-1">
            <div className="text-sm font-semibold">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
            />
          </label>
          <label className="block space-y-1">
            <div className="text-sm font-semibold">Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
            />
          </label>

          <button
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          {error ? <div className="text-sm font-semibold text-rose-700">{error}</div> : null}
        </form>
      </div>
    </div>
  );
}

