"use client";

import React, { useState } from "react";
import Link from "next/link";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from "../../components/BottomNavigation";

interface DataItem {
  id: string;
  nama: string;
  value: string;
}

const dataDesa: DataItem[] = [
  { id: "1", nama: "Nama Desa", value: "Dauh Puri Kaja" },
  { id: "2", nama: "Jenis Kelamin", value: "Perempuan" },
  { id: "3", nama: "Pekerjaan", value: "PNS" },
  { id: "4", nama: "Suku Bangsa", value: "Bali" },
  { id: "5", nama: "Pendidikan", value: "S1" },
];

const kategoriList = [
  "Agama",
  "Jenis Kelamin",
  "Pekerjaan",
  "Suku Bangsa",
  "Pendidikan",
];

export default function DataDesaPage() {
  const [selectedCategory, setSelectedCategory] = useState<"desa" | "kategori">("desa");
  const [selectedKategori, setSelectedKategori] = useState<string>("");
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = dataDesa.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-[100svh] bg-gradient-to-br from-red-50 via-white to-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-3 sm:px-4 lg:px-6 pb-20 pt-4">
        {/* Header */}
        <HeaderCard 
          title="Data Desa"
          subtitle="Informasi Desa Dauh Puri Kaja"
          backUrl="/masyarakat/home"
        />

        {/* Filter Section */}
        <section className="mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-md p-3 sm:p-4 shadow-lg ring-1 ring-gray-100">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
            <button
              onClick={() => {
                setSelectedCategory("desa");
                setShowKategoriDropdown(false);
              }}
              className={`py-2 sm:py-2.5 px-3 sm:px-4 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 ${
                selectedCategory === "desa"
                  ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pilih Desa
            </button>
            
            {/* Kategori Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowKategoriDropdown(!showKategoriDropdown)}
                className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-between ${
                  selectedCategory === "kategori"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>Pilih Kategori</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${showKategoriDropdown ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showKategoriDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 sm:mt-2 bg-white rounded-xl sm:rounded-2xl shadow-xl ring-1 ring-gray-100 z-50 overflow-hidden">
                  <div className="max-h-48 sm:max-h-60 overflow-y-auto">
                    {kategoriList.map((kategori, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedKategori(kategori);
                          setSelectedCategory("kategori");
                          setShowKategoriDropdown(false);
                        }}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left font-medium text-xs sm:text-sm transition-all hover:bg-red-50 ${
                          selectedKategori === kategori
                            ? "bg-red-100 text-red-700"
                            : "text-gray-700"
                        }`}
                      >
                        {kategori}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-8 sm:pl-10 rounded-full border border-gray-300 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all bg-white text-sm"
            />
            <svg className="absolute left-2.5 sm:left-3 top-2.5 sm:top-3.5 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </section>

        {/* Data Summary Card */}
        <section className="mb-4 sm:mb-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-4 sm:p-6 text-white shadow-xl ring-1 ring-red-200">
          <div className="space-y-1 sm:space-y-2">
            <p className="text-xs sm:text-sm font-medium opacity-90">Total Data</p>
            <p className="text-3xl sm:text-4xl font-bold">{filteredData.length}</p>
            <p className="text-xs sm:text-sm opacity-75">Data tersedia</p>
          </div>
        </section>

        {/* Data List */}
        <section className="space-y-2 sm:space-y-3">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm p-3 sm:p-4 shadow-md hover:shadow-xl ring-1 ring-gray-100 hover:ring-red-200 transition-all duration-300 hover:scale-102 hover:bg-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-red-600 mb-1">
                      {item.nama}
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {item.value}
                    </p>
                  </div>
                  <div className="ml-3 sm:ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm p-6 sm:p-8 shadow-md ring-1 ring-gray-100 text-center">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🔍</div>
              <p className="text-sm sm:text-base text-gray-600 font-medium">Tidak ada data yang cocok</p>
              <p className="text-xs text-gray-500 mt-1">Coba ubah pencarian Anda</p>
            </div>
          )}
        </section>

        {/* Analysis Button */}
        <section className="mt-6 sm:mt-8">
          <Link href="/masyarakat/data-desa/analisis">
            <button className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
