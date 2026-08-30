"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { formatPrice } from "@/lib/utils";

type Row = {
  id: string;
  slug: string;
  name: string;
  price: number | null;
  year: number | null;
  status: string | null;
  category: string | null;
  images: string[] | null;
};

type LoadError = { error: string; detail?: string; hint?: string };

type StatusResult = {
  env: Record<string, boolean>;
  connection?: {
    host: string;
    reachable: boolean;
    code?: string;
    explanation?: string;
  };
  database: { ok: boolean; vehicleCount?: number; error?: string; hint?: string };
};

const STATUS_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  Tersedia: "success",
  Booking: "warning",
  "Sold Out": "danger",
};

const ENV_LABEL: Record<string, string> = {
  NEXT_PUBLIC_SUPABASE_URL: "Alamat project Supabase",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "Kunci publik (anon)",
  SUPABASE_SERVICE_ROLE_KEY: "Kunci server (service_role)",
  ADMIN_EMAIL: "Email admin",
  ADMIN_PASSWORD: "Password admin",
};

export default function AdminDashboardPage() {
  const [vehicles, setVehicles] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<LoadError | null>(null);
  const [notice, setNotice] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [diagnostic, setDiagnostic] = useState<StatusResult | null>(null);
  const [checking, setChecking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      // Dibaca lewat server memakai service key: kebal aturan RLS,
      // dan pesan error aslinya ikut dikirim supaya mudah diperbaiki.
      const response = await fetch("/api/admin/vehicles", {
        cache: "no-store",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setLoadError({
          error: data.error ?? "Gagal memuat data unit.",
          detail: data.detail,
          hint: data.hint,
        });
        setVehicles([]);
        return;
      }

      setVehicles((data.vehicles ?? []) as Row[]);
    } catch (caught) {
      setLoadError({
        error: "Tidak bisa menghubungi server aplikasi.",
        detail: caught instanceof Error ? caught.message : String(caught),
        hint: "Pastikan npm run dev masih berjalan, lalu muat ulang halaman ini.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runDiagnostic = async () => {
    setChecking(true);
    setDiagnostic(null);
    try {
      const response = await fetch("/api/admin/status", { cache: "no-store" });
      setDiagnostic((await response.json()) as StatusResult);
    } catch {
      setDiagnostic(null);
    } finally {
      setChecking(false);
    }
  };

  const handleDelete = async (vehicle: Row) => {
    const confirmed = window.confirm(
      `Hapus unit "${vehicle.name}"? Fotonya juga ikut terhapus dan tidak bisa dikembalikan.`
    );
    if (!confirmed) return;

    setDeletingId(vehicle.id);

    const response = await fetch(`/api/admin/vehicles/${vehicle.id}`, {
      method: "DELETE",
    });
    const data = (await response.json().catch(() => ({}))) as LoadError;

    setDeletingId(null);

    if (!response.ok) {
      setLoadError({
        error: data.error || "Gagal menghapus unit.",
        detail: data.detail,
        hint: data.hint,
      });
      return;
    }

    setVehicles((current) => current.filter((item) => item.id !== vehicle.id));
    setNotice(`Unit "${vehicle.name}" berhasil dihapus.`);
  };

  return (
    <>
      <AdminNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-ink">Unit Mobil</h1>
            <p className="text-sm text-ink-soft mt-1">
              {loading ? "Memuat data..." : `${vehicles.length} unit terdaftar`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={load}
              disabled={loading}
            >
              {loading ? "Memuat..." : "Muat Ulang"}
            </Button>
            <Link href="/admin/tambah" className="flex-1 sm:flex-none">
              <Button variant="primary" size="md" className="w-full">
                <Icon name="plus" size={16} />
                Tambah Unit
              </Button>
            </Link>
          </div>
        </div>

        {notice && (
          <p className="mb-5 rounded-xl bg-tint-green border border-tint-green px-4 py-3 text-sm text-green">
            {notice}
          </p>
        )}

        {/* Kotak error dengan penyebab asli + cara memperbaiki */}
        {loadError && (
          <div className="mb-5 rounded-2xl border border-brand-soft bg-brand-soft px-5 py-4">
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
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={runDiagnostic}
              disabled={checking}
            >
              {checking ? "Memeriksa..." : "Cek Koneksi Database"}
            </Button>
          </div>
        )}

        {/* Hasil diagnosa koneksi */}
        {diagnostic && (
          <div className="mb-5 rounded-2xl border border-line bg-surface px-5 py-4">
            <p className="text-sm font-bold text-ink mb-3">Hasil Pemeriksaan</p>
            <ul className="space-y-1.5 mb-3">
              {Object.entries(diagnostic.env).map(([key, ok]) => (
                <li
                  key={key}
                  className="flex items-center gap-2 text-sm text-ink-soft"
                >
                  <Icon
                    name={ok ? "check" : "close"}
                    size={14}
                    className={ok ? "text-green" : "text-brand"}
                  />
                  {ENV_LABEL[key] ?? key}
                  <span className="text-xs text-ink-muted">
                    {ok ? "terbaca" : "belum diisi di .env"}
                  </span>
                </li>
              ))}
            </ul>

            {diagnostic.connection && (
              <div className="mb-3 rounded-xl bg-surface-soft px-3 py-2.5">
                <p className="text-xs text-ink-muted">Alamat Supabase dituju</p>
                <p className="text-sm font-mono text-ink break-all">
                  {diagnostic.connection.host}
                </p>
                <p className="mt-2 flex items-start gap-2 text-sm text-ink-soft">
                  <Icon
                    name={diagnostic.connection.reachable ? "check" : "close"}
                    size={14}
                    className={
                      diagnostic.connection.reachable
                        ? "text-green shrink-0 mt-0.5"
                        : "text-brand shrink-0 mt-0.5"
                    }
                  />
                  <span>
                    {diagnostic.connection.reachable
                      ? "Server Supabase berhasil dihubungi."
                      : diagnostic.connection.explanation}
                  </span>
                </p>
              </div>
            )}

            <p className="text-sm text-ink-soft">
              {diagnostic.database.ok
                ? `Database terhubung. Jumlah unit di tabel: ${diagnostic.database.vehicleCount}.`
                : `Database gagal diakses: ${diagnostic.database.error}`}
            </p>
            {!diagnostic.database.ok && diagnostic.database.hint && (
              <p className="mt-2 text-sm text-ink">{diagnostic.database.hint}</p>
            )}
          </div>
        )}

        {!loading && !loadError && vehicles.length === 0 && (
          <div className="soft-card rounded-2xl p-10 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-surface-soft text-ink-muted flex items-center justify-center">
              <Icon name="car" size={22} />
            </div>
            <p className="text-base font-bold text-ink mb-2">Belum ada unit</p>
            <p className="text-sm text-ink-soft mb-6">
              Tambahkan unit pertama Anda agar tampil di website. Kalau merasa
              sudah pernah menambahkan unit, jalankan pemeriksaan koneksi di
              bawah ini.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/admin/tambah">
                <Button variant="primary" size="md" className="w-full">
                  <Icon name="plus" size={16} />
                  Tambah Unit
                </Button>
              </Link>
              <Button
                variant="outline"
                size="md"
                onClick={runDiagnostic}
                disabled={checking}
              >
                {checking ? "Memeriksa..." : "Cek Koneksi Database"}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {vehicles.map((vehicle) => {
            const cover = (vehicle.images ?? [])[0];

            return (
              <div
                key={vehicle.id}
                className="soft-card rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="relative w-full sm:w-28 h-40 sm:h-20 rounded-xl overflow-hidden bg-surface-soft shrink-0">
                  {cover ? (
                    <Image
                      src={cover}
                      alt={vehicle.name}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-ink-muted">
                      <Icon name="image" size={20} />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge
                      variant={STATUS_VARIANT[vehicle.status ?? ""] ?? "default"}
                    >
                      {vehicle.status ?? "-"}
                    </Badge>
                    <span className="text-xs text-ink-muted font-semibold">
                      {vehicle.category} &middot; {vehicle.year}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {(vehicle.images ?? []).length} foto
                    </span>
                  </div>
                  <p className="text-sm font-bold text-ink truncate">
                    {vehicle.name}
                  </p>
                  <p className="text-sm font-extrabold text-brand">
                    {formatPrice(Number(vehicle.price ?? 0))}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/mobil/${vehicle.slug}`}
                    target="_blank"
                    className="flex-1 sm:flex-none"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Lihat
                    </Button>
                  </Link>
                  <Link
                    href={`/admin/edit/${vehicle.id}`}
                    className="flex-1 sm:flex-none"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Icon name="edit" size={14} />
                      Ubah
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(vehicle)}
                    disabled={deletingId === vehicle.id}
                  >
                    <Icon name="trash" size={14} />
                    {deletingId === vehicle.id ? "..." : "Hapus"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
