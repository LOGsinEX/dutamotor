import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import Hero from "@/components/sections/Hero";
import VehicleCatalog from "@/components/sections/VehicleCatalog";
import Advantages from "@/components/sections/Advantages";
import TiktokShowcase from "@/components/sections/TiktokShowcase";
import About from "@/components/sections/About";
import PurchaseProcess from "@/components/sections/PurchaseProcess";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Contact from "@/components/sections/Contact";
import { getSettings, getTiktokVideos, getVehicles } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [settings, vehicles, tiktokVideos] = await Promise.all([
    getSettings(),
    getVehicles(),
    getTiktokVideos(),
  ]);

  return (
    <>
      <Navbar settings={settings} />
      {/* relative + z-10 supaya konten tampil di atas latar aurora */}
      <main className="relative z-10 flex-1">
        <Hero settings={settings} vehicleCount={vehicles.length} />
        <VehicleCatalog vehicles={vehicles} settings={settings} limit={6} />
        <Advantages />
        <TiktokShowcase videos={tiktokVideos} settings={settings} />
        <About settings={settings} />
        <PurchaseProcess />
        <Testimonials />
        <CTA settings={settings} />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
      <FloatingWhatsApp settings={settings} />
    </>
  );
}
