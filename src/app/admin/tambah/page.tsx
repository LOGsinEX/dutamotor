import AdminNav from "@/components/admin/AdminNav";
import VehicleForm from "@/components/admin/VehicleForm";

export default function AddVehiclePage() {
  return (
    <>
      <AdminNav />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-xl font-extrabold text-ink">Tambah Unit</h1>
        <p className="text-sm text-ink-soft mt-1 mb-6">
          Isi data mobil dan unggah foto-fotonya. Unit langsung tampil di
          website setelah disimpan.
        </p>
        <VehicleForm />
      </main>
    </>
  );
}
