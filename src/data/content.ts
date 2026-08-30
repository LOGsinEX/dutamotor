import { Advantage, PurchaseStep, Testimonial } from "./types";

export const advantages: Advantage[] = [
  {
    id: "1",
    title: "Pilihan Mobil Bekas Berkualitas",
    description:
      "Kami menyediakan beragam pilihan mobil bekas dengan kondisi terawat. Setiap kendaraan telah melalui pengecekan untuk memastikan kualitas terbaik bagi pembeli.",
    icon: "car",
  },
  {
    id: "2",
    title: "Informasi Transparan",
    description:
      "Kami percaya pada kejujuran. Informasi mengenai kondisi kendaraan, riwayat pemakaian, dan detail lainnya disampaikan secara jelas kepada calon pembeli.",
    icon: "shield",
  },
  {
    id: "3",
    title: "Komunikasi Mudah via WhatsApp",
    description:
      "Hubungi kami kapan saja melalui WhatsApp untuk bertanya tentang ketersediaan unit, harga, atau membuat janji lihat mobil. Respon cepat dan ramah.",
    icon: "chat",
  },
  {
    id: "4",
    title: "Lokasi Mudah Dijangkau",
    description:
      "Berlokasi di Lingkar Cidadap, Kec. Curug, Kota Serang, Banten. Lokasi strategis dan mudah dijangkau dari Kota Serang, Cilegon, dan sekitarnya.",
    icon: "location",
  },
  {
    id: "5",
    title: "Pelayanan Ramah & Profesional",
    description:
      "Tim kami siap membantu Anda menemukan mobil yang sesuai dengan kebutuhan dan budget. Pelayanan ramah tanpa paksaan, sesuai kenyamanan Anda.",
    icon: "heart",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Budi Santoso",
    location: "Serang",
    rating: 5,
    text: "Pelayanan sangat ramah dan transparan. Mobil yang saya beli sesuai dengan yang dijelaskan. Prosesnya mudah dan tidak ribet. Terima kasih Duta Motor!",
    vehicle: "Toyota Avanza 2020",
  },
  {
    id: "2",
    name: "Siti Rahmawati",
    location: "Cilegon",
    rating: 5,
    text: "Awalnya ragu beli mobil bekas, tapi setelah datang langsung ke lokasi, kondisi mobil sesuai foto. Harga juga bersaing. Sangat recommended!",
    vehicle: "Honda Brio 2021",
  },
  {
    id: "3",
    name: "Ahmad Fauzi",
    location: "Rangkasbitung",
    rating: 5,
    text: "Respon cepat lewat WhatsApp, diberikan info lengkap tentang mobil yang saya tanyakan. Setelah cek langsung, memang sesuai. Terima kasih ya!",
    vehicle: "Daihatsu Xenia 2020",
  },
];

export const purchaseSteps: PurchaseStep[] = [
  {
    id: 1,
    title: "Pilih Mobil",
    description:
      "Jelajahi katalog kami dan temukan mobil yang sesuai dengan kebutuhan dan budget Anda.",
    icon: "search",
  },
  {
    id: 2,
    title: "Hubungi WhatsApp",
    description:
      "Hubungi kami via WhatsApp untuk menanyakan ketersediaan unit dan detail kendaraan.",
    icon: "phone",
  },
  {
    id: 3,
    title: "Tanya Detail & Cek Unit",
    description:
      "Dapatkan informasi lengkap tentang kondisi kendaraan dan janjian untuk melihat langsung.",
    icon: "info",
  },
  {
    id: 4,
    title: "Nego & Transaksi",
    description:
      "Lakukan negosiasi harga dan transaksi dengan aman. Kami bantu prosesnya sampai selesai.",
    icon: "check",
  },
];
