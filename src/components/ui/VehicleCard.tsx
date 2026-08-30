"use client";

import Image from "next/image";
import Link from "next/link";
import Badge from "./Badge";
import Icon from "./Icon";
import { formatMileage, formatPrice } from "@/lib/utils";
import type { Vehicle } from "@/data/types";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  Tersedia: "success",
  Booking: "warning",
  "Sold Out": "danger",
};

/**
 * Kartu unit. Di HP tampil ringkas (grid 2 kolom, info penting saja),
 * di layar sm ke atas tampil lengkap dengan spesifikasi.
 * Seluruh kartu bisa diklik menuju halaman detail.
 */
export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const cover = vehicle.images[0];

  return (
    <Link
      href={`/mobil/${vehicle.slug}`}
      className="group soft-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/15 hover:border-brand/40 active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-soft">
        {cover ? (
          <Image
            src={cover}
            alt={vehicle.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-muted">
            <Icon name="image" size={28} />
          </div>
        )}

        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <Badge
            variant={STATUS_VARIANT[vehicle.status] ?? "default"}
            className="max-sm:px-2 max-sm:py-0.5 max-sm:text-[10px]"
          >
            {vehicle.status}
          </Badge>
        </div>

        {vehicle.images.length > 1 && (
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white backdrop-blur">
            <Icon name="image" size={11} />
            {vehicle.images.length}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-5">
        <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
          <Badge variant="info" className="max-sm:px-2 max-sm:py-0.5 max-sm:text-[10px]">
            {vehicle.category}
          </Badge>
          {vehicle.year ? (
            <span className="text-[10px] sm:text-xs font-semibold text-ink-muted">
              {vehicle.year}
            </span>
          ) : null}
        </div>

        <h3 className="text-[13px] sm:text-base font-bold text-ink line-clamp-2 mb-1.5 sm:mb-3 group-hover:text-brand transition-colors leading-snug">
          {vehicle.name}
        </h3>

        {/* Ringkas untuk HP */}
        <p className="sm:hidden text-[10px] text-ink-muted mb-2 line-clamp-1">
          {vehicle.transmission} &middot; {formatMileage(vehicle.mileage)}
        </p>

        {/* Lengkap untuk layar besar */}
        <div className="hidden sm:grid grid-cols-2 gap-2 text-xs text-ink-soft mb-4">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="gear" size={13} className="text-ink-muted" />
            {vehicle.transmission}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="fuel" size={13} className="text-ink-muted" />
            {vehicle.fuelType}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon name="speedometer" size={13} className="text-ink-muted" />
            {formatMileage(vehicle.mileage)}
          </span>
          {vehicle.color ? (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="color" size={13} className="text-ink-muted" />
              {vehicle.color}
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-2.5 sm:pt-4 border-t border-line flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[11px] text-ink-muted font-medium">
              Harga
            </p>
            <p className="text-sm sm:text-lg font-extrabold text-brand truncate drop-shadow-[0_0_12px] drop-shadow-brand/30">
              {formatPrice(vehicle.price)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-ink-soft group-hover:text-brand transition-colors shrink-0">
            Detail
            <Icon name="arrowRight" size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
