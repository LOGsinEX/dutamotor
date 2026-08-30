/**
 * Login admin sederhana berbasis environment variable.
 *
 * Akun admin diatur di .env.local:
 *   ADMIN_EMAIL=admin@royanigarage.com
 *   ADMIN_PASSWORD=password-rahasia
 *
 * Cookie login berisi hash SHA-256 dari kombinasi email + password,
 * jadi kalau password di .env diganti, sesi login lama otomatis tidak berlaku.
 * File ini aman dipakai di Edge runtime (proxy.ts) maupun Node (route handler).
 */

export const ADMIN_COOKIE = "rg_admin";

export function adminCredentials() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  return { email, password, configured: Boolean(email && password) };
}

/** Menghitung token sesi dari kredensial di env. */
export async function computeAdminToken(): Promise<string | null> {
  const { email, password, configured } = adminCredentials();
  if (!configured) return null;

  const data = new TextEncoder().encode(`${email}|${password}|duta-motor`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Memeriksa apakah nilai cookie adalah sesi admin yang sah. */
export async function isValidAdminCookie(
  value: string | undefined | null
): Promise<boolean> {
  if (!value) return false;
  const expected = await computeAdminToken();
  return expected !== null && value === expected;
}
