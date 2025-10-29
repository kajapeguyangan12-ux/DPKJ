"use client";

import HeaderCard from "../../../components/HeaderCard";
import BottomNavigation from '../../../components/BottomNavigation';
import { useState, useEffect } from "react";
import {
  getProfilDesa,
  subscribeToProfilDesa,
  getWilayahContent,
  subscribeToWilayahContent,
  type ProfilDesaData,
  type WilayahContent,
} from "../../../../lib/profilDesaService";

export default function Page() {
  const [profilData, setProfilData] = useState<ProfilDesaData | null>(null);
  const [wilayahData, setWilayahData] = useState<WilayahContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profilDesaData, wilayahContent] = await Promise.all([
          getProfilDesa(),
          getWilayahContent()
        ]);
        setProfilData(profilDesaData);
        setWilayahData(wilayahContent);
      } catch (error) {
        console.error('Error loading profil desa data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const unsubscribeProfil = subscribeToProfilDesa((data: ProfilDesaData | null) => {
      setProfilData(data);
      setLoading(false);
    });

    const unsubscribeWilayah = subscribeToWilayahContent((data: WilayahContent | null) => {
      setWilayahData(data);
      setLoading(false);
    });

    return () => {
      unsubscribeProfil();
      unsubscribeWilayah();
    };
  }, []);

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Profil Desa" 
          backUrl="/masyarakat/profil-desa"
        />

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search....."
              className="w-full rounded-full border border-gray-300 bg-white/90 px-4 py-2 pl-10 text-sm shadow-sm backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex justify-center">
          {wilayahData?.fotoUrl ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
              <img
                src={wilayahData.fotoUrl}
                alt="Foto Wilayah"
                className="h-40 w-40 object-cover"
              />
            </div>
          ) : (
            <div className="space-y-3 text-sm text-gray-700">
              {loading ? (
                <p className="text-gray-500">Memuat data...</p>
              ) : wilayahData?.deskripsi ? (
                <p className="leading-relaxed">{wilayahData.deskripsi}</p>
              ) : profilData?.wilayah?.namaDesa ? (
                <>
                  <p>
                    Wilayah Desa {profilData.wilayah.namaDesa} terletak di {profilData.wilayah.kecamatan},
                    {profilData.wilayah.kabupaten}, {profilData.wilayah.provinsi}.
                    Desa ini memiliki luas wilayah sekitar {profilData.wilayah.luasWilayah} dengan batas-batas sebagai berikut:
                  </p>
                  <p className="text-left">
                    - Sebelah Utara: {profilData.wilayah.batasUtara}<br/>
                    - Sebelah Selatan: {profilData.wilayah.batasSelatan}<br/>
                    - Sebelah Barat: {profilData.wilayah.batasBarat}<br/>
                    - Sebelah Timur: {profilData.wilayah.batasTimur}
                  </p>
                  <p>
                    Topografi wilayah didominasi oleh dataran rendah dengan ketinggian
                    rata-rata {profilData.wilayah.koordinat?.latitude || 'N/A'} meter di atas permukaan laut.
                    Kondisi tanah subur sangat mendukung untuk kegiatan pertanian dan perkebunan.
                  </p>
                </>
              ) : (
                <p className="text-gray-500">Data wilayah belum tersedia</p>
              )}
            </div>
          )}
        </div>

        {/* Tabel Data Wilayah Section */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-4 shadow-xl ring-1 ring-red-200">
            <div className="mb-4 text-center text-sm font-semibold text-red-700">
              Tabel Data Wilayah
            </div>

            {/* Data Table */}
            <div className="rounded-2xl bg-white border border-gray-200 shadow-inner">
              <div className="p-4">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Memuat data...</p>
                  </div>
                ) : profilData?.wilayah ? (
                  <table className="w-full text-xs">
                    <tbody className="space-y-2">
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Nama Desa</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.namaDesa || 'Belum diisi'}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Kecamatan</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.kecamatan || 'Belum diisi'}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Kabupaten</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.kabupaten || 'Belum diisi'}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Provinsi</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.provinsi || 'Belum diisi'}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Kode POS</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.kodePos || 'Belum diisi'}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Luas Wilayah</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.luasWilayah || 'Belum diisi'}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Jumlah Dusun</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.jumlahDusun || 'Belum diisi'}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Jumlah RW</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.jumlahRW || 'Belum diisi'}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Jumlah RT</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.jumlahRT || 'Belum diisi'}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Koordinat</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.koordinat.latitude}, {profilData.wilayah.koordinat.longitude}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Batas Utara</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.batasUtara || 'Belum diisi'}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Batas Selatan</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.batasSelatan || 'Belum diisi'}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-2 font-semibold text-gray-700">Batas Timur</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.batasTimur || 'Belum diisi'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold text-gray-700">Batas Barat</td>
                        <td className="py-2 text-gray-600">: {profilData.wilayah.batasBarat || 'Belum diisi'}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Belum ada data wilayah</p>
                    <p className="text-sm">Data akan muncul setelah diisi admin</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
