"use client";

import { useState, useEffect } from 'react';
import HeaderCard from "../../../components/HeaderCard";
import BottomNavigation from '../../../components/BottomNavigation';
import { 
  getLembagaKemasyarakatan, 
  getLembagaCoverImage 
} from '../../../../lib/profilDesaService';

interface AnggotaLembaga {
  id?: string;
  nama: string;
  jabatan: string;
  email: string;
  noTelepon: string;
  foto?: string;
  urutanTampil: number;
}

export default function LembagaKemasyarakatanPage() {
  const [lembagaKemasyarakatan, setLembagaKemasyarakatan] = useState<AnggotaLembaga[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [dataAnggota, coverImageUrl] = await Promise.all([
          getLembagaKemasyarakatan('kemasyarakatan'),
          getLembagaCoverImage('kemasyarakatan')
        ]);
        
        setLembagaKemasyarakatan(dataAnggota as AnggotaLembaga[]);
        setCoverImage(coverImageUrl);
      } catch (error) {
        console.error('Error fetching lembaga data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Profil Desa" 
          backUrl="/masyarakat/profil-desa"
          showBackButton={true}
        />

        {/* Cover Image Section */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
            <div className="mb-4 text-center text-sm font-semibold text-red-700">
              Foto Lembaga
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-red-100 to-red-200 p-16 text-center shadow-inner overflow-hidden">
              {coverImage ? (
                <img 
                  src={coverImage} 
                  alt="Cover Lembaga Kemasyarakatan"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-6xl">🏛️</span>
              )}
            </div>
          </div>
        </section>

        {/* Community Institutions */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
            <div className="mb-4 text-center text-sm font-semibold text-red-700">
              Lembaga Kemasyarakatan
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Memuat data...</div>
              </div>
            ) : (
              <div className="space-y-3">
                {lembagaKemasyarakatan.length > 0 ? (
                  lembagaKemasyarakatan.map((item, index) => (
                    <div key={item.id || index} className="rounded-xl bg-gray-50 p-3 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-800 text-white overflow-hidden">
                          {item.foto ? (
                            <img 
                              src={item.foto} 
                              alt={item.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            '👤'
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold">
                            <span className="text-gray-500 font-normal">Nama: </span>
                            {item.nama}
                          </div>
                          <div className="text-xs text-gray-600">
                            <span className="text-gray-500 font-normal">Jabatan: </span>
                            {item.jabatan}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500">Belum ada data lembaga kemasyarakatan</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
