import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminGuard";
import {
  createAdminClient,
  isServiceReady,
  VEHICLE_BUCKET,
} from "@/lib/supabase/admin";

/** POST /api/admin/upload — unggah foto unit (bisa banyak sekaligus) */
export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      { error: "Sesi berakhir. Silakan login ulang." },
      { status: 401 }
    );
  }

  if (!isServiceReady) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY belum diatur di .env.local." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((item): item is File => item instanceof File && item.size > 0);
  const folder =
    String(formData.get("folder") || "unit")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "") || "unit";

  if (files.length === 0) {
    return NextResponse.json(
      { error: "Tidak ada foto yang dikirim." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const urls: string[] = [];

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const extension =
      (file.name.split(".").pop() || "jpg")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") || "jpg";
    const path = `${folder}/${Date.now()}-${index}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage
      .from(VEHICLE_BUCKET)
      .upload(path, buffer, {
        contentType: file.type || "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return NextResponse.json(
        { error: `Gagal mengunggah foto: ${file.name}` },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(VEHICLE_BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return NextResponse.json({ urls });
}
