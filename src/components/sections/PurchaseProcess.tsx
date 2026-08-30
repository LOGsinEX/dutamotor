"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import { purchaseSteps } from "@/data/content";

export default function PurchaseProcess() {
  return (
    <section
      id="cara-pembelian"
      className="py-12 sm:py-16 lg:py-24 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-surface/60 backdrop-blur text-green border border-line px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
            <Icon name="checkSmall" size={13} />
            <span>Cara Pembelian</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink mb-2 sm:mb-3">
            Prosesnya <span className="text-rgb">Mudah</span> &amp; Cepat
          </h2>
          <p className="hidden sm:block text-ink-soft">
            Hanya empat langkah untuk membawa pulang mobil pilihan Anda.
          </p>
        </div>

        {/* Dua kolom di HP: empat langkah cukup dua baris */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {purchaseSteps.map((step, index) => (
            <motion.div
              key={step.id}
              className="relative soft-card rounded-2xl p-4 sm:p-6 hover:border-cyan/40 transition-colors duration-300"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(index, 3) * 0.06 }}
            >
              <span className="absolute top-3 right-4 sm:top-5 sm:right-5 text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-line to-surface-soft">
                {step.id}
              </span>
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-brand-soft border border-brand/30 text-brand flex items-center justify-center mb-2.5 sm:mb-4 shadow-[0_0_18px_-6px] shadow-brand/60">
                <Icon name={step.icon} size={19} />
              </div>
              <h3 className="text-[13px] sm:text-base font-bold text-ink leading-snug mb-1 sm:mb-2">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed line-clamp-3 sm:line-clamp-none">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
