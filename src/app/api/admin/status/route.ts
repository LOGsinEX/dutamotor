import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { createAdminClient, isServiceReady } from "@/lib/supabase/admin";
import { describeSupabaseError } from "@/lib/supabaseError";

export const dynamic = "force-dynamic";

/** Menerjemahkan kode error jaringan Node.js ke bahasa manusia. */
function explainNetworkCode(code: string, message: string): string {
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") {
    return "Alamat project tidak ditemukan (DNS gagal). Biasanya karena NEXT_PUBLIC_SUPABASE_URL salah ketik, masih berisi contoh, atau project sudah dihapus.";
  }
  if (code === "ECONNREFUSED") {
    return "Koneksi ditolak server. Pastikan alamat project benar dan project Supabase tidak sedang Paused.";
  }
  if (code === "TIMEOUT" || code === "UND_ERR_CONNECT_TIMEOUT") {
    return "Waktu koneksi habis. Kemungkinan internet lambat, atau firewall / antivirus / VPN memblokir akses keluar dari Node.js.";
  }
  if (code.includes("CERT") || /certificate|self.signed/i.test(message)) {
    return "Sertifikat HTTPS ditolak. Biasanya karena antivirus atau proxy kantor yang memeriksa lalu lintas HTTPS.";
  }
  return `Tidak bisa menghubungi server Supabase (${code || "fetch failed"}). Cek koneksi internet dan status project di dashboard Supabase.`;
}

/** Uji koneksi mentah ke server Supabase, terpisah dari query database. */
async function probeConnection(rawUrl: string) {
  let host = rawUrl;
  try {
    host = new URL(rawUrl).host;
  } catch {
    return {
      host: rawUrl || "(kosong)",
      reachable: false,
      explanation:
        "NEXT_PUBLIC_SUPABASE_URL bukan alamat yang valid. Formatnya harus https://xxxxxxxx.supabase.co (bukan link dashboard).",
    };
  }

  // Deteksi nilai contoh yang lupa diganti
  if (/xxxx|your-project|contoh|example/i.test(host)) {
    return {
      host,
      reachable: false,
      explanation:
        "Alamat masih berisi teks contoh dari .env.example. Ganti dengan URL project Anda dari Project Settings > API > Project URL.",
    };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `${rawUrl.replace(/\/$/, "")}/auth/v1/health`,
      { signal: controller.signal, cache: "no-store" }
    );
    return { host, reachable: true, httpStatus: response.status };
  } catch (caught) {
    const error = caught as Error & { cause?: { code?: string } };
    const code =
      error.cause?.code ?? (error.name === "AbortError" ? "TIMEOUT" : "");
    return {
      host,
      reachable: false,
      code,
      explanation: explainNetworkCode(code, error.message),
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * GET /api/admin/status — diagnosa koneksi.
 * Menunjukkan variabel .env mana yang terbaca (tanpa membocorkan isinya),
 * apakah server Supabase bisa dihubungi, dan hasil query ke tabel.
 */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Sesi berakhir. Silakan login ulang." },
      { status: 401 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  const env = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(url),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    ADMIN_EMAIL: Boolean(process.env.ADMIN_EMAIL),
    ADMIN_PASSWORD: Boolean(process.env.ADMIN_PASSWORD),
  };

  const connection = await probeConnection(url);

  if (!isServiceReady) {
    return NextResponse.json({
      env,
      connection,
      database: {
        ok: false,
        error: "SUPABASE_SERVICE_ROLE_KEY belum diatur.",
        hint: "Tambahkan SUPABASE_SERVICE_ROLE_KEY ke file .env lalu jalankan ulang npm run dev.",
      },
    });
  }

  // Kalau servernya saja tidak bisa dihubungi, query pasti gagal juga
  if (!connection.reachable) {
    return NextResponse.json({
      env,
      connection,
      database: {
        ok: false,
        error: "Tidak bisa terhubung ke Supabase.",
        hint: connection.explanation,
      },
    });
  }

  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase
      .from("vehicles")
      .select("id", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({
        env,
        connection,
        database: { ok: false, ...describeSupabaseError(error) },
      });
    }

    return NextResponse.json({
      env,
      connection,
      database: { ok: true, vehicleCount: count ?? 0 },
    });
  } catch (caught) {
    return NextResponse.json({
      env,
      connection,
      database: { ok: false, ...describeSupabaseError(caught) },
    });
  }
}
