/**
 * Mengubah error Supabase menjadi pesan berbahasa Indonesia yang jelas,
 * lengkap dengan saran perbaikan. Dipakai semua route handler admin.
 */

type SupabaseLikeError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

export function describeSupabaseError(caught: unknown): {
  error: string;
  detail: string;
  hint: string;
} {
  const error = (caught ?? {}) as SupabaseLikeError;
  const message = error.message ?? String(caught);
  const code = error.code ?? "";

  // Tabel belum dibuat
  if (code === "42P01" || /relation .* does not exist/i.test(message)) {
    return {
      error: "Tabel database belum dibuat.",
      detail: message,
      hint: "Buka Supabase > SQL Editor > New query, tempel seluruh isi file supabase/schema.sql, lalu klik Run.",
    };
  }

  // Kolom tidak cocok (skema lama)
  if (code === "42703" || /column .* does not exist/i.test(message)) {
    return {
      error: "Struktur tabel tidak cocok.",
      detail: message,
      hint: "Jalankan ulang supabase/schema.sql versi terbaru di SQL Editor Supabase.",
    };
  }

  // Kunci API salah / kedaluwarsa
  if (/invalid api key|jwt|unauthorized|invalid.*token/i.test(message)) {
    return {
      error: "Kunci Supabase ditolak.",
      detail: message,
      hint: "Periksa NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di file .env (salin ulang dari Project Settings > API), lalu jalankan ulang npm run dev.",
    };
  }

  // Tidak bisa menghubungi server Supabase
  if (/fetch failed|network|ENOTFOUND|ECONNREFUSED|timeout/i.test(message)) {
    return {
      error: "Tidak bisa terhubung ke Supabase.",
      detail: message,
      hint: "Ini kegagalan jaringan, bukan penolakan database. Periksa berurutan: (1) NEXT_PUBLIC_SUPABASE_URL di .env harus persis seperti Project Settings > API > Project URL, berbentuk https://xxxxxxxx.supabase.co — bukan link dashboard; (2) project Supabase tidak berstatus Paused (paket gratis otomatis pause bila lama menganggur — klik Restore); (3) internet aktif dan tidak diblokir firewall, antivirus, atau VPN. Setelah .env diubah, hentikan npm run dev lalu jalankan ulang.",
    };
  }

  return {
    error: "Gagal mengakses database.",
    detail: message,
    hint: "Periksa isi file .env dan pastikan supabase/schema.sql sudah dijalankan.",
  };
}
