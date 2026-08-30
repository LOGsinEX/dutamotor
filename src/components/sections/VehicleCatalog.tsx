"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import VehicleCard from "@/components/ui/VehicleCard";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { VEHICLE_CATEGORIES } from "@/data/constants";
import { buildWhatsAppLink } from "@/lib/utils";
import type { SiteSettings, Vehicle } from "@/data/types";

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  settings: SiteSettings;
  limit?: number;
  showHeader?: boolean;
}

export default function VehicleCatalog({
  vehicles,
  settings,
  limit,
  showHeader = true,
}: VehicleCatalogProps) {
  const [category, setCategory] = useState<string>("Semua");
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      const matchCategory =
        category === "Semua" || vehicle.category === category;
      const matchKeyword =
        !term ||
        vehicle.name.toLowerCase().includes(term) ||
        vehicle.brand.toLowerCase().includes(term) ||
        vehicle.model.toLowerCase().includes(term);
      return matchCategory && matchKeyword;
    });
  }, [vehicles, category, keyword]);

  const visible = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section id="mobil-tersedia" className="py-12 sm:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <motion.div
            className="text-center max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-surface/60 backdrop-blur text-brand border border-line px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4">
              <Icon name="car" size={14} />
              <span>Katalog Unit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink mb-2 sm:mb-3">
              Mobil <span className="text-rgb">Tersedia</span>
            </h2>
            <p className="text-ink-soft">
              Pilihan unit yang siap Anda lihat langsung. Klik salah satu unit
              untuk melihat foto lengkap dan detailnya.
            </p>
          </motion.div>
        )}

        {/* Pencarian & filter */}
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted">
              <Icon name="search" size={16} />
            </span>
            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari merek atau tipe mobil..."
              className="w-full rounded-xl border border-line bg-surface/70 backdrop-blur pl-11 pr-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 sm:justify-center">
            {VEHICLE_CATEGORIES.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-all min-h-[44px] cursor-pointer ${
                  category === item
                    ? "bg-gradient-to-r from-brand to-brand-strong text-white shadow-lg shadow-brand/30"
                    : "bg-surface/60 backdrop-blur text-ink-soft border border-line hover:bg-surface-soft hover:text-ink"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Daftar unit: 2 kolom ringkas di HP, 3 kolom di PC */}
        {visible.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
            {visible.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: (index % 6) * 0.06,
                  ease: "easeOut",
                }}
              >
                <VehicleCard vehicle={vehicle} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="soft-card rounded-2xl p-10 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-surface-soft text-ink-muted flex items-center justify-center">
              <Icon name="car" size={22} />
            </div>
            <p className="text-base font-bold text-ink mb-2">
              Belum ada unit yang cocok
            </p>
            <p className="text-sm text-ink-soft mb-6">
              Coba ubah kata kunci atau kategori, atau tanya langsung unit yang
              Anda cari lewat WhatsApp.
            </p>
            <a
              href={buildWhatsAppLink(settings)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="whatsapp" size="md">
                <Icon name="whatsapp" size={16} />
                Tanya Unit
              </Button>
            </a>
          </div>
        )}

        {limit && filtered.length > limit && (
          <div className="mt-10 text-center">
            <Link href="/mobil">
              <Button variant="outline" size="lg">
                Lihat Semua Unit
                <Icon name="arrowRight" size={16} />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
