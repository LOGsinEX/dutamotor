import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/data/constants";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { getSettings } from "@/lib/data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | Jual Beli Mobil Bekas di Serang`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "jual beli mobil bekas",
    "mobil bekas Serang",
    "mobil bekas Curug Serang",
    "showroom mobil Serang",
    "mobil bekas murah Serang",
    "Duta Motor",
    "mobil bekas Banten",
    "mobil bekas Cilegon",
    "mobil second Serang",
    "mobil bekas berkualitas",
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | Jual Beli Mobil Bekas di Serang`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | Jual Beli Mobil Bekas di Serang`,
    description: SITE_CONFIG.description,
  },
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: { canonical: SITE_CONFIG.url },
  robots: { index: true, follow: true },
};

/**
 * Script kecil yang jalan sebelum halaman digambar, supaya tema tersimpan
 * langsung dipakai tanpa kedipan putih (flash).
 * Default: tema gelap.
 */
const themeScript = `(function(){try{var t=localStorage.getItem("rian-mobil-theme");var l=t==="light";var c=document.documentElement.classList;c.add(l?"light":"dark");c.remove(l?"dark":"light");}catch(e){document.documentElement.classList.add("dark");}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  const sameAs = [
    settings.tiktokUrl,
    settings.instagramUrl,
    settings.facebookUrl,
  ].filter(Boolean);

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoDealer",
              name: SITE_CONFIG.name,
              description: SITE_CONFIG.description,
              url: SITE_CONFIG.url,
              telephone: `+${settings.whatsappNumber}`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Lingkar Cidadap, Lebak, Kecamatan Curug",
                addressLocality: "Serang",
                addressRegion: "Banten",
                postalCode: "42171",
                addressCountry: "ID",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -6.2366,
                longitude: 106.2537,
              },
              sameAs,
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        {/* Latar aurora: cahaya warna-warni bergerak pelan di seluruh halaman */}
        <div className="aurora-bg" aria-hidden="true">
          <div className="aurora-orb aurora-orb-1" />
          <div className="aurora-orb aurora-orb-2" />
          <div className="aurora-orb aurora-orb-3" />
          <div className="aurora-orb aurora-orb-4" />
          <div className="aurora-grid" />
        </div>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
