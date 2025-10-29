"use client";

import BottomNavigation from '../../../../../components/BottomNavigation';
import Link from "next/link";
import { useState } from "react";
import HeaderCard from "../../../../../components/HeaderCard";

export default function DataDiriKependudukanPage() {
  const [formData, setFormData] = useState({
    nomorKKLama: "Nomor Kartu Keluarga Lama",
    nomorKKBaru: "",
    konfirmasiKK: "",
    nik: "Data NIK",
    namaLengkap: "Data Nama Lengkap",
    namaBaru: "",
    tempatLahir: "Data Tempat Lahir",
    tempatBaru: "",
    tanggalLahir: "Data Tanggal Lahir",
    tanggalBaru: "",
    jenisKelamin: "Data Jenis Kelamin",
    jenisBaru: "",
    statusNikah: "Data Status Nikah",
    statusBaru: "",
    pekerjaan: "Data Pekerjaan",
    pekerjaanBaru: "",
    penghasilan: "",
    penghasilanBaru: "",
    fotoKK: null,
    fotoIjazah: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Saving citizenship data:", formData);
    setIsLoading(false);
  };

  return (
    <main className="min-h-[100svh] bg-merah-putih animate-bg-pan text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <HeaderCard title="Data Diri Kependudukan" backUrl="/masyarakat/profil/edit/data-diri" showBackButton={true} />

        {/* Info Section */}
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-blue-800">Ubah Data Diri Kependudukan</h3>
          <p className="text-xs text-blue-700 mt-1">
            Perhatikan yang dapat dilakukan perubahan, perubahan data ini hanya dapat dilakukan 7 hari sekali.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nomor Kartu Keluarga Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Nomor Kartu Keluarga
            </label>
            <div className="text-xs text-gray-600 mb-2">Data Nomor Kartu Keluarga Lama</div>
            <input
              type="text"
              value={formData.nomorKKLama}
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm mb-3"
              readOnly
            />

            <div className="text-xs text-gray-600 mb-2">Nomor Kartu Keluarga Baru</div>
            <input
              type="text"
              value={formData.nomorKKBaru}
              onChange={(e) => handleInputChange("nomorKKBaru", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 mb-2"
              placeholder="Masukkan Nomor KK Baru"
            />

            <div className="text-xs text-gray-600 mb-2">Konfirmasi Nomor Kartu Keluarga Baru</div>
            <input
              type="text"
              value={formData.konfirmasiKK}
              onChange={(e) => handleInputChange("konfirmasiKK", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Masukkan Nomor KK Baru Konfirmasi"
            />
          </div>

          {/* NIK Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              NIK
            </label>
            <input
              type="text"
              value={formData.nik}
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
              readOnly
            />
          </div>

          {/* Nama Lengkap Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Nama Lengkap
            </label>
            <div className="text-xs text-gray-600 mb-2">Data Nama Lengkap</div>
            <input
              type="text"
              value={formData.namaLengkap}
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm mb-3"
              readOnly
            />

            <div className="text-xs text-gray-600 mb-2">Nama Lengkap Baru</div>
            <input
              type="text"
              value={formData.namaBaru}
              onChange={(e) => handleInputChange("namaBaru", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Masukkan Nama Lengkap Baru"
            />
          </div>

          {/* Tempat Lahir Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Tempat Lahir
            </label>
            <div className="text-xs text-gray-600 mb-2">Data Tempat Lahir</div>
            <input
              type="text"
              value={formData.tempatLahir}
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm mb-3"
              readOnly
            />

            <div className="text-xs text-gray-600 mb-2">Tempat Lahir Baru</div>
            <input
              type="text"
              value={formData.tempatBaru}
              onChange={(e) => handleInputChange("tempatBaru", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Masukkan Tempat Lahir Baru"
            />
          </div>

          {/* Tanggal Lahir Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Tanggal Lahir
            </label>
            <div className="text-xs text-gray-600 mb-2">Data Tanggal Lahir</div>
            <input
              type="text"
              value={formData.tanggalLahir}
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm mb-3"
              readOnly
            />

            <div className="text-xs text-gray-600 mb-2">Tanggal Lahir Baru</div>
            <input
              type="date"
              value={formData.tanggalBaru}
              onChange={(e) => handleInputChange("tanggalBaru", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Jenis Kelamin Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Jenis Kelamin
            </label>
            <div className="text-xs text-gray-600 mb-2">Data Jenis Kelamin</div>
            <input
              type="text"
              value={formData.jenisKelamin}
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm mb-3"
              readOnly
            />

            <div className="text-xs text-gray-600 mb-2">Jenis Kelamin Baru</div>
            <select
              value={formData.jenisBaru}
              onChange={(e) => handleInputChange("jenisBaru", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* Status Nikah Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Status Nikah
            </label>
            <div className="text-xs text-gray-600 mb-2">Data Status Nikah</div>
            <input
              type="text"
              value={formData.statusNikah}
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm mb-3"
              readOnly
            />

            <div className="text-xs text-gray-600 mb-2">Status Nikah Baru</div>
            <select
              value={formData.statusBaru}
              onChange={(e) => handleInputChange("statusBaru", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Pilih Status Nikah</option>
              <option value="Belum Menikah">Belum Menikah</option>
              <option value="Menikah">Menikah</option>
              <option value="Cerai Hidup">Cerai Hidup</option>
              <option value="Cerai Mati">Cerai Mati</option>
            </select>
          </div>

          {/* Pekerjaan Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Pekerjaan
            </label>
            <div className="text-xs text-gray-600 mb-2">Data Pekerjaan</div>
            <input
              type="text"
              value={formData.pekerjaan}
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm mb-3"
              readOnly
            />

            <div className="text-xs text-gray-600 mb-2">Pekerjaan Baru</div>
            <input
              type="text"
              value={formData.pekerjaanBaru}
              onChange={(e) => handleInputChange("pekerjaanBaru", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Masukkan Pekerjaan Baru"
            />
          </div>

          {/* Penghasilan Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Penghasilan
            </label>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-600">Rp.</span>
              <input
                type="text"
                value={formData.penghasilan}
                onChange={(e) => handleInputChange("penghasilan", e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Masukkan penghasilan"
              />
              <span className="text-xs text-gray-600">Per Tahun</span>
            </div>

            <div className="text-xs text-gray-600 mb-2">Penghasilan Baru</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Rp.</span>
              <input
                type="text"
                value={formData.penghasilanBaru}
                onChange={(e) => handleInputChange("penghasilanBaru", e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                placeholder="Masukkan penghasilan baru"
              />
              <span className="text-xs text-gray-600">Per Tahun</span>
            </div>
          </div>

          {/* Unggah Foto KK Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-4">
              Unggah Foto KK
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-gray-100 mb-3">
                📷
              </div>
              <button
                type="button"
                className="text-sky-600 hover:text-sky-700 text-sm font-semibold"
              >
                Unggah Foto
              </button>
            </div>
          </div>

          {/* Unggah Foto Ijazah Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-4">
              Unggah Foto Ijazah
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-gray-100 mb-3">
                📷
              </div>
              <button
                type="button"
                className="text-sky-600 hover:text-sky-700 text-sm font-semibold"
              >
                Unggah Foto
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3 px-2">
            <Link
              href="/masyarakat/profil/edit/data-diri"
              className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-full bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-[inset_0_-2px_0_#0b78c1,0_2px_0_#0b78c133] hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>

      <BottomNavigation />
    </main>
  );
}
