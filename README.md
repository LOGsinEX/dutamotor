# Duta Motor

Website katalog mobil bekas + panel admin sederhana.
Dibuat dengan Next.js 16, Tailwind CSS v4, dan Supabase (database, login admin, penyimpanan foto).
Bisa di-deploy **gratis** di Vercel + Supabase free tier.

---

## Fitur

**Untuk pengunjung**
- **Tampilan v7 "Aurora Neon"** — latar aurora RGB bergerak pelan (merah, cyan, ungu, amber), grid halus, kartu kaca (glassmorphism), judul gradien warna-warni, dan bingkai RGB berputar pada foto hero & kartu CTA
- Katalog unit mobil dengan pencarian dan filter kategori
- Di HP unit tampil **ringkas 2 kolom**, di PC 3 kolom — klik unit mana pun untuk membuka halaman detail lengkap
- Halaman detail unit dengan **galeri foto yang bisa digeser** (swipe di HP, tombol panah di PC)
- Tombol WhatsApp, Instagram, dan TikTok yang langsung mengarah ke akun terbaru
- Tombol **"Buka di Google Maps"** mengarah ke titik showroom
- **Tema gelap (default) & terang** — tombol matahari/bulan di navbar, pilihan tersimpan di perangkat
- Animasi halus saat scroll dan saat halaman dibuka (framer-motion)
- Responsif di HP maupun PC

**Untuk admin (khusus pemilik)**
- Login admin di ikon kunci pojok kanan atas navbar, dan link "Login Admin" di footer
- Tambah unit baru + unggah beberapa foto sekaligus
- Ubah dan hapus unit
- Ubah nomor WhatsApp, link Instagram, link TikTok, dan alamat tanpa mengubah kode

Tidak ada pendaftaran publik. Akun admin cukup diatur di file `.env.local` (ADMIN_EMAIL & ADMIN_PASSWORD).

---

## 1. Buat project Supabase

1. Buka [supabase.com](https://supabase.com) lalu buat project baru (pilih region Singapore agar cepat).
2. Masuk ke **SQL Editor > New query**, tempel seluruh isi file `supabase/schema.sql`, lalu klik **Run**.
   Ini otomatis membuat:
   - tabel `vehicles` (data unit mobil)
   - tabel `site_settings` (nomor WA & sosial media)
   - bucket storage `vehicle-images` (foto unit)
   - aturan keamanan: publik hanya bisa membaca, hanya admin yang login bisa menambah/menghapus

## 2. Atur akun admin di .env

Akun admin cukup ditulis di file `.env.local` — **tidak perlu lagi membuat user di dashboard Supabase**:

```
ADMIN_EMAIL=admin@royanigarage.com
ADMIN_PASSWORD=password-pilihan-anda
```

Email dan password itulah yang dipakai untuk login di `/admin/login`.
Mau ganti? Edit file itu lalu restart server (di Vercel: ubah Environment Variables lalu redeploy).
Sesi login lama otomatis tidak berlaku setelah password diganti.

## 3. Jalankan di komputer

```bash
npm install
copy .env.example .env.local
```

Isi `.env.local` (contoh lengkap ada di `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
ADMIN_EMAIL=admin@royanigarage.com
ADMIN_PASSWORD=password-pilihan-anda
```

Tiga kunci pertama ada di **Project Settings > API**:
- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
- `SUPABASE_SERVICE_ROLE_KEY` = **service_role** key (klik Reveal) — **rahasia**, hanya dipakai server untuk fitur admin, jangan dibagikan / jangan commit ke repo publik

Lalu jalankan:

```bash
npm run dev
```

Buka `http://localhost:3000` (website) dan `http://localhost:3000/admin/login` (panel admin).

> Kalau `.env.local` belum diisi, website tetap terbuka memakai 3 data contoh,
> tetapi panel admin belum bisa dipakai.

## 4. Deploy gratis ke Vercel

1. Push project ini ke GitHub.
2. Buka [vercel.com](https://vercel.com) > **Add New Project** > pilih repo tersebut.
3. Di bagian **Environment Variables**, tambahkan lima variabel yang sama seperti di `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
4. Klik **Deploy**. Selesai.

Setelah dapat domain dari Vercel, ganti `url` di `src/data/constants.ts`
(`https://dutamotor.com` -> domain Anda) agar SEO dan link share akurat.

---

## Cara pakai panel admin

| Halaman | Fungsi |
| --- | --- |
| `/admin/login` | Masuk sebagai admin |
| `/admin` | Daftar semua unit, tombol **Ubah** dan **Hapus** |
| `/admin/tambah` | Tambah unit baru + unggah beberapa foto |
| `/admin/tiktok` | Tambah, urutkan, dan hapus video TikTok di halaman depan |
| `/admin/pengaturan` | Ubah nomor WhatsApp, Instagram, TikTok, dan alamat |

Catatan:
- Foto pertama menjadi foto utama di katalog.
- Saat unit dihapus, fotonya juga dihapus dari storage.
- Perubahan data tampil di website dalam waktu maksimal 1 menit (revalidate 60 detik).
- Status unit: **Tersedia**, **Booking**, atau **Sold Out**.

### Video TikTok

Bagian video muncul di halaman depan tepat di bawah **Keunggulan Kami**, dan hanya tampil kalau minimal ada satu video.

1. Buka video di aplikasi TikTok, tekan **Bagikan > Salin tautan**.
2. Buka `/admin/tiktok`, tempel link, isi judul singkat (boleh dikosongkan), lalu **Tambah Video**.
3. Pakai tombol panah untuk mengatur urutan, dan tombol merah untuk menghapus.

Link pendek `vt.tiktok.com` otomatis diubah ke link panjang saat disimpan. Menghapus video di sini tidak menghapus video aslinya di TikTok.

---

## Mengubah warna tema

Semua warna diatur lewat token di `src/app/globals.css`:

- Blok `@theme { ... }` = **tema gelap** (default)
- Blok `html.light { ... }` = **tema terang**

Contoh: untuk mengubah warna utama (merah), ganti `--color-brand` di kedua blok.
Seluruh komponen otomatis ikut karena semuanya memakai token seperti
`bg-surface`, `text-ink`, `border-line`, `bg-brand`.

## Mengubah titik peta

Titik Google Maps diatur di satu tempat: `src/data/constants.ts`

- `MAPS_LINK` = link yang dibuka pengunjung (saat ini shortlink Google Maps Anda)
- `MAPS_EMBED` = peta yang tampil di bagian "Tentang Kami"

## Struktur penting

```
supabase/schema.sql                  # skema database + storage + keamanan
src/app/globals.css                  # token tema gelap/terang + animasi
src/components/layout/ThemeToggle.tsx# tombol gelap/terang
src/proxy.ts                         # penjaga halaman /admin (cek cookie login)
src/lib/adminToken.ts                # logika sesi admin berbasis .env
src/app/api/admin/                   # API admin (login, CRUD unit, upload foto, pengaturan)
src/lib/data.ts                      # pengambilan data untuk halaman publik
src/lib/tiktok.ts                    # pembaca ID video dari link TikTok
src/components/sections/TiktokShowcase.tsx  # deretan video TikTok di halaman depan
src/lib/supabase/                    # koneksi Supabase (hanya sisi server)
src/lib/supabaseError.ts             # penerjemah pesan error database
src/app/admin/                       # panel admin
src/components/admin/                # form unit & navigasi admin
src/components/ui/ImageSlider.tsx    # galeri foto yang bisa digeser
src/components/ui/VehicleCard.tsx    # kartu unit (ringkas di HP)
```

## Batas gratis (aman untuk showroom kecil)

- Supabase free: 500 MB database, 1 GB storage foto
- Vercel Hobby: hosting gratis untuk penggunaan non-komersial berskala kecil

Untuk menghemat storage, unggah foto dengan ukuran wajar (maksimal ~1 MB per foto).

## Kalau data unit tidak muncul

Buka `/admin`, lalu klik tombol **Cek Koneksi Database**. Panel akan menampilkan
variabel `.env` mana yang terbaca dan pesan error asli dari Supabase, lengkap
dengan cara memperbaikinya. Penyebab yang paling sering:

| Pesan | Artinya | Perbaikan |
| --- | --- | --- |
| Tabel database belum dibuat | `supabase/schema.sql` belum dijalankan | Supabase > SQL Editor > New query > tempel isi `supabase/schema.sql` > Run |
| Video TikTok tidak bisa ditambah | Tabel `tiktok_videos` belum ada (project dibuat sebelum fitur video) | Jalankan ulang seluruh isi `supabase/schema.sql`. Data lama tidak hilang |
| Link TikTok tidak dikenali | Yang ditempel bukan link video (misalnya link profil) | Salin ulang lewat **Bagikan > Salin tautan** pada videonya |
| Kunci server belum diisi | `SUPABASE_SERVICE_ROLE_KEY` kosong | Salin dari Project Settings > API > `service_role` ke `.env`, lalu jalankan ulang `npm run dev` |
| Kunci Supabase ditolak | Kunci salah atau tertukar antar project | Salin ulang URL dan kunci dari project yang benar |
| Tidak bisa terhubung ke Supabase / `TypeError: fetch failed` | Server Next.js tidak bisa menjangkau alamat Supabase | Lihat bagian **Mengatasi `fetch failed`** di bawah |

### Mengatasi `fetch failed`

`TypeError: fetch failed` berarti kegagalan **jaringan**, bukan penolakan dari
database. Permintaan bahkan tidak sampai ke Supabase. Periksa berurutan:

1. **Alamat project.** `NEXT_PUBLIC_SUPABASE_URL` harus persis seperti di
   Project Settings > API > Project URL, berbentuk `https://xxxxxxxx.supabase.co`.
   Bukan link dashboard (`https://supabase.com/dashboard/project/...`), tanpa
   garis miring di akhir, dan bukan teks contoh dari `.env.example`.
2. **Status project.** Project gratis otomatis *Paused* bila lama menganggur.
   Buka dashboard Supabase, kalau ada tombol **Restore project**, klik dan tunggu
   sampai aktif.
3. **Jaringan komputer.** Firewall, antivirus, atau VPN kadang memblokir koneksi
   keluar dari Node.js walaupun browser lancar. Tes dari PowerShell:
   `curl.exe -I https://xxxxxxxx.supabase.co/auth/v1/health` — kalau gagal juga,
   masalahnya di jaringan, bukan di kode.
4. **Restart server.** Setiap kali `.env` diubah, hentikan `npm run dev` dengan
   Ctrl+C lalu jalankan ulang. Next.js hanya membaca `.env` saat dinyalakan.

Tombol **Cek Koneksi Database** di `/admin` sudah otomatis menjalankan tes nomor
1–3 dan menampilkan alamat mana yang dituju beserta penyebab kegagalannya.

Seluruh operasi admin kini berjalan lewat API di server memakai kunci
`service_role`, sehingga daftar unit tidak lagi bisa terhalang aturan RLS.

---

## Catatan pengembangan

- Jika muncul peringatan `install-scripts blocked` untuk `unrs-resolver` saat `npm install`,
  itu aman diabaikan (hanya paket internal ESLint). Bila ingin menghilangkannya:
  `npm install-scripts approve unrs-resolver`.
- Untuk membuka dev server dari HP di jaringan yang sama, tambahkan IP komputer Anda
  ke `allowedDevOrigins` di `next.config.ts`, lalu restart `npm run dev`.
- Lingkaran "N" (Next.js Dev Tools) di pojok kiri bawah sudah dimatikan lewat
  `devIndicators: false` di `next.config.ts`. Tombol itu memang hanya muncul saat
  `npm run dev` dan tidak pernah ikut ter-deploy ke Vercel.
