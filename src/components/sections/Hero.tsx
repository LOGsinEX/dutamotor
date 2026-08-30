"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { buildWhatsAppLink } from "@/lib/utils";
import type { SiteSettings } from "@/data/types";

interface HeroProps {
  settings: SiteSettings;
  vehicleCount: number;
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

export default function Hero({ settings, vehicleCount }: HeroProps) {
  const scrollToCatalog = () => {
    document
      .querySelector("#mobil-tersedia")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="beranda"
      className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24"
    >
      {/* Halo warna-warni di sekitar hero (di atas aurora global) */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-brand/25 blur-3xl animate-float-slow" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-cyan/20 blur-3xl animate-float" />
      <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-violet/25 blur-3xl animate-float" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <div>
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-surface/70 border border-line text-brand px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-5 backdrop-blur"
            >
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wa opacity-75" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-wa" />
              </span>
              <span className="line-clamp-1">{settings.locationFull}</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-[2rem] sm:text-5xl lg:text-6xl font-extrabold text-ink leading-[1.1] tracking-tight mb-4 sm:mb-5"
            >
              Mobil Bekas <span className="text-rgb">Berkualitas</span> untuk
              Keluarga Anda
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base lg:text-lg text-ink-soft leading-relaxed mb-6 sm:mb-8 max-w-xl"
            >
              Duta Motor menyediakan pilihan mobil bekas terawat di Curug,
              Kota Serang - informasi transparan, harga terjangkau. Lihat unit
              yang ready, lalu langsung tanya lewat WhatsApp.
            </motion.p>

            {/* Di HP tombol tampil 2 kolom supaya tidak memanjang ke bawah */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 sm:flex sm:flex-row">
              <Button
                variant="primary"
                size="lg"
                onClick={scrollToCatalog}
                className="w-full sm:w-auto glow-brand"
              >
                <Icon name="car" size={18} />
                Lihat Mobil
              </Button>
              <a
                href={buildWhatsAppLink(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button variant="whatsapp" size="lg" className="w-full">
                  <Icon name="whatsapp" size={18} />
                  Chat WhatsApp
                </Button>
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mt-6 sm:mt-8 grid grid-cols-3 gap-2.5 sm:gap-3 max-w-md"
            >
              {[
                { value: `${vehicleCount}+`, label: "Unit Ready", tone: "text-brand" },
                { value: "100%", label: "Info Transparan", tone: "text-cyan" },
                { value: "Cepat", label: "Respon WhatsApp", tone: "text-violet" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-surface/60 border border-line px-2 py-3 sm:px-3 sm:py-4 text-center backdrop-blur"
                >
                  <p className={`text-base sm:text-lg font-extrabold ${stat.tone}`}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-ink-soft font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="relative"
          >
            {/* Bingkai RGB berputar di sekeliling foto showroom */}
            <div className="rgb-frame relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
              <Image
                src="/images/hero-bg.jpg"
                alt="Showroom Duta Motor"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas/60 via-transparent to-transparent" />

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center gap-3 rounded-2xl bg-surface/80 backdrop-blur border border-line/70 px-3.5 py-2.5 sm:px-4 sm:py-3">
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-tint-green text-green flex items-center justify-center shrink-0">
                  <Icon name="shield" size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-ink truncate">
                    Unit Sudah Dicek
                  </p>
                  <p className="text-[11px] sm:text-xs text-ink-soft truncate">
                    Kondisi apa adanya, dijelaskan jujur
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Indikator scroll */}
      <motion.button
        onClick={scrollToCatalog}
        aria-label="Gulir ke katalog"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1 text-ink-muted hover:text-brand transition-colors cursor-pointer"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Gulir
        </span>
        <Icon name="chevronDown" size={18} className="animate-bounce-soft" />
      </motion.button>
    </section>
  );
}
