"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { buildWhatsAppLink } from "@/lib/utils";
import type { SiteSettings } from "@/data/types";

interface FloatingWhatsAppProps {
  settings: SiteSettings;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href={buildWhatsAppLink(settings)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp Duta Motor"
      className={`fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-wa to-wa-strong px-4 py-3.5 text-white shadow-lg shadow-wa/40 transition-all duration-500 hover:brightness-110 min-h-[52px] ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0 pointer-events-none"
      }`}
    >
      <Icon name="whatsapp" size={22} />
      <span className="hidden sm:inline text-sm font-semibold">
        Chat WhatsApp
      </span>
    </a>
  );
}
