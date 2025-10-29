"use client";

import BottomNavigation from '../../../../../components/BottomNavigation';
import Link from "next/link";
import { useState } from "react";
import HeaderCard from "../../../../../components/HeaderCard";

export default function KontakPage() {
  const [formData, setFormData] = useState({
    nomorTelepon: "Data Nomor Telepon",
    nomorTeleponBaru: "",
    konfirmasiTelepon: "",
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

    console.log("Saving contact data:", formData);
    setIsLoading(false);
  };

  return (
    <main className="min-h-[100svh] bg-merah-putih animate-bg-pan text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <HeaderCard title="Kontak" backUrl="/masyarakat/profil/edit/data-diri" showBackButton={true} />

        {/* Info Section */}
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-blue-800">Ubah Kontak</h3>
          <p className="text-xs text-blue-700 mt-1">
            Perhatikan Data yang dapat di lakukan perubahan, perubahan data ini hanya dapat dilakukan 7 hari sekali.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nomor Telepon Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Nomor Telepon
            </label>

            <div className="text-xs text-gray-600 mb-2">Data Nomor Telepon</div>
            <input
              type="tel"
              value={formData.nomorTelepon}
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm mb-3"
              readOnly
            />

            <div className="text-xs text-gray-600 mb-2">Nomor Telepon Baru</div>
            <input
              type="tel"
              value={formData.nomorTeleponBaru}
              onChange={(e) => handleInputChange("nomorTeleponBaru", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 mb-2"
              placeholder="Masukkan Nomor Telepon Baru"
            />

            <div className="text-xs text-gray-600 mb-2">Konfirmasi Nomor Telepon</div>
            <input
              type="tel"
              value={formData.konfirmasiTelepon}
              onChange={(e) => handleInputChange("konfirmasiTelepon", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Masukkan Konfirmasi Nomor Telepon"
            />
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
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>

      <BottomNavigation />
    </main>
  );
}
