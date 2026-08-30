import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { createAdminClient, isServiceReady } from "@/lib/supabase/admin";
import { describeSupabaseError } from "@/lib/supabaseError";

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

/** GET /api/admin/settings — ambil pengaturan kontak */
export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      return NextResponse.json(describeSupabaseError(error), { status: 500 });
    }

    return NextResponse.json({ settings: data ?? null });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}

/** PUT /api/admin/settings — simpan nomor WA & sosial media */
export async function PUT(request: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const supabase = createAdminClient();

    const { error } = await supabase.from("site_settings").upsert({
      id: 1,
      whatsapp_number: String(body.whatsapp_number ?? ""),
      whatsapp_display: String(body.whatsapp_display ?? ""),
      tiktok_url: String(body.tiktok_url ?? ""),
      instagram_url: String(body.instagram_url ?? ""),
      facebook_url: String(body.facebook_url ?? ""),
      location_full: String(body.location_full ?? ""),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json(describeSupabaseError(error), { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}
