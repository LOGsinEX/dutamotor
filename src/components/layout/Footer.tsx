import Link from "next/link";
import Image from "next/image";
import { NAVIGATION, SITE_CONFIG } from "@/data/constants";
import Icon from "@/components/ui/Icon";
import { buildWhatsAppLink, normalizeUrl } from "@/lib/utils";
import type { SiteSettings } from "@/data/types";

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const waLink = buildWhatsAppLink(settings);
  const tiktok = normalizeUrl(settings.tiktokUrl);
  const instagram = normalizeUrl(settings.instagramUrl);

  const socials = [
    {
      label: "WhatsApp",
      href: waLink,
      icon: "whatsapp",
      style: "bg-tint-green text-green",
    },
    instagram && {
      label: "Instagram",
      href: instagram,
      icon: "instagram",
      style: "bg-brand-soft text-brand",
    },
    tiktok && {
      label: "TikTok",
      href: tiktok,
      icon: "tiktok",
      style: "bg-surface-soft text-ink",
    },
  ].filter(Boolean) as Array<{
    label: string;
    href: string;
    icon: string;
    style: string;
  }>;

  return (
    <footer className="relative z-10 bg-surface/70 backdrop-blur-xl border-t border-line">
      {/* Garis gradien RGB di tepi atas footer */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-brand/60 shadow-[0_0_16px_-2px] shadow-brand/50">
                <Image
                  src="/images/logo.jpeg"
                  alt="Logo Duta Motor"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-extrabold text-ink text-sm leading-tight">
                  DUTA
                </p>
                <p className="text-[10px] text-brand font-bold tracking-widest uppercase leading-tight">
                  MOTOR
                </p>
              </div>
            </div>
            <p className="text-sm text-ink-soft leading-relaxed">
              Jual beli mobil bekas berkualitas di {settings.locationFull}.
              Temukan mobil impian Anda dengan harga terjangkau.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-ink font-bold text-sm mb-4 uppercase tracking-wider">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-soft hover:text-brand transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-ink font-bold text-sm mb-4 uppercase tracking-wider">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-9 h-9 bg-tint-blue rounded-xl flex items-center justify-center shrink-0">
                  <Icon name="location" size={15} className="text-blue" />
                </div>
                <span className="text-sm text-ink-soft pt-2">
                  {settings.locationFull}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 bg-tint-green rounded-xl flex items-center justify-center shrink-0">
                  <Icon name="phone" size={15} className="text-green" />
                </div>
                <a
                  href={`tel:${settings.whatsappDisplay}`}
                  className="text-sm text-ink-soft hover:text-brand transition-colors"
                >
                  {settings.whatsappDisplay}
                </a>
              </li>
            </ul>
          </div>

          {/* Sosial media */}
          <div>
            <h3 className="text-ink font-bold text-sm mb-4 uppercase tracking-wider">
              Ikuti Kami
            </h3>
            <div className="flex flex-col gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-ink-soft hover:text-ink transition-colors"
                >
                  <span
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${social.style}`}
                  >
                    <Icon name={social.icon} size={15} />
                  </span>
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bagian bawah */}
        <div className="mt-10 pt-8 border-t border-line">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-ink-soft">
              &copy; {currentYear} {SITE_CONFIG.name}. Hak cipta dilindungi.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
            >
              <Icon name="lock" size={13} />
              Login Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
