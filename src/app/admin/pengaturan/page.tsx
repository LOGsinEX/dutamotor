"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { DEFAULT_SETTINGS } from "@/data/constants";
import type { SiteSettings } from "@/data/types";

const FIELDS: Array<{
  key: keyof SiteSettings;
  label: string;
  hint: string;
  icon: string;
  placeholder: string;
}> = [
  {
    key: "whatsappNumber",
    label: "Nomor WhatsApp (format internasional)",
    hint: "Tulis tanpa tanda + dan tanpa spasi. Contoh: 6287773960771",
    icon: "whatsapp",
    placeholder: "6287773960771",
  },
  {
    key: "whatsappDisplay",
    label: "Nomor yang ditampilkan",
    hint: "Nomor ini yang terlihat di website dan tombol telepon.",
    icon: "phone",
    placeholder: "087773960771",
  },
  {
    key: "instagramUrl",
    label: "Link Instagram",
    hint: "Kosongkan kalau belum punya. Contoh: instagram.com/dutamotor",
    icon: "instagram",
    placeholder: "https://www.instagram.com/namaakun",
  },
  {
    key: "tiktokUrl",
    label: "Link TikTok",
    hint: "Contoh: tiktok.com/@dutamotor",
    icon: "tiktok",
    placeholder: "https://www.tiktok.com/@namaakun",
  },
  {
    key: "locationFull",
    label: "Alamat / lokasi",
    hint: "Ditampilkan di hero, footer, dan bagian kontak.",
    icon: "location",
    placeholder: "Lingkar Cidadap, Kec. Curug, Kota Serang, Banten",
  },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        // Dibaca lewat server memakai service key (kebal aturan RLS)
        const response = await fetch("/api/admin/settings", {
          cache: "no-store",
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          setError(
            [payload.error, payload.hint].filter(Boolean).join(" ") ||
              "Gagal memuat pengaturan."
          );
          return;
        }

        const data = payload.settings;
        if (data) {
          setForm({
            whatsappNumber: data.whatsapp_number ?? "",
            whatsappDisplay: data.whatsapp_display ?? "",
            tiktokUrl: data.tiktok_url ?? "",
            instagramUrl: data.instagram_url ?? "",
            facebookUrl: data.facebook_url ?? "",
            locationFull: data.location_full ?? "",
          });
        }
      } catch {
        setError(
          "Tidak bisa menghubungi server aplikasi. Pastikan npm run dev masih berjalan."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    // Penyimpanan lewat server (memakai service key + cek sesi admin)
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        whatsapp_number: form.whatsappNumber.replace(/[^0-9]/g, ""),
        whatsapp_display: form.whatsappDisplay,
        tiktok_url: form.tiktokUrl,
        instagram_url: form.instagramUrl,
        facebook_url: form.facebookUrl,
        location_full: form.locationFull,
      }),
    });

    setSaving(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setError(data.error || "Gagal menyimpan pengaturan.");
      return;
    }

    setMessage(
      "Pengaturan tersimpan. Perubahan tampil di website dalam waktu kurang dari 1 menit."
    );
  };

  return (
    <>
      <AdminNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-extrabold text-ink">
          Kontak &amp; Sosial Media
        </h1>
        <p className="text-sm text-ink-soft mt-1 mb-6">
          Ubah nomor WhatsApp dan link sosial media di sini. Semua tombol di
          website otomatis mengikuti.
        </p>

        {loading ? (
          <p className="text-sm text-ink-soft">Memuat pengaturan...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {FIELDS.map((field) => (
              <div key={field.key} className="soft-card rounded-2xl p-5">
                <label
                  htmlFor={field.key}
                  className="flex items-center gap-2 text-sm font-bold text-ink mb-1.5"
                >
                  <Icon
                    name={field.icon}
                    size={15}
                    className="text-ink-muted"
                  />
                  {field.label}
                </label>
                <input
                  id={field.key}
                  type="text"
                  value={form[field.key]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft"
                />
                <p className="mt-2 text-xs text-ink-muted">{field.hint}</p>
              </div>
            ))}

            {message && (
              <p className="rounded-xl bg-tint-green border border-tint-green px-4 py-3 text-sm text-green">
                {message}
              </p>
            )}
            {error && (
              <p className="rounded-xl bg-brand-soft border border-brand-soft px-4 py-3 text-sm text-brand">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              disabled={saving}
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </form>
        )}
      </main>
    </>
  );
}
