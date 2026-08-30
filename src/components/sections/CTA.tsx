"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { buildWhatsAppLink } from "@/lib/utils";
import type { SiteSettings } from "@/data/types";

interface CTAProps {
  settings: SiteSettings;
}

export default function CTA({ settings }: CTAProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="rgb-frame relative overflow-hidden rounded-3xl px-6 py-10 sm:py-12 lg:px-16 lg:py-16 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-brand/25 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-cyan/20 blur-3xl" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink mb-4">
              Siap Menemukan <span className="text-rgb">Mobil Impian</span> Anda?
            </h2>
            <p className="text-ink-soft max-w-2xl mx-auto mb-8">
              Hubungi kami sekarang lewat WhatsApp. Tim Duta Motor siap
              membantu Anda memilih unit yang paling cocok dengan kebutuhan dan
              budget.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={buildWhatsAppLink(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="whatsapp" size="lg" className="w-full">
                  <Icon name="whatsapp" size={20} />
                  Chat WhatsApp Sekarang
                </Button>
              </a>
              <a
                href={`tel:${settings.whatsappDisplay}`}
                className="w-full sm:w-auto"
              >
                <Button variant="outline" size="lg" className="w-full">
                  <Icon name="phone" size={18} />
                  {settings.whatsappDisplay}
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
