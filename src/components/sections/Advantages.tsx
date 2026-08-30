"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { advantages } from "@/data/content";

const TONES = [
  "bg-brand-soft text-brand border-brand/30 shadow-[0_0_18px_-6px] shadow-brand/60",
  "bg-tint-blue text-cyan border-cyan/30 shadow-[0_0_18px_-6px] shadow-cyan/60",
  "bg-tint-green text-green border-green/30 shadow-[0_0_18px_-6px] shadow-green/60",
  "bg-tint-amber text-amber border-amber/30 shadow-[0_0_18px_-6px] shadow-amber/60",
  "bg-tint-violet text-violet border-violet/30 shadow-[0_0_18px_-6px] shadow-violet/60",
];

export default function Advantages() {
  const isOdd = advantages.length % 2 === 1;

  return (
    <section id="keunggulan" className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-surface/60 backdrop-blur text-cyan border border-line px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
            <Icon name="shield" size={13} />
            <span>Keunggulan Kami</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink mb-2 sm:mb-3">
            Kenapa Memilih <span className="text-rgb">Duta Motor</span>?
          </h2>
          {/* Kalimat pengantar disembunyikan di HP supaya tidak menambah tinggi */}
          <p className="hidden sm:block text-ink-soft">
            Kami berkomitmen memberikan pengalaman jual beli mobil bekas yang
            nyaman, jujur, dan menyenangkan.
          </p>
        </div>

        {/* Dua kolom di HP: 5 poin cukup 3 baris, bukan 5 baris */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
          {advantages.map((advantage, index) => {
            const isLastAlone = isOdd && index === advantages.length - 1;

            return (
              <motion.div
                key={advantage.id}
                className={`soft-card rounded-2xl p-4 sm:p-6 hover:-translate-y-1 hover:border-brand/40 transition-all duration-300 ${
                  isLastAlone ? "col-span-2 lg:col-span-1" : ""
                }`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: Math.min(index, 3) * 0.06 }}
              >
                <div
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border flex items-center justify-center mb-2.5 sm:mb-4 ${
                    TONES[index % TONES.length]
                  }`}
                >
                  <Icon name={advantage.icon} size={19} />
                </div>
                <h3 className="text-[13px] sm:text-base font-bold text-ink leading-snug mb-1 sm:mb-2">
                  {advantage.title}
                </h3>
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {advantage.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
