"use client";

import { useState, useEffect } from "react";
import HeaderCard from "../../../components/HeaderCard";
import BottomNavigation from '../../../components/BottomNavigation';
import { getStrukturPemerintahan, getStrukturCoverImage, AnggotaStruktur } from "../../../../lib/profilDesaService";

export default function StrukturPemerintahanPage() {
  const [selectedStructure, setSelectedStructure] = useState<'pemerintahan-desa' | 'bpd'>('pemerintahan-desa');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [anggotaList, setAnggotaList] = useState<AnggotaStruktur[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStrukturData();
  }, [selectedStructure]);

  const fetchStrukturData = async () => {
    try {
      setLoading(true);
      const data = await getStrukturPemerintahan(selectedStructure);
      setAnggotaList(data.sort((a, b) => a.urutan - b.urutan));
      
      // Get cover image
      const coverImageUrl = await getStrukturCoverImage(selectedStructure);
      setCoverImage(coverImageUrl);
    } catch (error) {
      console.error('Error fetching struktur data:', error);
    } finally {
      setLoading(false);
    }
  };

  const structureOptions = [
    { key: 'pemerintahan-desa' as const, label: 'Struktur Pemerintahan Desa' },
    { key: 'bpd' as const, label: 'Badan Permusyawaratan Desa' }
  ];

  const getCurrentTitle = () => {
    return structureOptions.find(opt => opt.key === selectedStructure)?.label || 'Struktur Pemerintahan Desa';
  };

  const getCurrentPhotoTitle = () => {
    switch(selectedStructure) {
      case 'pemerintahan-desa': return 'Foto Struktur Desa';
      case 'bpd': return 'Foto Struktur BPD';
      default: return 'Foto Struktur Desa';
    }
  };

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Profil Desa" 
          backUrl="/masyarakat/profil-desa"
          showBackButton={true}
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
                      setSelectedStructure(option.key);
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

            {/* Cover Image */}
            {coverImage ? (
              <div className="rounded-2xl overflow-hidden shadow-inner mb-4">
                <img
                  src={coverImage}
                  alt={getCurrentPhotoTitle()}
                  className="w-full h-48 object-cover"
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-red-100 to-red-200 p-16 text-center shadow-inner mb-4">
                <span className="text-6xl">🏛️</span>
                <p className="text-sm text-red-700 mt-2 font-medium">Foto belum tersedia</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center text-sm text-gray-500 py-4">
                Memuat data...
              </div>
            )}

            {/* Anggota List */}
            {!loading && anggotaList.length > 0 ? (
              <div className="space-y-4">
                {anggotaList.map((anggota, index) => (
                  <div key={anggota.id || index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/30">
                    <div className="flex items-start gap-4">
                      {/* Profile Photo */}
                      <div className="flex-shrink-0">
                        {anggota.foto ? (
                          <img
                            src={anggota.foto}
                            alt={anggota.nama}
                            className="h-16 w-16 rounded-full object-cover border-2 border-red-200 shadow-sm"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center text-white text-2xl shadow-sm">
                            👤
                          </div>
                        )}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        {/* Nama Section */}
                        <div className="mb-3">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Nama
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 leading-tight">
                            {anggota.nama}
                          </h4>
                        </div>
                        
                        {/* Jabatan Section */}
                        <div className="mb-2">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Jabatan
                          </div>
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 border border-red-200">
                            <span className="text-sm font-semibold text-red-700">
                              {anggota.jabatan}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !loading && (
              <div className="text-center text-sm text-gray-500 py-4">
                Belum ada data struktur
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
