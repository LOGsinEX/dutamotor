import { DEFAULT_SETTINGS } from "@/data/constants";
import { fallbackVehicles } from "@/data/vehicles";
import type {
  SiteSettings,
  TiktokVideo,
  Vehicle,
  VehicleStatus,
} from "@/data/types";
import { createPublicClient, isSupabaseConfigured } from "./supabase/public";

const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").host;
  } catch {
    return "(alamat tidak valid)";
  }
})();

/**
 * Sengaja memakai console.warn, bukan console.error, supaya overlay merah
 * Next.js tidak menutupi layar saat pengembangan. Ini kondisi yang sudah
 * ditangani (halaman tetap tampil), jadi cukup jadi peringatan di terminal.
 */
function warnSupabase(context: string, message: string) {
  console.warn(
    `\n[Supabase] ${context}: ${message}` +
      `\n  Target : ${supabaseHost}` +
      `\n  Periksa: alamat project benar? project tidak sedang Paused? internet aktif?` +
      `\n  Diagnosa lengkap: buka /admin lalu klik "Cek Koneksi Database".\n`
  );
}

type VehicleRow = {
  id: string;
  created_at: string | null;
  slug: string;
  name: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  price: number | null;
  transmission: string | null;
  fuel_type: string | null;
  mileage: number | null;
  color: string | null;
  category: string | null;
  status: string | null;
  description: string | null;
  features: string[] | null;
  images: string[] | null;
};

type SettingsRow = {
  whatsapp_number: string | null;
  whatsapp_display: string | null;
  tiktok_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  location_full: string | null;
};

export function mapVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand ?? "",
    model: row.model ?? "",
    year: row.year ?? 0,
    price: Number(row.price ?? 0),
    transmission: row.transmission ?? "Manual",
    fuelType: row.fuel_type ?? "Bensin",
    mileage: Number(row.mileage ?? 0),
    color: row.color ?? "",
    category: row.category ?? "Lainnya",
    status: (row.status as VehicleStatus) ?? "Tersedia",
    description: row.description ?? "",
    features: row.features ?? [],
    images: row.images ?? [],
    createdAt: row.created_at ?? undefined,
  };
}

export async function getVehicles(): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) return fallbackVehicles;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    // Jangan tampilkan mobil contoh kalau Supabase sudah diatur — lebih baik
    // kosong daripada menampilkan data palsu. Penyebabnya dicetak di terminal.
    warnSupabase("Gagal memuat daftar unit", error.message);
    return [];
  }

  return ((data ?? []) as VehicleRow[]).map(mapVehicle);
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  if (!isSupabaseConfigured) {
    return fallbackVehicles.find((vehicle) => vehicle.slug === slug) ?? null;
  }

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    warnSupabase("Gagal memuat detail unit", error.message);
    return null;
  }

  if (!data) return null;
  return mapVehicle(data as VehicleRow);
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured) return DEFAULT_SETTINGS;

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    warnSupabase("Gagal memuat pengaturan", error.message);
    return DEFAULT_SETTINGS;
  }

  if (!data) return DEFAULT_SETTINGS;

  const row = data as SettingsRow;
  return {
    whatsappNumber: row.whatsapp_number || DEFAULT_SETTINGS.whatsappNumber,
    whatsappDisplay: row.whatsapp_display || DEFAULT_SETTINGS.whatsappDisplay,
    tiktokUrl: row.tiktok_url || "",
    instagramUrl: row.instagram_url || "",
    facebookUrl: row.facebook_url || "",
    locationFull: row.location_full || DEFAULT_SETTINGS.locationFull,
  };
}

type TiktokRow = {
  id: string;
  url: string;
  video_id: string;
  caption: string | null;
  position: number | null;
};

export async function getTiktokVideos(): Promise<TiktokVideo[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tiktok_videos")
    .select("id, url, video_id, caption, position")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    // Umumnya karena tabel tiktok_videos belum dibuat (schema.sql lama).
    // Website tetap jalan; bagian video hanya disembunyikan.
    warnSupabase("Gagal memuat video TikTok", error.message);
    return [];
  }

  return ((data ?? []) as TiktokRow[]).map((row) => ({
    id: row.id,
    url: row.url,
    videoId: row.video_id,
    caption: row.caption ?? "",
    position: Number(row.position ?? 0),
  }));
}
