import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import ImageSlider from "@/components/ui/ImageSlider";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { getSettings, getVehicleBySlug } from "@/lib/data";
import { buildWhatsAppLink, formatMileage, formatPrice } from "@/lib/utils";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);

  if (!vehicle) return { title: "Unit tidak ditemukan" };

  return {
    title: vehicle.name,
    description: vehicle.description || `${vehicle.name} di Duta Motor`,
  };
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  Tersedia: "success",
  Booking: "warning",
  "Sold Out": "danger",
};

export default async function VehicleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [settings, vehicle] = await Promise.all([
    getSettings(),
    getVehicleBySlug(slug),
  ]);

  if (!vehicle) notFound();

  const specs = [
    { label: "Tahun", value: String(vehicle.year || "-"), icon: "calendar" },
    { label: "Transmisi", value: vehicle.transmission, icon: "gear" },
    { label: "Bahan Bakar", value: vehicle.fuelType, icon: "fuel" },
    {
      label: "Kilometer",
      value: formatMileage(vehicle.mileage),
      icon: "speedometer",
    },
    { label: "Warna", value: vehicle.color || "-", icon: "color" },
    { label: "Kategori", value: vehicle.category, icon: "car" },
  ];

  return (
    <>
      <Navbar settings={settings} />

      <main className="flex-1 pt-20 lg:pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/mobil"
            className="inline-flex items-center gap-2 mt-6 mb-6 text-sm font-semibold text-ink-soft hover:text-brand transition-colors"
          >
            <Icon name="chevronLeft" size={16} />
            Kembali ke daftar mobil
          </Link>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Galeri foto */}
            <div className="lg:col-span-3">
              <ImageSlider images={vehicle.images} alt={vehicle.name} />

              {vehicle.images.length > 1 && (
                <p className="mt-3 text-xs text-ink-muted text-center">
                  Geser foto ke kiri/kanan untuk melihat {vehicle.images.length}{" "}
                  foto unit ini.
                </p>
              )}
            </div>

            {/* Informasi unit */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant={STATUS_VARIANT[vehicle.status] ?? "default"}>
                    {vehicle.status}
                  </Badge>
                  <Badge variant="info">{vehicle.category}</Badge>
                </div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-ink leading-tight">
                  {vehicle.name}
                </h1>
                <p className="mt-3 text-3xl font-extrabold text-brand">
                  {formatPrice(vehicle.price)}
                </p>
              </div>

              <div className="soft-card rounded-2xl p-5">
                <p className="text-sm font-bold text-ink mb-4">
                  Spesifikasi
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-start gap-3">
                      <span className="w-9 h-9 rounded-xl bg-surface-soft text-ink-soft flex items-center justify-center shrink-0">
                        <Icon name={spec.icon} size={15} />
                      </span>
                      <span>
                        <span className="block text-[11px] text-ink-muted font-medium">
                          {spec.label}
                        </span>
                        <span className="block text-sm font-semibold text-ink">
                          {spec.value}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={buildWhatsAppLink(settings, vehicle.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="whatsapp" size="lg" className="w-full">
                    <Icon name="whatsapp" size={18} />
                    Tanya Unit Ini
                  </Button>
                </a>
                <a
                  href={`tel:${settings.whatsappDisplay}`}
                  className="w-full sm:w-auto"
                >
                  <Button variant="outline" size="lg" className="w-full">
                    <Icon name="phone" size={16} />
                    Telepon
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Deskripsi & fitur */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 mt-10">
            {vehicle.description && (
              <div className="lg:col-span-3 soft-card rounded-2xl p-6">
                <h2 className="text-base font-bold text-ink mb-3">
                  Deskripsi Unit
                </h2>
                <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              </div>
            )}

            {vehicle.features.length > 0 && (
              <div className="lg:col-span-2 soft-card rounded-2xl p-6">
                <h2 className="text-base font-bold text-ink mb-3">
                  Fitur
                </h2>
                <ul className="space-y-2.5">
                  {vehicle.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm text-ink-soft"
                    >
                      <span className="w-6 h-6 rounded-lg bg-tint-green text-green flex items-center justify-center shrink-0">
                        <Icon name="checkSmall" size={13} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer settings={settings} />
      <FloatingWhatsApp settings={settings} />
    </>
  );
}
