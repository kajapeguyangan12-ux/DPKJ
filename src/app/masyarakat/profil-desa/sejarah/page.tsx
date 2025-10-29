"use client";

import { useState, useEffect } from "react";
import HeaderCard from "../../../components/HeaderCard";
import BottomNavigation from '../../../components/BottomNavigation';
import {
  getSejarahContent,
  subscribeToSejarahContent,
  type SejarahContent,
} from "../../../../lib/profilDesaService";

export default function SejarahDesaPage() {
  const [sejarahData, setSejarahData] = useState<SejarahContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSejarahData = async () => {
      try {
        const data = await getSejarahContent();
        setSejarahData(data);
      } catch (error) {
        console.error('Error loading sejarah data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSejarahData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToSejarahContent((data) => {
      setSejarahData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <HeaderCard 
          title="Profil Desa" 
          backUrl="/masyarakat/profil-desa"
          showBackButton={true}
        />

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data sejarah...</p>
          </div>
        ) : sejarahData && sejarahData.deskripsi ? (
          <>
            {/* Foto Sejarah Section */}
            {sejarahData.fotoUrl && (
              <section className="mb-6">
                <div className="rounded-3xl bg-white/90 backdrop-blur-sm overflow-hidden shadow-xl ring-1 ring-red-200">
                  <img
                    src={sejarahData.fotoUrl}
                    alt="Foto Sejarah Desa"
                    className="w-full h-48 object-cover"
                  />
                </div>
              </section>
            )}

            {/* Detail Sejarah Section */}
            <section className="mb-6">
              <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
                <div className="mb-4 text-center text-sm font-semibold text-red-700">
                  Detail Sejarah Desa
                </div>

                <div className="rounded-2xl bg-gray-50 p-6 shadow-inner">
                  <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                    {/* Deskripsi Utama */}
                    {sejarahData.deskripsi && (
                      <p className="text-base font-semibold text-gray-800 mb-4">
                        {sejarahData.deskripsi}
                      </p>
                    )}

                    {/* Asal Usul */}
                    {sejarahData.asalUsul && (
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">Asal-usul:</p>
                        <p>{sejarahData.asalUsul}</p>
                      </div>
                    )}

                    {/* Tahun Berdiri */}
                    {sejarahData.tahunBerdiri && (
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">Tahun Berdiri:</p>
                        <p>{sejarahData.tahunBerdiri}</p>
                      </div>
                    )}

                    {/* Hari Jadi */}
                    {sejarahData.hariJadi && (
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">Hari Jadi:</p>
                        <p>{sejarahData.hariJadi}</p>
                      </div>
                    )}

                    {/* Tokoh Pendiri */}
                    {sejarahData.tokohPendiri && (
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">Tokoh Pendiri:</p>
                        <p>{sejarahData.tokohPendiri}</p>
                      </div>
                    )}

                    {/* Perkembangan */}
                    {sejarahData.perkembangan && (
                      <div>
                        <p className="font-semibold text-gray-800 mb-2">Perkembangan:</p>
                        <p>{sejarahData.perkembangan}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium mb-2">Belum ada data sejarah</p>
            <p className="text-gray-500">Data sejarah akan ditampilkan setelah admin mengisinya</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}
