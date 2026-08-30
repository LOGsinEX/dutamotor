import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import VehicleCatalog from "@/components/sections/VehicleCatalog";
import { getSettings, getVehicles } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Mobil Tersedia",
  description:
    "Daftar lengkap mobil bekas yang tersedia di Duta Motor.",
};

export default async function VehiclesPage() {
  const [settings, vehicles] = await Promise.all([
    getSettings(),
    getVehicles(),
  ]);

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-1 pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 text-center">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-ink mb-3">
            Semua <span className="text-brand">Mobil Tersedia</span>
          </h1>
          <p className="text-ink-soft max-w-2xl mx-auto">
            {vehicles.length} unit siap dilihat. Gunakan pencarian dan filter
            untuk menemukan mobil yang paling cocok.
          </p>
        </div>
        <VehicleCatalog
          vehicles={vehicles}
          settings={settings}
          showHeader={false}
        />
      </main>
      <Footer settings={settings} />
      <FloatingWhatsApp settings={settings} />
    </>
  );
}
