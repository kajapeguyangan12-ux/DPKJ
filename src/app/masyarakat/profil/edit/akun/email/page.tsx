"use client";

import BottomNavigation from '../../../../../components/BottomNavigation';
import Link from "next/link";
import { useState } from "react";
import HeaderCard from "../../../../../components/HeaderCard";

export default function UbahEmailPage() {
  const [formData, setFormData] = useState({
    emailSaatIni: "Data Email",
    emailBaru: "",
    konfirmasiEmail: "",
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

    console.log("Saving email data:", formData);
    setIsLoading(false);
  };

  return (
    <main className="min-h-[100svh] bg-merah-putih animate-bg-pan text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <HeaderCard title="Pengaturan Akun" />

        <div className="mb-3">
          <Link href="/masyarakat/profil/edit/akun" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-lg shadow-sm">‹</Link>
        </div>

        {/* Info Section */}
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-blue-800">Ubah Alamat Email</h3>
          <p className="text-xs text-blue-700 mt-1">
            Proteksi akun Anda dengan mengaitkan alamat email yang aktif, ubah alamat email anda dibawah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Saat Ini Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Email Saat Ini
            </label>
            <input
              type="email"
              value={formData.emailSaatIni}
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
              readOnly
            />
          </div>

          {/* Email Baru Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Email Baru
            </label>
            <input
              type="email"
              value={formData.emailBaru}
              onChange={(e) => handleInputChange("emailBaru", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Masukkan username Baru"
            />
          </div>

          {/* Konfirmasi Email Section */}
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Konfirmasi Email Baru
            </label>
            <input
              type="email"
              value={formData.konfirmasiEmail}
              onChange={(e) => handleInputChange("konfirmasiEmail", e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Masukkan Kembali email Baru"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3 px-2">
            <Link
              href="/masyarakat/profil/edit/akun"
              className="flex-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-full bg-green-500 px-4 py-3 text-sm font-semibold text-white shadow-[inset_0_-2px_0_#059669,0_2px_0_#05966933] hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
