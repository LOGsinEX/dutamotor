-- =====================================================================
-- Duta Motor - Skema Database Supabase
-- Cara pakai: Supabase Dashboard > SQL Editor > New query >
-- tempel seluruh isi file ini > Run.
-- =====================================================================

-- ============================ TABEL UNIT MOBIL ========================
create table if not exists public.vehicles (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  slug         text not null unique,
  name         text not null,
  brand        text default '',
  model        text default '',
  year         integer default 2020,
  price        bigint  not null default 0,
  transmission text default 'Manual',
  fuel_type    text default 'Bensin',
  mileage      bigint default 0,
  color        text default '',
  category     text default 'MPV',
  status       text default 'Tersedia',
  description  text default '',
  features     text[] default '{}',
  images       text[] default '{}'
);

create index if not exists vehicles_created_at_idx on public.vehicles (created_at desc);

-- ======================= TABEL PENGATURAN WEBSITE =====================
create table if not exists public.site_settings (
  id                integer primary key default 1,
  whatsapp_number   text default '6287773960771',
  whatsapp_display  text default '087773960771',
  tiktok_url        text default '',
  instagram_url     text default '',
  facebook_url      text default '',
  location_full     text default 'Lingkar Cidadap, Lebak, Kec. Curug, Kota Serang, Banten 42171',
  updated_at        timestamptz default now(),
  constraint site_settings_single_row check (id = 1)
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ============================== KEAMANAN =============================
alter table public.vehicles      enable row level security;
alter table public.site_settings enable row level security;

-- Semua pengunjung boleh MELIHAT data
drop policy if exists "vehicles_public_read" on public.vehicles;
create policy "vehicles_public_read"
  on public.vehicles for select
  using (true);

-- Hanya admin yang sudah login boleh TAMBAH / UBAH / HAPUS
drop policy if exists "vehicles_admin_write" on public.vehicles;
create policy "vehicles_admin_write"
  on public.vehicles for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read"
  on public.site_settings for select
  using (true);

drop policy if exists "settings_admin_write" on public.site_settings;
create policy "settings_admin_write"
  on public.site_settings for all
  to authenticated
  using (true)
  with check (true);

-- ======================= STORAGE FOTO KENDARAAN ======================
insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', true)
on conflict (id) do nothing;

drop policy if exists "vehicle_images_public_read" on storage.objects;
create policy "vehicle_images_public_read"
  on storage.objects for select
  using (bucket_id = 'vehicle-images');

drop policy if exists "vehicle_images_admin_insert" on storage.objects;
create policy "vehicle_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vehicle-images');

drop policy if exists "vehicle_images_admin_update" on storage.objects;
create policy "vehicle_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vehicle-images');

drop policy if exists "vehicle_images_admin_delete" on storage.objects;
create policy "vehicle_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vehicle-images');

-- =========================== VIDEO TIKTOK ============================
create table if not exists public.tiktok_videos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  url text not null,
  video_id text not null,
  caption text default '',
  position integer default 0
);

create index if not exists tiktok_videos_position_idx
  on public.tiktok_videos (position asc);

alter table public.tiktok_videos enable row level security;

drop policy if exists "tiktok_public_read" on public.tiktok_videos;
create policy "tiktok_public_read"
  on public.tiktok_videos for select
  using (true);

drop policy if exists "tiktok_admin_write" on public.tiktok_videos;
create policy "tiktok_admin_write"
  on public.tiktok_videos for all
  to authenticated
  using (true)
  with check (true);

-- =====================================================================
-- CATATAN
--
-- 1. Akun admin TIDAK dibuat di Supabase. Akun diatur lewat file .env:
--      ADMIN_EMAIL=email@anda.com
--      ADMIN_PASSWORD=passwordrahasia
--
-- 2. Semua aksi admin (tambah / ubah / hapus unit, unggah foto, ubah
--    kontak) dijalankan di server memakai SUPABASE_SERVICE_ROLE_KEY,
--    sehingga kebal terhadap aturan RLS di atas. Kunci ini WAJIB diisi:
--      Project Settings > API > service_role  ->  SUPABASE_SERVICE_ROLE_KEY
--    Jangan pernah membagikan kunci service_role ke siapa pun.
--
-- 3. Kebijakan "to authenticated" di atas sengaja dibiarkan sebagai
--    lapisan pengaman: browser pengunjung hanya boleh membaca, tidak
--    boleh menulis.
--
-- 4. Kalau daftar unit di panel admin kosong padahal data sudah ada,
--    jalankan ulang seluruh file ini di SQL Editor, lalu tekan tombol
--    "Cek Koneksi Database" di halaman /admin.
--
-- 5. Tabel tiktok_videos dipakai halaman /admin/tiktok. Kalau project
--    Supabase Anda sudah dibuat sebelum fitur video ada, cukup jalankan
--    ulang seluruh file ini. Data unit dan pengaturan lama TIDAK hilang
--    karena semua perintah memakai "create table if not exists".
-- =====================================================================
