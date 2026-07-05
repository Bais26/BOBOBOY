import {
  RekapAdminResponse,
  RekapQueryParams,
} from "@/types/rekap";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildQueryString(params: RekapQueryParams): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== "" && v !== null
  );
  if (!entries.length) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error?.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Rekap API ────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/absens/my-rekap
 * Rekap kehadiran seluruh karyawan — Admin only.
 */
export async function fetchRekapAdmin(
  params: RekapQueryParams = {}
): Promise<RekapAdminResponse> {
  const qs = buildQueryString(params);
  return apiFetch<RekapAdminResponse>(`/v1/absens/admin/rekap${qs}`);
}