import type { SiteSettings } from "./types";

export const SITE_CONFIG = {
  name: "Duta Motor",
  shortName: "DM",
  description:
    "Duta Motor - Jual beli mobil bekas berkualitas di Lingkar Cidadap, Curug, Kota Serang, Banten. Temukan mobil impian Anda dengan harga terjangkau.",
  url: "https://dutamotor.com",
} as const;

/** Link Google Maps showroom (dibuka pengunjung dari tombol peta). */
export const MAPS_LINK = "https://maps.app.goo.gl/NQjzRiKYJrSxmFdG9";

/** Peta yang tampil di halaman (embed tanpa API key). */
export const MAPS_EMBED =
  "https://maps.google.com/maps?q=Lingkar%20Cidadap%2C%20Curug%2C%20Kota%20Serang%2C%20Banten&t=&z=15&ie=UTF8&iwloc=&output=embed";

/**
 * Nilai bawaan. Nilai sebenarnya diambil dari tabel site_settings di Supabase
 * dan bisa diubah admin lewat halaman /admin/pengaturan.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  whatsappNumber: "6287773960771",
  whatsappDisplay: "087773960771",
  tiktokUrl: "",
  instagramUrl: "",
  facebookUrl: "",
  locationFull: "Lingkar Cidadap, Lebak, Kec. Curug, Kota Serang, Banten 42171",
};

export const NAVIGATION = [
  { label: "Beranda", href: "#beranda" },
  { label: "Mobil Tersedia", href: "#mobil-tersedia" },
  { label: "Keunggulan", href: "#keunggulan" },
  { label: "Tentang Kami", href: "#tentang-kami" },
  { label: "Cara Pembelian", href: "#cara-pembelian" },
  { label: "Kontak", href: "#kontak" },
] as const;

export const VEHICLE_CATEGORIES = [
  "Semua",
  "MPV",
  "SUV",
  "City Car",
  "Sedan",
  "Pick Up",
  "Lainnya",
] as const;

export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number];

export const CATEGORY_OPTIONS: string[] = VEHICLE_CATEGORIES.filter(
  (category) => category !== "Semua"
);

export const TRANSMISSION_OPTIONS: string[] = ["Manual", "Automatic", "CVT"];
export const FUEL_OPTIONS: string[] = ["Bensin", "Diesel", "Hybrid", "Listrik"];
export const STATUS_OPTIONS: string[] = ["Tersedia", "Booking", "Sold Out"];
