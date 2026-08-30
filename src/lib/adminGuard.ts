import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminCookie } from "./adminToken";

/**
 * Dipakai route handler /api/admin/* untuk memastikan
 * yang memanggil adalah admin yang sudah login.
 * (Hanya untuk server / Node runtime — jangan diimpor proxy.ts.)
 */
export async function requireAdmin(): Promise<boolean> {
  const store = await cookies();
  return isValidAdminCookie(store.get(ADMIN_COOKIE)?.value);
}
