"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from "../../components/BottomNavigation";
import { getDataDesa, DataDesaItem } from "../../../lib/dataDesaService";

interface StatistikData {
  id: string;
  nama: string;
  value: string;
  icon: string;
  color: string;
}

export default function DataDesaPage() {
  const [dataWarga, setDataWarga] = useState<DataDesaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataDesa();
        setDataWarga(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const totalPenduduk = dataWarga.length;
  const totalLakiLaki = dataWarga.filter(item => item.jenisKelamin === 'Laki-laki').length;
  const totalPerempuan = dataWarga.filter(item => item.jenisKelamin === 'Perempuan').length;
  const totalKepalaKeluarga = dataWarga.filter(item => item.shdk === 'Kepala Keluarga').length;
  
  // Group data by No KK for total KK count
  const groupedByKK = dataWarga.reduce((groups, warga) => {
    const noKK = warga.noKK || 'Tanpa KK';
    if (!groups[noKK]) {
      groups[noKK] = [];
    }
    groups[noKK].push(warga);
    return groups;
  }, {} as Record<string, DataDesaItem[]>);
  
  const totalKK = Object.keys(groupedByKK).filter(kk => kk !== 'Tanpa KK').length;

  // Create statistics data for display
  const statistikData: StatistikData[] = [
    {
      id: "1",
      nama: "Total Penduduk",
      value: totalPenduduk.toLocaleString(),
      icon: "👥",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "2",
      nama: "Laki-laki",
      value: totalLakiLaki.toLocaleString(),
      icon: "👨",
      color: "from-green-500 to-green-600"
    },
    {
      id: "3",
      nama: "Perempuan",
      value: totalPerempuan.toLocaleString(),
      icon: "👩",
      color: "from-pink-500 to-pink-600"
    },
    {
      id: "4",
      nama: "Kepala Keluarga",
      value: totalKepalaKeluarga.toLocaleString(),
      icon: "🏠",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "5",
      nama: "Total KK",
      value: totalKK.toLocaleString(),
      icon: "📋",
      color: "from-orange-500 to-orange-600"
    },
  ];

  const filteredData = statistikData.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-[100svh] bg-gradient-to-br from-red-50 via-white to-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        {/* Header */}
        <HeaderCard 
          title="Data Desa"
          subtitle="Informasi Desa Dauh Puri Kaja"
          backUrl="/masyarakat/home"
          showBackButton={true}
        />

        {/* Search Section */}
        <section className="mb-6 rounded-3xl bg-white/80 backdrop-blur-md p-4 shadow-lg ring-1 ring-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari statistik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-full border border-gray-300 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all bg-white"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </section>

        {/* Loading State */}
        {loading ? (
          <section className="mb-6 rounded-3xl bg-white/80 backdrop-blur-md p-8 shadow-lg ring-1 ring-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Memuat data penduduk...</p>
            </div>
          </section>
        ) : (
          <>
            {/* Data Summary Card */}
            <section className="mb-6 rounded-3xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-6 text-white shadow-xl ring-1 ring-red-200">
              <div className="space-y-2">
                <p className="text-sm font-medium opacity-90">Total Kategori Statistik</p>
                <p className="text-4xl font-bold">{filteredData.length}</p>
                <p className="text-sm opacity-75">Dari {totalPenduduk} penduduk</p>
              </div>
            </section>

            {/* Statistics Grid */}
            <section className="space-y-3">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <div
                    key={item.id}
                    className={`group rounded-2xl bg-gradient-to-r ${item.color} p-5 text-white shadow-lg hover:shadow-xl ring-1 ring-white/20 hover:ring-white/40 transition-all duration-300 hover:scale-102`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl opacity-90">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium opacity-90 mb-1">
                            {item.nama}
                          </p>
                          <p className="text-2xl font-bold">
                            {item.value}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-8 shadow-md ring-1 ring-gray-100 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-600 font-medium">Tidak ada statistik yang cocok</p>
                  <p className="text-xs text-gray-500 mt-1">Coba ubah pencarian Anda</p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Analysis Button */}
        <section className="mt-8">
          <Link href="/masyarakat/data-desa/analisis">
            <button className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analisis Data
            </button>
          </Link>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
