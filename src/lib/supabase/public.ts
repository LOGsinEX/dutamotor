import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client baca-saja untuk halaman publik.
 * HANYA dipakai di server component (src/lib/data.ts), tidak pernah di browser.
 *
 * Memakai service role key bila tersedia supaya pembacaan data tidak pernah
 * terhalang aturan RLS; kalau tidak ada, jatuh ke anon key.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const readKey = serviceKey || anonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && readKey);

export function createPublicClient() {
  return createSupabaseClient(supabaseUrl, readKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
