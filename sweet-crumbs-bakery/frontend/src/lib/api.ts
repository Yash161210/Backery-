export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export type ApiError = { message: string };

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text || "Invalid JSON from server" };
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    cache: "no-store",
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const message = (data as ApiError)?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

