"use client";

import HeaderCard from "../../../components/HeaderCard";
import BottomNavigation from '../../../components/BottomNavigation';

export default function LembagaKemasyarakatanPage() {
  const lembagaKemasyarakatan = [
    { nama: "LPM (Lembaga Pemberdayaan Masyarakat)", bidang: "Pemberdayaan Masyarakat" },
    { nama: "PKK (Pembinaan Kesejahteraan Keluarga)", bidang: "Kesejahteraan Keluarga" },
    { nama: "Karang Taruna", bidang: "Pemuda & Olahraga" },
    { nama: "BPD (Badan Permusyawaratan Desa)", bidang: "Musyarawah Desa" },
    { nama: "Linmas (Perlindungan Masyarakat)", bidang: "Keamanan & Ketertiban" },
  ];

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Profil Desa" 
          backUrl="/masyarakat/profil-desa"
        />

        {/* Foto Struktur Section */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
            <div className="mb-4 text-center text-sm font-semibold text-red-700">
              Foto Struktur
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-red-100 to-red-200 p-16 text-center shadow-inner">
              <span className="text-6xl">🏛️</span>
            </div>
          </div>
        </section>

        {/* Community Institutions */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
            <div className="mb-4 text-center text-sm font-semibold text-red-700">
              Lembaga Kemasyarakatan
            </div>

            <div className="space-y-3">
              {lembagaKemasyarakatan.map((item, index) => (
                <div key={index} className="rounded-xl bg-gray-50 p-3 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-800 text-white">
                      👤
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{item.nama}</div>
                      <div className="text-xs text-gray-600">{item.bidang}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
