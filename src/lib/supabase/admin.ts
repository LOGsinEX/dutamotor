import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

/**
 * Client Supabase KHUSUS SERVER memakai service role key.
 * Dipakai route handler /api/admin/* untuk tambah/ubah/hapus data.
 * Kunci ini melewati RLS — jangan pernah dipakai di komponen browser.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const isServiceReady = Boolean(supabaseUrl && serviceRoleKey);

export const VEHICLE_BUCKET = "vehicle-images";

export function createAdminClient(): SupabaseClient {
  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Mengambil path file di storage dari URL publiknya. */
export function storagePathFromUrl(url: string): string | null {
  const marker = `/${VEHICLE_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

/** Menghapus foto dari storage berdasarkan daftar URL publiknya. */
export async function removeImagesByUrl(
  supabase: SupabaseClient,
  urls: string[]
): Promise<void> {
  const paths = urls
    .map(storagePathFromUrl)
    .filter((path): path is string => Boolean(path));
  if (paths.length > 0) {
    await supabase.storage.from(VEHICLE_BUCKET).remove(paths);
  }
}
