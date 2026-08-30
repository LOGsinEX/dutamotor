import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import {
  createAdminClient,
  isServiceReady,
  removeImagesByUrl,
} from "@/lib/supabase/admin";
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

/** GET /api/admin/vehicles/[id] — ambil satu unit untuk halaman ubah */
export async function GET(_request: Request, context: Context) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const { id } = await context.params;
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json(describeSupabaseError(error), { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "Unit tidak ditemukan.", detail: "", hint: "" },
        { status: 404 }
      );
    }

    return NextResponse.json({ vehicle: data });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}

/** PUT /api/admin/vehicles/[id] — ubah unit (+ hapus foto yang dibuang) */
export async function PUT(request: Request, context: Context) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const imagesToRemove: string[] = Array.isArray(body.imagesToRemove)
      ? body.imagesToRemove
      : [];
    delete body.imagesToRemove;

    const supabase = createAdminClient();
    const { error } = await supabase.from("vehicles").update(body).eq("id", id);

    if (error) {
      return NextResponse.json(describeSupabaseError(error), { status: 500 });
    }

    if (imagesToRemove.length > 0) {
      await removeImagesByUrl(supabase, imagesToRemove);
    }

    return NextResponse.json({ ok: true });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}

/** DELETE /api/admin/vehicles/[id] — hapus unit + foto-fotonya */
export async function DELETE(_request: Request, context: Context) {
  const blocked = await guard();
  if (blocked) return blocked;

  try {
    const { id } = await context.params;
    const supabase = createAdminClient();

    // Ambil daftar foto dulu supaya bisa dihapus dari storage
    const { data } = await supabase
      .from("vehicles")
      .select("images")
      .eq("id", id)
      .maybeSingle();

    const { error } = await supabase.from("vehicles").delete().eq("id", id);

    if (error) {
      return NextResponse.json(describeSupabaseError(error), { status: 500 });
    }

    if (Array.isArray(data?.images) && data.images.length > 0) {
      await removeImagesByUrl(supabase, data.images as string[]);
    }

    return NextResponse.json({ ok: true });
  } catch (caught) {
    return NextResponse.json(describeSupabaseError(caught), { status: 500 });
  }
}
