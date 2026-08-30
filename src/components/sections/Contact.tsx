"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { MAPS_LINK } from "@/data/constants";
import { buildWhatsAppLink, normalizeUrl } from "@/lib/utils";
import type { SiteSettings } from "@/data/types";

interface ContactProps {
  settings: SiteSettings;
}

export default function Contact({ settings }: ContactProps) {
  const waLink = buildWhatsAppLink(settings);
  const tiktok = normalizeUrl(settings.tiktokUrl);
  const instagram = normalizeUrl(settings.instagramUrl);

  const channels = [
    {
      label: "WhatsApp",
      value: settings.whatsappDisplay,
      href: waLink,
      icon: "whatsapp",
      tone: "bg-tint-green text-green border-tint-green",
    },
    instagram && {
      label: "Instagram",
      value: "Lihat profil kami",
      href: instagram,
      icon: "instagram",
      tone: "bg-brand-soft text-brand border-brand-soft",
    },
    tiktok && {
      label: "TikTok",
      value: "Video unit terbaru",
      href: tiktok,
      icon: "tiktok",
      tone: "bg-surface-soft text-ink border-line",
    },
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    href: string;
    icon: string;
    tone: string;
  }>;

  return (
    <section id="kontak" className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-surface/60 backdrop-blur text-brand border border-line px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
            <Icon name="chat" size={14} />
            <span>Kontak</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink mb-2 sm:mb-3">
            Hubungi <span className="text-rgb">Kami</span>
          </h2>
          <p className="text-ink-soft">
            Pilih cara yang paling nyaman untuk Anda. Kami balas dengan cepat dan
            ramah.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {channels.map((channel, index) => (
            <motion.a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className="soft-card rounded-2xl p-6 flex items-center gap-4 hover:-translate-y-1 hover:border-brand/40 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span
                className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${channel.tone}`}
              >
                <Icon name={channel.icon} size={22} />
              </span>
              <span>
                <span className="block text-sm font-bold text-ink">
                  {channel.label}
                </span>
                <span className="block text-sm text-ink-soft">
                  {channel.value}
                </span>
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-6 soft-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-xl bg-tint-blue border border-tint-blue text-blue flex items-center justify-center shrink-0">
              <Icon name="location" size={22} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Alamat Showroom</p>
              <p className="text-sm text-ink-soft">{settings.locationFull}</p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline"
              >
                Buka di Google Maps
                <Icon name="arrowRight" size={12} />
              </a>
            </div>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="primary" size="md" className="w-full">
              <Icon name="chat" size={16} />
              Tanya Ketersediaan Unit
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
