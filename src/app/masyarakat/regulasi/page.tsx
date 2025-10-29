"use client";

import Link from "next/link";
import { useState } from "react";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from '../../components/BottomNavigation';

export default function RegulasiPage() {
  const [status, setStatus] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const regulasiData = {
    nama: "Nama Regulasi",
    deskripsi: "Deskripsi Regulasi",
    status: status,
    detailLengkap: `Peraturan Desa Nomor 01 Tahun 2024 tentang Pengelolaan Sampah dan Kebersihan Lingkungan Desa Peguyangan Kaja.

    Pasal 1: Ketentuan Umum
    Dalam peraturan ini yang dimaksud dengan:
    1. Desa adalah Desa Peguyangan Kaja
    2. Pemerintah Desa adalah Kepala Desa beserta perangkat desa
    3. Sampah adalah sisa kegiatan sehari-hari manusia atau proses alam

    Pasal 2: Tujuan
    Peraturan ini bertujuan untuk:
    a. Mewujudkan lingkungan desa yang bersih dan sehat
    b. Meningkatkan kesadaran masyarakat tentang pengelolaan sampah
    c. Mengatur pembuangan dan pengolahan sampah yang benar

    Pasal 3: Ruang Lingkup
    Peraturan ini mengatur tentang:
    1. Pengelolaan sampah rumah tangga
    2. Pengelolaan sampah dari usaha ekonomi
    3. Pengolahan sampah menjadi barang berguna
    4. Sanksi atas pelanggaran pengelolaan sampah

    Pasal 4: Kewajiban Masyarakat
    Setiap masyarakat desa wajib:
    a. Memilah sampah organik dan anorganik
    b. Membuang sampah pada tempat yang telah disediakan
    c. Mengolah sampah yang dapat didaur ulang
    d. Berpartisipasi dalam kegiatan kerja bakti kebersihan

    Pasal 5: Sanksi
    1. Pelanggaran ringan: Teguran lisan dari petugas
    2. Pelanggaran sedang: Denda administratif Rp 50.000
    3. Pelanggaran berat: Denda administratif Rp 100.000

    Pasal 6: Ketentuan Penutup
    Peraturan ini mulai berlaku pada tanggal diundangkan dan dapat dievaluasi sesuai kebutuhan.`
  };

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Regulasi Desa" 
          subtitle="Peraturan & Kebijakan"
          backUrl="/masyarakat/home"
        />

        {/* Regulation Content */}
        <div className="space-y-4">
          {/* Nama Regulasi Section */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Nama Regulasi
            </label>
            <div className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm">
              {regulasiData.nama}
            </div>
          </div>

          {/* Deskripsi Regulasi Section */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Deskripsi Regulasi
            </label>
            <div className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm min-h-[80px]">
              {regulasiData.deskripsi}
            </div>
          </div>

          {/* Status Section */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Status :
            </label>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <input
                  type="checkbox"
                  id="status-toggle"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="sr-only"
                />
                <label
                  htmlFor="status-toggle"
                  className={`flex items-center cursor-pointer rounded-full p-1 transition-colors ${
                    status ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform ${
                      status ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </label>
              </div>
              <span className="ml-3 text-sm font-medium">
                {status ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </div>
          </div>

          {/* Show More Button */}
          <div className="text-center">
            <button
              onClick={() => setShowMore(!showMore)}
              className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
            >
              {showMore ? 'Tutup Detail' : 'Tampilkan Lebih Banyak'}
            </button>
          </div>

          {/* Detailed Content (shown when expanded) */}
          {showMore && (
            <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
              <div className="rounded-2xl bg-gray-50 p-6 shadow-inner">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {regulasiData.detailLengkap}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}
