"use client";

import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import TestimonialCard from "@/components/ui/TestimonialCard";
import { testimonials } from "@/data/content";

export default function Testimonials() {
  // Daftar digandakan supaya gulungan terlihat menyambung tanpa putus
  const track = [...testimonials, ...testimonials];

  return (
    <section className="py-12 sm:py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-surface/60 backdrop-blur text-amber border border-line px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
            <Icon name="star" size={13} />
            <span>Testimoni</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink mb-2 sm:mb-3">
            Kata <span className="text-rgb">Pelanggan</span> Kami
          </h2>
          <p className="hidden sm:block text-ink-soft">
            Kepercayaan pelanggan adalah prioritas kami. Ini kata mereka yang
            sudah bertransaksi di Duta Motor.
          </p>
        </motion.div>
      </div>

      {/* Berjalan sendiri dari kanan ke kiri, berhenti saat disentuh */}
      <div className="marquee-pause marquee-mask relative overflow-hidden [--marquee-duration:24s] sm:[--marquee-duration:34s] lg:[--marquee-duration:46s]">
        <div className="flex w-max animate-marquee">
          {track.map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="shrink-0 w-[268px] sm:w-[320px] lg:w-[380px] pr-3 sm:pr-5"
              aria-hidden={index >= testimonials.length}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-ink-muted mt-4 px-4">
        Sentuh salah satu kartu untuk berhenti sejenak dan membacanya.
      </p>
    </section>
  );
}
