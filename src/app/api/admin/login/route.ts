import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCredentials,
  computeAdminToken,
} from "@/lib/adminToken";

/** POST /api/admin/login — masuk admin pakai akun dari .env */
export async function POST(request: Request) {
  let body: { email?: string; password?: string } = {};
  try {
    body = await request.json();
  } catch {
    // body kosong / bukan JSON
  }

  const creds = adminCredentials();
  if (!creds.configured) {
    return NextResponse.json(
      {
        error:
          "Akun admin belum diatur. Isi ADMIN_EMAIL dan ADMIN_PASSWORD di file .env.local lalu restart server.",
      },
      { status: 500 }
    );
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (email !== creds.email || body.password !== creds.password) {
    return NextResponse.json(
      { error: "Email atau password salah. Silakan coba lagi." },
      { status: 401 }
    );
  }

  const token = await computeAdminToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token!, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
