"use client";

import { useState } from "react";
import HeaderCard from '../../../components/HeaderCard';
import BottomNavigation from '../../../components/BottomNavigation';
import Image from "next/image";
import Link from "next/link";

const DesaLogo = "/logo/LOGO_DPKJ.png";
const BgdLogo = "/logo/Logo_BGD.png";

type FormData = {
  judulLaporan: string;
  kategori: string;
  prioritas: string;
  lokasi: string;
  deskripsi: string;
  fotoBukti: File | null;
  namaPelapor: string;
  kontakPelapor: string;
  tanggalKejadian: string;
};

const kategoriOptions = [
  "Infrastruktur",
  "Keamanan",
  "Lingkungan",
  "Pelayanan",
  "Lainnya"
];

const prioritasOptions = [
  "Rendah",
  "Sedang",
  "Tinggi"
];

export default function BuatPengaduanPage() {
  const [formData, setFormData] = useState<FormData>({
    judulLaporan: "",
    kategori: "",
    prioritas: "",
    lokasi: "",
    deskripsi: "",
    fotoBukti: null,
    namaPelapor: "",
    kontakPelapor: "",
    tanggalKejadian: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: keyof FormData, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Form submitted:", formData);
    // Here you would typically send the data to your API

    setIsSubmitting(false);
    alert("Laporan pengaduan berhasil dikirim!");
  };

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-900">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <HeaderCard 
          title="Buat Pengaduan"
          backUrl="/masyarakat/pengaduan"
          showBackButton={true}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Notice */}
          <div className="rounded-3xl border border-red-100 bg-white/95 px-4 py-4 shadow ring-1 ring-red-200">
            <p className="text-sm font-semibold text-red-700">Laporkan masalah yang Anda temukan di desa......</p>
          </div>

          {/* Judul Laporan */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Judul Laporan *
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-red-100 bg-white/95 px-4 py-3 text-sm shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Ringkasan masalah yang dilaporkan"
              value={formData.judulLaporan}
              onChange={(e) => handleInputChange("judulLaporan", e.target.value)}
              required
            />
          </div>

          {/* Kategori & Prioritas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Kategori *
              </label>
              <select
                className="w-full rounded-xl border border-red-100 bg-white/95 px-4 py-3 text-sm shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.kategori}
                onChange={(e) => handleInputChange("kategori", e.target.value)}
                required
              >
                <option value="">Pilih Kategori</option>
                {kategoriOptions.map((kategori) => (
                  <option key={kategori} value={kategori}>
                    {kategori}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Prioritas *
              </label>
              <select
                className="w-full rounded-xl border border-red-100 bg-white/95 px-4 py-3 text-sm shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.prioritas}
                onChange={(e) => handleInputChange("prioritas", e.target.value)}
                required
              >
                <option value="">Pilih Prioritas</option>
                {prioritasOptions.map((prioritas) => (
                  <option key={prioritas} value={prioritas}>
                    {prioritas}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lokasi */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Lokasi Kejadian *
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-red-100 bg-white/95 px-4 py-3 text-sm shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Alamat lengkap lokasi kejadian"
              value={formData.lokasi}
              onChange={(e) => handleInputChange("lokasi", e.target.value)}
              required
            />
          </div>

          {/* Tanggal Kejadian */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tanggal Kejadian *
            </label>
            <input
              type="date"
              className="w-full rounded-xl border border-red-100 bg-white/95 px-4 py-3 text-sm shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.tanggalKejadian}
              onChange={(e) => handleInputChange("tanggalKejadian", e.target.value)}
              required
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Deskripsi Masalah *
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-red-100 bg-white/95 px-4 py-3 text-sm shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Jelaskan masalah yang Anda alami secara detail"
              value={formData.deskripsi}
              onChange={(e) => handleInputChange("deskripsi", e.target.value)}
              required
            />
          </div>

          {/* Data Pelapor */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Pelapor</h3>

            {/* Nama & Kontak */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-red-100 bg-white/95 px-4 py-3 text-sm shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nama lengkap pelapor"
                  value={formData.namaPelapor}
                  onChange={(e) => handleInputChange("namaPelapor", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kontak (HP/Email) *
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-red-100 bg-white/95 px-4 py-3 text-sm shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="No HP atau Email"
                  value={formData.kontakPelapor}
                  onChange={(e) => handleInputChange("kontakPelapor", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Upload Bukti */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Bukti Foto/Video</h3>

            {/* Foto Bukti */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Foto Bukti (Opsional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  id="fotoBukti"
                  onChange={(e) => handleFileChange("fotoBukti", e.target.files?.[0] || null)}
                />
                <label
                  htmlFor="fotoBukti"
                  className="flex items-center gap-2 rounded-xl border border-red-100 bg-white/95 px-4 py-3 text-sm shadow-sm ring-1 ring-red-200 cursor-pointer hover:bg-red-50 transition"
                >
                  <DocumentIcon className="h-5 w-5 text-red-500" />
                  <span className="text-gray-600">
                    {formData.fotoBukti ? formData.fotoBukti.name : "Pilih file bukti"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-green-500 px-6 py-4 text-sm font-semibold text-white shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "MENGIRIM LAPORAN..." : "KIRIM LAPORAN"}
          </button>
        </form>
      </div>

      <BottomNavigation />
    </main>
  );
}

type IconProps = {
  className?: string;
};

function HomeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 12.5v8.5h13v-8.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function HistoryIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v6h6" />
      <path d="M21 12a9 9 0 1 0-3.27 6.92" />
      <path d="M12 7v5l3 1.5" />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c2-4 6-6 8-6s6 2 8 6" />
    </svg>
  );
}

function DocumentIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}

function BackIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}
