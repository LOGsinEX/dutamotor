"use client";

import { useCallback, useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

type VideoRow = {
  id: string;
  url: string;
  video_id: string;
  caption: string | null;
  position: number | null;
};

type LoadError = { error: string; detail?: string; hint?: string };

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-soft";

export default function AdminTiktokPage() {
  const [videos, setVideos] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [problem, setProblem] = useState<LoadError | null>(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setProblem(null);

    try {
      const response = await fetch("/api/admin/tiktok", { cache: "no-store" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setProblem({
          error: data.error ?? "Gagal memuat daftar video.",
          detail: data.detail,
          hint: data.hint,
        });
        setVideos([]);
        return;
      }

      setVideos((data.videos ?? []) as VideoRow[]);
    } catch (caught) {
      setProblem({
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

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    setProblem(null);
    setNotice("");

    if (!url.trim()) {
      setProblem({ error: "Tempel dulu link videonya." });
      return;
    }

    setSaving(true);

    const response = await fetch("/api/admin/tiktok", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url.trim(), caption: caption.trim() }),
    });
    const data = (await response.json().catch(() => ({}))) as LoadError;

    setSaving(false);

    if (!response.ok) {
      setProblem({
        error: data.error || "Gagal menambahkan video.",
        detail: data.detail,
        hint: data.hint,
      });
      return;
    }

    setUrl("");
    setCaption("");
    setNotice("Video ditambahkan. Tampil di website dalam waktu kurang dari 1 menit.");
    load();
  };

  const handleDelete = async (video: VideoRow) => {
    const confirmed = window.confirm(
      "Hapus video ini dari website? Video di TikTok tidak ikut terhapus."
    );
    if (!confirmed) return;

    const response = await fetch(`/api/admin/tiktok/${video.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as LoadError;
      setProblem({
        error: data.error || "Gagal menghapus video.",
        detail: data.detail,
        hint: data.hint,
      });
      return;
    }

    setVideos((current) => current.filter((item) => item.id !== video.id));
    setNotice("Video dihapus dari website.");
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= videos.length) return;

    const reordered = [...videos];
    [reordered[index], reordered[target]] = [
      reordered[target],
      reordered[index],
    ];
    setVideos(reordered);

    await fetch("/api/admin/tiktok", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: reordered.map((item) => item.id) }),
    });
  };

  return (
    <>
      <AdminNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-extrabold text-ink">Video TikTok</h1>
        <p className="text-sm text-ink-soft mt-1 mb-6">
          Video di sini tampil di halaman depan, tepat di bawah bagian
          &ldquo;Keunggulan Kami&rdquo;. Urutan paling atas tampil paling kiri.
        </p>

        {/* Form tambah video */}
        <form onSubmit={handleAdd} className="soft-card rounded-2xl p-5 mb-6">
          <label
            htmlFor="tiktok-url"
            className="flex items-center gap-2 text-sm font-bold text-ink mb-1.5"
          >
            <Icon name="tiktok" size={15} className="text-ink-muted" />
            Link video TikTok
          </label>
          <input
            id="tiktok-url"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.tiktok.com/@akun/video/7667019281493691666"
            className={inputClass}
          />
          <p className="mt-2 text-xs text-ink-muted">
            Buka video di aplikasi TikTok, tekan <b>Bagikan</b> &rarr;{" "}
            <b>Salin tautan</b>, lalu tempel di sini. Link pendek
            (vt.tiktok.com) juga diterima.
          </p>

          <label
            htmlFor="tiktok-caption"
            className="block text-sm font-bold text-ink mt-5 mb-1.5"
          >
            Judul singkat <span className="text-ink-muted">(opsional)</span>
          </label>
          <input
            id="tiktok-caption"
            type="text"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="Contoh: Fortuner TRD 2020 ready"
            className={inputClass}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="mt-5 w-full sm:w-auto"
            disabled={saving}
          >
            <Icon name="plus" size={16} />
            {saving ? "Menyimpan..." : "Tambah Video"}
          </Button>
        </form>

        {notice && (
          <p className="mb-5 rounded-xl bg-tint-green border border-tint-green px-4 py-3 text-sm text-green">
            {notice}
          </p>
        )}

        {problem && (
          <div className="mb-5 rounded-2xl border border-brand-soft bg-brand-soft px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-bold text-brand">
              <Icon name="info" size={16} />
              {problem.error}
            </p>
            {problem.detail && (
              <p className="mt-2 text-xs text-ink-soft break-words font-mono">
                {problem.detail}
              </p>
            )}
            {problem.hint && (
              <p className="mt-3 text-sm text-ink">
                <span className="font-semibold">Solusi: </span>
                {problem.hint}
              </p>
            )}
          </div>
        )}

        {loading && <p className="text-sm text-ink-soft">Memuat video...</p>}

        {!loading && !problem && videos.length === 0 && (
          <div className="soft-card rounded-2xl p-8 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-xl bg-surface-soft text-ink-muted flex items-center justify-center">
              <Icon name="tiktok" size={20} />
            </div>
            <p className="text-base font-bold text-ink mb-1">Belum ada video</p>
            <p className="text-sm text-ink-soft">
              Selama daftar ini kosong, bagian video tidak muncul di halaman
              depan.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="soft-card rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Pindah ke atas"
                  className="w-8 h-8 rounded-lg bg-surface-soft text-ink-soft flex items-center justify-center hover:bg-line disabled:opacity-40 cursor-pointer"
                >
                  <Icon name="chevronDown" size={14} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === videos.length - 1}
                  aria-label="Pindah ke bawah"
                  className="w-8 h-8 rounded-lg bg-surface-soft text-ink-soft flex items-center justify-center hover:bg-line disabled:opacity-40 cursor-pointer"
                >
                  <Icon name="chevronDown" size={14} />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink truncate">
                  {video.caption || `Video ${index + 1}`}
                </p>
                <p className="text-xs text-ink-muted font-mono truncate">
                  ID {video.video_id}
                </p>
              </div>

              <a href={video.url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  Lihat
                </Button>
              </a>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(video)}
              >
                <Icon name="trash" size={14} />
              </Button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
