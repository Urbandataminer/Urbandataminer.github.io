const rawBase = (import.meta as any)?.env?.VITE_API_BASE as string | undefined;

/**
 * API base URL for production (e.g. https://api.your-domain.com).
 * - If empty/undefined, we fall back to relative paths, which is convenient for local dev with Vite proxy.
 * - No trailing slash.
 */
export const API_BASE = (rawBase ?? '').replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

export function apiFetch(path: string, init?: RequestInit) {
  return fetch(apiUrl(path), init);
}


