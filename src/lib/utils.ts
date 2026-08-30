import type { SiteSettings } from "@/data/types";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price || 0);
}

export function formatMileage(mileage: number): string {
  return `${new Intl.NumberFormat("id-ID").format(mileage || 0)} km`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const WA_BASE = ["https:", "", "wa.me"].join("/");

/** Link WhatsApp memakai nomor yang tersimpan di pengaturan admin. */
export function buildWhatsAppLink(
  settings: Pick<SiteSettings, "whatsappNumber">,
  vehicleName?: string
): string {
  const phone = (settings.whatsappNumber || "").replace(/[^0-9]/g, "");
  const message = vehicleName
    ? `Halo Duta Motor, saya tertarik dengan ${vehicleName} yang saya lihat di website. Apakah unit tersebut masih tersedia?`
    : "Halo Duta Motor, saya ingin bertanya tentang mobil bekas yang tersedia.";

  return `${WA_BASE}/${phone}?text=${encodeURIComponent(message)}`;
}

/** Menyeragamkan link sosial media agar selalu bisa diklik. */
export function normalizeUrl(url: string): string {
  const value = (url || "").trim();
  if (!value) return "";
  if (/^https?:/i.test(value)) return value;
  return ["https:", "", value.replace(/^\/+/, "")].join("/");
}
