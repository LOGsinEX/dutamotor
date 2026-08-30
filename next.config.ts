import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Menghilangkan peringatan "Blocked cross-origin request" saat membuka
  // dev server dari HP / perangkat lain di jaringan yang sama.
  allowedDevOrigins: ["localhost", "127.0.0.1", "10.20.30.197", "*.local"],
  // Menyembunyikan lingkaran "N" (Next.js Dev Tools) di pojok kiri bawah.
  // Error saat kompilasi tetap ditampilkan seperti biasa.
  devIndicators: false,
};

export default nextConfig;
