/**
 * Pembantu untuk link TikTok.
 * Dipakai API admin (saat menyimpan) dan section video di halaman depan.
 */

/** Mengambil ID video dari berbagai bentuk link TikTok. */
export function extractTiktokVideoId(input: string): string | null {
  const value = input.trim();

  // https://www.tiktok.com/@akun/video/7667019281493691666
  const fromPath = value.match(/\/video\/(\d{6,})/);
  if (fromPath) return fromPath[1];

  // https://m.tiktok.com/v/7667019281493691666.html
  const fromV = value.match(/\/v\/(\d{6,})/);
  if (fromV) return fromV[1];

  // ?item_id=7667019281493691666
  const fromQuery = value.match(/[?&]item_id=(\d{6,})/);
  if (fromQuery) return fromQuery[1];

  // admin menempel angka ID-nya saja
  const bare = value.match(/^\d{6,}$/);
  if (bare) return bare[0];

  return null;
}

/** Link pendek hasil tombol "Salin tautan" di aplikasi TikTok. */
export function isTiktokShortLink(url: string): boolean {
  return /(vt|vm)\.tiktok\.com/i.test(url);
}

/** Membersihkan URL sebelum ditaruh di atribut HTML embed. */
export function sanitizeTiktokUrl(url: string): string {
  const cleaned = url.trim().replace(/[^A-Za-z0-9:/?@._~%&=\-]/g, "");
  return /^https:\/\/(www\.)?tiktok\.com\//i.test(cleaned)
    ? cleaned
    : "https://www.tiktok.com/";
}
