import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { createAdminClient, isServiceReady } from "@/lib/supabase/admin";
import { describeSupabaseError } from "@/lib/supabaseError";
import { extractTiktokVideoId, isTiktokShortLink } from "@/lib/tiktok";

export const dynamic = "force-dynamic";

async function guard() {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Sesi berakhir. Silakan login ulang." },
      { status: 401 }
    );
  }
  if (!isServiceReady) {
    return NextResponse.json(
      {
        error: "SUPABASE_SERVICE_ROLE_KEY belum diatur.",
        hint: "Tambahkan SUPABASE_SERVICE_ROLE_KEY ke file .env lalu jalankan ulang npm run dev.",
      },
      { status: 500 }
    );
  }
  return null;
}

/** Link pendek vt.tiktok.com diikuti sampai ketemu alamat aslinya. */
async function resolveShortLink(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      },
    });
    return response.url || url;
  } catch {
    return url;
  } finally {
    clearTimeout(timer);
  }
}

/** GET /api/admin/tiktok — daftar video */
export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("tiktok_videos")
      .select("id, url, video_id, caption, position")
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(describeSupabaseError(error), { status: 500 });
    }

    return NextResponse.json({ videos: data ?? [] });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}

/** POST /api/admin/tiktok — tambah video dari link */
export async function POST(request: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const rawUrl = String(body.url ?? "").trim();
    const caption = String(body.caption ?? "").trim();

    if (!rawUrl) {
      return NextResponse.json(
        { error: "Link TikTok wajib diisi.", detail: "", hint: "" },
        { status: 400 }
      );
    }

    // Link pendek diubah dulu jadi link panjang agar ID videonya terbaca
    let finalUrl = rawUrl;
    if (isTiktokShortLink(rawUrl)) {
      finalUrl = await resolveShortLink(rawUrl);
    }

    const videoId = extractTiktokVideoId(finalUrl);

    if (!videoId) {
      return NextResponse.json(
        {
          error: "Link TikTok tidak dikenali.",
          detail: `Alamat yang diproses: ${finalUrl}`,
          hint: "Buka videonya di aplikasi TikTok, tekan Bagikan > Salin tautan, lalu tempel di sini. Bentuk yang pasti berhasil: https://www.tiktok.com/@akun/video/7667019281493691666",
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Video baru diletakkan di urutan paling belakang
    const { data: last } = await supabase
      .from("tiktok_videos")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextPosition = Number(last?.position ?? 0) + 1;

    const { error } = await supabase.from("tiktok_videos").insert({
      url: finalUrl,
      video_id: videoId,
      caption,
      position: nextPosition,
    });

    if (error) {
      return NextResponse.json(describeSupabaseError(error), { status: 500 });
    }

    return NextResponse.json({ ok: true, videoId });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}

/** PUT /api/admin/tiktok — simpan urutan baru */
export async function PUT(request: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const order: string[] = Array.isArray(body.order) ? body.order : [];

    if (order.length === 0) {
      return NextResponse.json({ ok: true });
    }

    const supabase = createAdminClient();

    for (let index = 0; index < order.length; index += 1) {
      const { error } = await supabase
        .from("tiktok_videos")
        .update({ position: index + 1 })
        .eq("id", order[index]);

      if (error) {
        return NextResponse.json(describeSupabaseError(error), { status: 500 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}
