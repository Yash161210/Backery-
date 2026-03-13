"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await apiFetch<{ ok: boolean }>("/api/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, message }),
      });
      setStatus("sent");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to send");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm sm:p-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Contact</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-700">
          Have a custom cake request or a quick question? Send us a message and we’ll get back soon.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={submit} className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 sm:col-span-2">
              <div className="text-sm font-semibold">Name</div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
            <label className="space-y-1">
              <div className="text-sm font-semibold">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
            <label className="space-y-1">
              <div className="text-sm font-semibold">Phone</div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <div className="text-sm font-semibold">Message</div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400"
              />
            </label>
          </div>

          <button
            disabled={status === "sending"}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 disabled:opacity-70"
          >
            {status === "sending" ? "Sending..." : "Send message"}
          </button>

          {status === "sent" ? (
            <div className="mt-3 text-sm font-semibold text-emerald-700">Message sent. We’ll contact you soon.</div>
          ) : null}
          {status === "error" ? (
            <div className="mt-3 text-sm font-semibold text-rose-700">{error || "Failed to send."}</div>
          ) : null}
        </form>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm">
            <div className="text-sm font-semibold text-zinc-900">Bakery address</div>
            <div className="mt-2 text-sm text-zinc-700">
              CS-10 Supertech Capetown, Sector 74
              <br />
              Noida, Uttar Pradesh 201301
            </div>
            <div className="mt-3 text-sm text-zinc-700">
              Phone: <a className="font-semibold text-zinc-900" href="tel:+919315473497">+91 9315473497</a>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-sm">
            <iframe
              title="Sweet Crumbs Bakery Map"
              src="https://www.google.com/maps?q=Supertech%20Capetown%20Sector%2074%20Noida&output=embed"
              className="h-[320px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

