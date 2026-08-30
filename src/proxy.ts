import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminCookie } from "@/lib/adminToken";

/**
 * Penjaga halaman /admin (konvensi "proxy" Next.js 16).
 * Yang boleh masuk hanya admin yang sudah login lewat /admin/login
 * (akun diatur di .env.local: ADMIN_EMAIL & ADMIN_PASSWORD).
 */
export default async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname.startsWith("/admin/login");
  const cookieValue = request.cookies.get(ADMIN_COOKIE)?.value;
  const isAdmin = await isValidAdminCookie(cookieValue);

  if (!isAdmin && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAdmin && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
