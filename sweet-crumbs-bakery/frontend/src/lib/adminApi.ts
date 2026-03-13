import { apiFetch } from "@/lib/api";

export function adminGet<T>(path: string, token: string) {
  return apiFetch<T>(path, { token });
}

export function adminPost<T>(path: string, token: string, body: unknown) {
  return apiFetch<T>(path, { method: "POST", token, body: JSON.stringify(body) });
}

export function adminPut<T>(path: string, token: string, body: unknown) {
  return apiFetch<T>(path, { method: "PUT", token, body: JSON.stringify(body) });
}

export async function adminUpload<T>(path: string, token: string, formData: FormData) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data?.message || `Upload failed (${res.status})`);
  return data as T;
}

