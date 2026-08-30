"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { MAPS_EMBED, MAPS_LINK, SITE_CONFIG } from "@/data/constants";
import type { SiteSettings } from "@/data/types";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

interface AboutProps {
  settings: SiteSettings;
}

export default function About({ settings }: AboutProps) {
  return (
    <section
      id="tentang-kami"
      className="py-12 sm:py-16 lg:py-24 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <div className="inline-flex items-center gap-2 bg-surface/60 backdrop-blur text-brand border border-line px-4 py-2 rounded-full text-sm font-bold">
                <Icon name="heart" size={14} />
                <span>Tentang Kami</span>
              </div>
            </motion.div>

            <motion.h2
              className="text-3xl lg:text-5xl font-extrabold text-ink leading-tight tracking-tight"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              Jual Beli Mobil Bekas Terpercaya di{" "}
              <span className="text-rgb">Kota Serang</span>
            </motion.h2>

            <motion.div
              className="space-y-4 text-ink-soft leading-relaxed"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
            >
              <p>
                <strong className="text-ink">{SITE_CONFIG.name}</strong> adalah
                usaha jual beli mobil bekas yang berlokasi di{" "}
                <strong className="text-ink">{settings.locationFull}</strong>.
                Kami melayani kebutuhan masyarakat Kota Serang, Cilegon, dan
                sekitarnya yang mencari kendaraan bekas berkualitas dengan harga
                terjangkau.
              </p>
              <p>
                Dengan lokasi yang strategis di kawasan Lingkar Cidadap, Curug,
                kami berusaha memberikan kemudahan bagi calon pembeli untuk
                melihat langsung kondisi kendaraan yang tersedia. Setiap mobil
                yang kami tawarkan telah melalui pengecekan untuk memastikan
                kondisi terbaik bagi pembeli.
              </p>
              <p>
                Kami percaya bahwa transparansi dan kejujuran adalah kunci dalam
                bisnis jual beli mobil bekas. Oleh karena itu, informasi
                mengenai kondisi kendaraan disampaikan secara jelas kepada calon
                pembeli.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
            >
              {[
                { title: "Transparan", desc: "Info jujur kendaraan" },
                { title: "Terjangkau", desc: "Harga bersaing" },
                { title: "Lokasi Strategis", desc: "Mudah dijangkau" },
                { title: "Ramah & Profesional", desc: "Pelayanan terbaik" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-tint-green border border-tint-green rounded-xl flex items-center justify-center shrink-0">
                    <Icon
                      name="checkSmall"
                      size={18}
                      className="text-green"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">{item.title}</p>
                    <p className="text-xs text-ink-soft">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="rgb-frame relative rounded-3xl overflow-hidden">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-soft">
                <iframe
                  title="Lokasi Duta Motor"
                  src={MAPS_EMBED}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>

            <motion.div
              className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-right-4 rounded-2xl p-5 soft-card"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-brand to-brand-strong rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-brand/40">
                  <Icon name="location" size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-ink-soft font-medium">
                    Lokasi Kami
                  </p>
                  <p className="text-sm font-extrabold text-ink max-w-52">
                    {settings.locationFull}
                  </p>
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
