"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import {
  CATEGORY_OPTIONS,
  FUEL_OPTIONS,
  STATUS_OPTIONS,
  TRANSMISSION_OPTIONS,
} from "@/data/constants";
import { generateSlug } from "@/lib/utils";
import type { Vehicle } from "@/data/types";

interface VehicleFormProps {
  /** Kalau ada, form berjalan dalam mode ubah unit. */
  vehicle?: Vehicle;
}

type FormState = {
  name: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  transmission: string;
  fuelType: string;
  mileage: string;
  color: string;
  category: string;
  status: string;
  description: string;
  features: string;
};

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft";

/** Membaca pesan error dari response API. */
async function readError(response: Response, fallback: string) {
  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
  };
  return data.error || fallback;
}

export default function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter();
  const isEdit = Boolean(vehicle);

  const [form, setForm] = useState<FormState>({
    name: vehicle?.name ?? "",
    brand: vehicle?.brand ?? "",
    model: vehicle?.model ?? "",
    year: vehicle?.year ? String(vehicle.year) : "",
    price: vehicle?.price ? String(vehicle.price) : "",
    transmission: vehicle?.transmission ?? TRANSMISSION_OPTIONS[0],
    fuelType: vehicle?.fuelType ?? FUEL_OPTIONS[0],
    mileage: vehicle?.mileage ? String(vehicle.mileage) : "",
    color: vehicle?.color ?? "",
    category: vehicle?.category ?? CATEGORY_OPTIONS[0],
    status: vehicle?.status ?? STATUS_OPTIONS[0],
    description: vehicle?.description ?? "",
    features: (vehicle?.features ?? []).join(", "),
  });

  // Foto yang sudah tersimpan (mode ubah)
  const [existingImages, setExistingImages] = useState<string[]>(
    vehicle?.images ?? []
  );
  // Foto baru yang dipilih dari perangkat
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setNewFiles((current) => [...current, ...files]);
    setPreviews((current) => [
      ...current,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
    event.target.value = "";
  };

  const removeNewFile = (index: number) => {
    setNewFiles((current) => current.filter((_, i) => i !== index));
    setPreviews((current) => current.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) =>
    setExistingImages((current) => current.filter((item) => item !== url));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Nama unit wajib diisi.");
      return;
    }

    if (existingImages.length === 0 && newFiles.length === 0) {
      setError("Tambahkan minimal 1 foto unit.");
      return;
    }

    setSaving(true);

    // 1. Unggah foto baru lewat server
    let uploadedUrls: string[] = [];
    if (newFiles.length > 0) {
      const folder =
        vehicle?.id || generateSlug(form.name) || "unit";
      const formData = new FormData();
      formData.append("folder", folder);
      newFiles.forEach((file) => formData.append("files", file));

      const uploadResponse = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        setError(await readError(uploadResponse, "Gagal mengunggah foto."));
        setSaving(false);
        return;
      }

      const uploadData = (await uploadResponse.json()) as { urls: string[] };
      uploadedUrls = uploadData.urls;
    }

    // 2. Siapkan data unit
    const features = form.features
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      slug:
        vehicle?.slug ?? `${generateSlug(form.name)}-${Date.now().toString(36)}`,
      name: form.name.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: Number(form.year) || null,
      price: Number(form.price.replace(/[^0-9]/g, "")) || 0,
      transmission: form.transmission,
      fuel_type: form.fuelType,
      mileage: Number(form.mileage.replace(/[^0-9]/g, "")) || 0,
      color: form.color.trim(),
      category: form.category,
      status: form.status,
      description: form.description.trim(),
      features,
      images: [...existingImages, ...uploadedUrls],
    };

    // 3. Simpan lewat server
    const saveResponse = isEdit
      ? await fetch(`/api/admin/vehicles/${vehicle!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            // Foto lama yang dibuang admin akan dihapus dari storage oleh server
            imagesToRemove: (vehicle?.images ?? []).filter(
              (url) => !existingImages.includes(url)
            ),
          }),
        })
      : await fetch("/api/admin/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    if (!saveResponse.ok) {
      setError(await readError(saveResponse, "Gagal menyimpan data unit."));
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push("/admin");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Foto unit */}
      <div className="soft-card rounded-2xl p-5">
        <p className="text-sm font-bold text-ink mb-1.5">Foto Unit</p>
        <p className="text-xs text-ink-muted mb-4">
          Bisa pilih beberapa foto sekaligus. Foto pertama dipakai sebagai foto
          utama, dan pengunjung bisa menggeser foto di halaman detail.
        </p>

        <label className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-surface-soft/60 px-4 py-8 cursor-pointer hover:border-brand-soft hover:bg-brand-soft/40 transition-colors">
          <span className="w-11 h-11 rounded-xl bg-surface text-brand flex items-center justify-center border border-line">
            <Icon name="upload" size={20} />
          </span>
          <span className="text-sm font-semibold text-ink">
            Pilih foto dari perangkat
          </span>
          <span className="text-xs text-ink-muted">JPG atau PNG</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSelectFiles}
            className="hidden"
          />
        </label>

        {(existingImages.length > 0 || previews.length > 0) && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
            {existingImages.map((url) => (
              <div
                key={url}
                className="relative aspect-square rounded-xl overflow-hidden bg-surface-soft"
              >
                <Image
                  src={url}
                  alt="Foto unit"
                  fill
                  sizes="150px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  aria-label="Hapus foto"
                  className="absolute top-1.5 right-1.5 w-8 h-8 rounded-full bg-surface/90 text-brand flex items-center justify-center shadow-sm"
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            ))}

            {previews.map((preview, index) => (
              <div
                key={preview}
                className="relative aspect-square rounded-xl overflow-hidden bg-surface-soft"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Pratinjau foto baru"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-bold text-ink-soft">
                  Baru
                </span>
                <button
                  type="button"
                  onClick={() => removeNewFile(index)}
                  aria-label="Hapus foto"
                  className="absolute top-1.5 right-1.5 w-8 h-8 rounded-full bg-surface/90 text-brand flex items-center justify-center shadow-sm"
                >
                  <Icon name="close" size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data unit */}
      <div className="soft-card rounded-2xl p-5 space-y-4">
        <p className="text-sm font-bold text-ink">Data Mobil</p>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Nama unit *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Toyota Avanza 1.5 G CVT"
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Merek
            </label>
            <input
              type="text"
              value={form.brand}
              onChange={(event) => update("brand", event.target.value)}
              placeholder="Toyota"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Tipe / model
            </label>
            <input
              type="text"
              value={form.model}
              onChange={(event) => update("model", event.target.value)}
              placeholder="Avanza"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Tahun
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={form.year}
              onChange={(event) => update("year", event.target.value)}
              placeholder="2020"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Harga (Rupiah)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={form.price}
              onChange={(event) => update("price", event.target.value)}
              placeholder="175000000"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Kilometer
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={form.mileage}
              onChange={(event) => update("mileage", event.target.value)}
              placeholder="45000"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Warna
            </label>
            <input
              type="text"
              value={form.color}
              onChange={(event) => update("color", event.target.value)}
              placeholder="Putih"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Transmisi
            </label>
            <select
              value={form.transmission}
              onChange={(event) => update("transmission", event.target.value)}
              className={inputClass}
            >
              {TRANSMISSION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Bahan bakar
            </label>
            <select
              value={form.fuelType}
              onChange={(event) => update("fuelType", event.target.value)}
              className={inputClass}
            >
              {FUEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Kategori
            </label>
            <select
              value={form.category}
              onChange={(event) => update("category", event.target.value)}
              className={inputClass}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(event) => update("status", event.target.value)}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Deskripsi
          </label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(event) => update("description", event.target.value)}
            placeholder="Kondisi unit, riwayat servis, catatan penting..."
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Fitur
          </label>
          <input
            type="text"
            value={form.features}
            onChange={(event) => update("features", event.target.value)}
            placeholder="AC Double Blower, Rear Camera, Head Unit"
            className={inputClass}
          />
          <p className="mt-2 text-xs text-ink-muted">
            Pisahkan setiap fitur dengan tanda koma.
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-brand-soft border border-brand-soft px-4 py-3 text-sm text-brand">
          {error}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          disabled={saving}
        >
          {saving
            ? "Menyimpan..."
            : isEdit
              ? "Simpan Perubahan"
              : "Simpan Unit"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => router.push("/admin")}
          disabled={saving}
        >
          Batal
        </Button>
      </div>
    </form>
  );
}
