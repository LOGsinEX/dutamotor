"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import VehicleForm from "@/components/admin/VehicleForm";
import Icon from "@/components/ui/Icon";
import type { Vehicle, VehicleStatus } from "@/data/types";

type LoadError = { error: string; detail?: string; hint?: string };

export default function EditVehiclePage() {
  const params = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<LoadError | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;

      try {
        // Dibaca lewat server memakai service key (kebal aturan RLS)
        const response = await fetch(`/api/admin/vehicles/${params.id}`, {
          cache: "no-store",
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          setLoadError({
            error: data.error ?? "Gagal memuat data unit.",
            detail: data.detail,
            hint: data.hint,
          });
          return;
        }

        const row = data.vehicle;
        setVehicle({
          id: row.id,
          slug: row.slug,
          name: row.name,
          brand: row.brand ?? "",
          model: row.model ?? "",
          year: row.year ?? 0,
          price: Number(row.price ?? 0),
          transmission: row.transmission ?? "Manual",
          fuelType: row.fuel_type ?? "Bensin",
          mileage: Number(row.mileage ?? 0),
          color: row.color ?? "",
          category: row.category ?? "MPV",
          status: (row.status as VehicleStatus) ?? "Tersedia",
          description: row.description ?? "",
          features: row.features ?? [],
          images: row.images ?? [],
        });
      } catch (caught) {
        setLoadError({
          error: "Tidak bisa menghubungi server aplikasi.",
          detail: caught instanceof Error ? caught.message : String(caught),
          hint: "Pastikan npm run dev masih berjalan, lalu muat ulang halaman ini.",
        });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params?.id]);

  return (
    <>
      <AdminNav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-extrabold text-ink">Ubah Unit</h1>
        <p className="text-sm text-ink-soft mt-1 mb-6">
          Perbarui data mobil, tambah foto baru, atau hapus foto yang tidak
          dipakai.
        </p>

        {loading && <p className="text-sm text-ink-soft">Memuat data unit...</p>}

        {loadError && (
          <div className="rounded-2xl border border-brand-soft bg-brand-soft px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-bold text-brand">
              <Icon name="info" size={16} />
              {loadError.error}
            </p>
            {loadError.detail && (
              <p className="mt-2 text-xs text-ink-soft break-words font-mono">
                {loadError.detail}
              </p>
            )}
            {loadError.hint && (
              <p className="mt-3 text-sm text-ink">
                <span className="font-semibold">Solusi: </span>
                {loadError.hint}
              </p>
            )}
          </div>
        )}

        {!loading && !loadError && vehicle && <VehicleForm vehicle={vehicle} />}
      </main>
    </>
  );
}
