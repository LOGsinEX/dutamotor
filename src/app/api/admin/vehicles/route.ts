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
        hint: "Tambahkan SUPABASE_SERVICE_ROLE_KEY (Project Settings > API > service_role) ke file .env, lalu hentikan dan jalankan ulang npm run dev.",
      },
      { status: 500 }
    );
  }
  return null;
}

/** GET /api/admin/vehicles — daftar unit (lewat server, kebal aturan RLS) */
export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("id, slug, name, price, year, status, category, images")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(describeSupabaseError(error), { status: 500 });
    }

    return NextResponse.json({ vehicles: data ?? [] });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}

/** POST /api/admin/vehicles — tambah unit baru */
export async function POST(request: Request) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const payload = await request.json();
    const supabase = createAdminClient();
    const { error } = await supabase.from("vehicles").insert(payload);

    if (error) {
      return NextResponse.json(describeSupabaseError(error), { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}
