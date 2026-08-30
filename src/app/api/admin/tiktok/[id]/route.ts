import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import { createAdminClient, isServiceReady } from "@/lib/supabase/admin";
import { describeSupabaseError } from "@/lib/supabaseError";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

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

/** PUT /api/admin/tiktok/[id] — ubah judul video */
export async function PUT(request: Request, context: Context) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const { id } = await context.params;
    const body = await request.json();

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("tiktok_videos")
      .update({ caption: String(body.caption ?? "").trim() })
      .eq("id", id);

    if (error) {
      return NextResponse.json(describeSupabaseError(error), { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}

/** DELETE /api/admin/tiktok/[id] — hapus video dari daftar */
export async function DELETE(_request: Request, context: Context) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const { id } = await context.params;
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("tiktok_videos")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(describeSupabaseError(error), { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}
