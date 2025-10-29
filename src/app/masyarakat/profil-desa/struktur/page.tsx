"use client";

import { useState } from "react";
import HeaderCard from "../../../components/HeaderCard";
import BottomNavigation from '../../../components/BottomNavigation';

export default function StrukturPemerintahanPage() {
  const [selectedStructure, setSelectedStructure] = useState<'desa' | 'bpd' | 'lembaga'>('desa');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const strukturDesa = [
    { jabatan: "Kepala Desa", nama: "Nama Kepala Desa" },
    { jabatan: "Sekretaris Desa", nama: "Nama Sekretaris" },
    { jabatan: "Kaur Keuangan", nama: "Nama Kaur Keuangan" },
    { jabatan: "Kaur Umum", nama: "Nama Kaur Umum" },
    { jabatan: "Kaur Kesra", nama: "Nama Kaur Kesra" },
    { jabatan: "Kadus I", nama: "Nama Kadus I" },
    { jabatan: "Kadus II", nama: "Nama Kadus II" },
    { jabatan: "Kadus III", nama: "Nama Kadus III" },
  ];

  const strukturBPD = [
    { jabatan: "Ketua BPD", nama: "Nama Ketua BPD" },
    { jabatan: "Wakil Ketua BPD", nama: "Nama Wakil Ketua" },
    { jabatan: "Sekretaris BPD", nama: "Nama Sekretaris BPD" },
    { jabatan: "Anggota BPD", nama: "Nama Anggota 1" },
    { jabatan: "Anggota BPD", nama: "Nama Anggota 2" },
    { jabatan: "Anggota BPD", nama: "Nama Anggota 3" },
  ];

  const lembagaKemasyarakatan = [
    { nama: "LPM (Lembaga Pemberdayaan Masyarakat)", bidang: "Pemberdayaan Masyarakat" },
    { nama: "PKK (Pembinaan Kesejahteraan Keluarga)", bidang: "Kesejahteraan Keluarga" },
    { nama: "Karang Taruna", bidang: "Pemuda & Olahraga" },
    { nama: "BPD (Badan Permusyawaratan Desa)", bidang: "Musyarawah Desa" },
    { nama: "Linmas (Perlindungan Masyarakat)", bidang: "Keamanan & Ketertiban" },
  ];

  const structureOptions = [
    { key: 'desa', label: 'Struktur Pemerintahan Desa' },
    { key: 'bpd', label: 'Badan Permusyawaratan Desa' }
  ];

  const getCurrentData = () => {
    switch(selectedStructure) {
      case 'desa': return strukturDesa;
      case 'bpd': return strukturBPD;
      case 'lembaga': return lembagaKemasyarakatan;
      default: return strukturDesa;
    }
  };

  const getCurrentTitle = () => {
    return structureOptions.find(opt => opt.key === selectedStructure)?.label || 'Struktur Pemerintahan Desa';
  };

  const getCurrentPhotoTitle = () => {
    switch(selectedStructure) {
      case 'desa': return 'Foto Struktur Desa';
      case 'bpd': return 'Foto Struktur BPD';
      case 'lembaga': return 'Foto Struktur';
      default: return 'Foto Struktur Desa';
    }
  };

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Profil Desa" 
          backUrl="/masyarakat/profil-desa"
        />

        {/* Dropdown Selector */}
        <section className="mb-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-gray-300 flex items-center justify-between"
            >
              <span>{getCurrentTitle()}</span>
              <span className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>⌄</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg ring-1 ring-gray-300 z-10">
                {structureOptions.map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      setSelectedStructure(option.key as 'desa' | 'bpd' | 'lembaga');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-6 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50 first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Content Section */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
            <div className="mb-4 text-center text-sm font-semibold text-red-700">
              {getCurrentPhotoTitle()}
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-red-100 to-red-200 p-16 text-center shadow-inner mb-4">
              <span className="text-6xl">🏛️</span>
            </div>

            {/* Dynamic Organizational Chart */}
            <div className="space-y-3">
              {getCurrentData().map((item, index) => (
                <div key={index} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 shadow-sm">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-800 text-white">
                    👤
                  </div>
                  <div className="flex-1">
                    {'jabatan' in item ? (
                      // Government/BPD Structure
                      <>
                        <div className="text-sm font-semibold">{item.jabatan}</div>
                        <div className="text-xs text-gray-600">{item.nama}</div>
                      </>
                    ) : (
                      // Community Institutions
                      <>
                        <div className="text-sm font-semibold">{item.nama}</div>
                        <div className="text-xs text-gray-600">{item.bidang}</div>
                      </>
                    )}
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
