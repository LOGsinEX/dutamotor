import type { Vehicle } from "./types";

/**
 * Data contoh. Hanya dipakai kalau koneksi Supabase belum diisi
 * (misalnya baru clone project dan .env.local masih kosong).
 * Setelah Supabase aktif, semua unit diambil dari database
 * dan dikelola lewat halaman admin.
 */
export const fallbackVehicles: Vehicle[] = [
  {
    id: "contoh-1",
    slug: "toyota-avanza-2020",
    name: "Toyota Avanza 1.5 G CVT",
    brand: "Toyota",
    model: "Avanza",
    year: 2020,
    price: 175000000,
    transmission: "CVT",
    fuelType: "Bensin",
    mileage: 45000,
    color: "Putih",
    category: "MPV",
    status: "Tersedia",
    description:
      "Contoh data. Toyota Avanza 1.5 G CVT tahun 2020 kondisi terawat, servis berkala, interior bersih dan rapi.",
    features: ["AC Double Blower", "Head Unit Touchscreen", "Rear Camera"],
    images: ["/images/vehicles/avanza-1.jpg"],
  },
  {
    id: "contoh-2",
    slug: "honda-brio-2021",
    name: "Honda Brio RS CVT",
    brand: "Honda",
    model: "Brio",
    year: 2021,
    price: 165000000,
    transmission: "CVT",
    fuelType: "Bensin",
    mileage: 25000,
    color: "Merah",
    category: "City Car",
    status: "Tersedia",
    description:
      "Contoh data. Honda Brio RS CVT tahun 2021, city car irit dan gesit, kondisi seperti baru.",
    features: ["Head Unit Touchscreen", "Rear Camera", "Sport Pedal"],
    images: ["/images/vehicles/brio-1.jpg"],
  },
  {
    id: "contoh-3",
    slug: "mitsubishi-xpander-2021",
    name: "Mitsubishi Xpander Ultimate AT",
    brand: "Mitsubishi",
    model: "Xpander",
    year: 2021,
    price: 235000000,
    transmission: "Automatic",
    fuelType: "Bensin",
    mileage: 30000,
    color: "Putih",
    category: "MPV",
    status: "Booking",
    description:
      "Contoh data. Mitsubishi Xpander Ultimate AT tahun 2021, MPV premium dengan fitur lengkap.",
    features: ["360 Camera", "Cruise Control", "LED Headlamp"],
    images: ["/images/vehicles/xpander-1.jpg"],
  },
];
