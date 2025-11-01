"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import BottomNavigation from "../../../components/BottomNavigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface PendudukData {
  jenisKelamin?: string;
  pekerjaan?: string;
  pendidikan?: string;
}

// Warna untuk chart
const COLORS = ["#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2"];
const BAR_COLORS = ["#dc2626", "#ef4444"];

// Custom Tooltip untuk chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-3 border border-red-200">
        <p className="text-sm font-semibold text-gray-800">{payload[0].payload.name}</p>
        <p className="text-sm font-bold text-red-600">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function AnalisisPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jenisKelaminData, setJenisKelaminData] = useState<ChartData[]>([]);
  const [pekerjaanData, setPekerjaanData] = useState<ChartData[]>([]);
  const [pendidikanData, setPendidikanData] = useState<ChartData[]>([]);
  const [totalPenduduk, setTotalPenduduk] = useState(0);

  useEffect(() => {
    fetchDataFromFirebase();
    setIsLoaded(true);
  }, []);

  const fetchDataFromFirebase = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "penduduk"));
      const allData: PendudukData[] = [];
      
      querySnapshot.forEach((doc) => {
        allData.push(doc.data() as PendudukData);
      });

      console.log('Total data penduduk:', allData.length);
      setTotalPenduduk(allData.length);

      // Hitung Jenis Kelamin
      const jenisKelaminCount: { [key: string]: number } = {};
      allData.forEach((item) => {
        const jk = item.jenisKelamin || 'Tidak Diketahui';
        jenisKelaminCount[jk] = (jenisKelaminCount[jk] || 0) + 1;
      });
      const jkData: ChartData[] = Object.entries(jenisKelaminCount).map(([name, value]) => ({
        name,
        value
      }));
      setJenisKelaminData(jkData);
      console.log('Jenis Kelamin:', jkData);

      // Hitung Pekerjaan
      const pekerjaanCount: { [key: string]: number } = {};
      allData.forEach((item) => {
        const pekerjaan = item.pekerjaan || 'Tidak Diketahui';
        pekerjaanCount[pekerjaan] = (pekerjaanCount[pekerjaan] || 0) + 1;
      });
      const pkrjData: ChartData[] = Object.entries(pekerjaanCount).map(([name, value]) => ({
        name,
        value
      }));
      setPekerjaanData(pkrjData);
      console.log('Pekerjaan:', pkrjData);

      // Hitung Pendidikan
      const pendidikanCount: { [key: string]: number } = {};
      allData.forEach((item) => {
        const pendidikan = item.pendidikan || 'Tidak Diketahui';
        pendidikanCount[pendidikan] = (pendidikanCount[pendidikan] || 0) + 1;
      });
      const pndData: ChartData[] = Object.entries(pendidikanCount).map(([name, value]) => ({
        name,
        value
      }));
      setPendidikanData(pndData);
      console.log('Pendidikan:', pndData);

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal memuat data dari Firebase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100svh] bg-gradient-to-br from-red-50 via-white to-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-3 sm:px-4 pb-20 pt-4">
        {/* Header with Back Button */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl sm:rounded-3xl shadow-xl mb-4 sm:mb-6 overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Back Button */}
              <Link href="/masyarakat/data-desa">
                <button className="p-2 sm:p-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </Link>
              
              {/* Title */}
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white">Analisis Data</h1>
                <p className="text-xs sm:text-sm text-red-100 mt-1">Visualisasi Data Desa Dauh Puri Kaja</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Charts Container */}
            <div className="space-y-4 sm:space-y-6">
          {/* Grafik Batang - Jenis Kelamin */}
          <section 
            className={`rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-md p-4 sm:p-6 shadow-lg ring-1 ring-gray-100 transition-all duration-700 transform ${
              isLoaded 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-95 translate-y-4"
            }`}
          >
            <div className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                Distribusi Jenis Kelamin
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
              <p className="text-xs text-gray-600 mt-2">Total: {totalPenduduk} Penduduk</p>
            </div>

            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px] md:h-[350px]">
                <BarChart data={jenisKelaminData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb"
                  />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: "20px" }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="value"
                    fill="#dc2626"
                    radius={8}
                    animationDuration={1000}
                    animationBegin={100}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Grafik Donat - Pekerjaan */}
          <section 
            className={`rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-md p-4 sm:p-6 shadow-lg ring-1 ring-gray-100 transition-all duration-700 transform delay-150 ${
              isLoaded 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-95 translate-y-4"
            }`}
          >
            <div className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                Distribusi Pekerjaan
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
              <p className="text-xs text-gray-600 mt-2">Total: {totalPenduduk} Penduduk</p>
            </div>

            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px] md:h-[350px]">
                <PieChart>
                  <Pie
                    data={pekerjaanData}
                    cx="50%"
                    cy="50%"
                    innerRadius="25%"
                    outerRadius="75%"
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={1000}
                    animationBegin={300}
                  >
                    {pekerjaanData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend untuk Donat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-6 pt-4 border-t border-gray-200">
              {pekerjaanData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-gray-700 font-medium">{item.name}</span>
                  <span className="text-gray-500">({item.value})</span>
                </div>
              ))}
            </div>
          </section>

          {/* Grafik Batang - Pendidikan */}
          <section 
            className={`rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-md p-4 sm:p-6 shadow-lg ring-1 ring-gray-100 transition-all duration-700 transform delay-300 ${
              isLoaded 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-95 translate-y-4"
            }`}
          >
            <div className="mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                Distribusi Pendidikan
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
              <p className="text-xs text-gray-600 mt-2">Total: {totalPenduduk} Penduduk</p>
            </div>

            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={250} className="sm:h-[300px] md:h-[350px]">
                <BarChart data={pendidikanData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb"
                  />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill="#ef4444"
                    radius={8}
                    animationDuration={1000}
                    animationBegin={500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Summary Statistics */}
          <section 
            className={`rounded-2xl sm:rounded-3xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 p-4 sm:p-6 text-white shadow-xl ring-1 ring-red-200 transition-all duration-700 transform delay-500 ${
              isLoaded 
                ? "opacity-100 scale-100 translate-y-0" 
                : "opacity-0 scale-95 translate-y-4"
            }`}
          >
            <h2 className="text-base sm:text-lg font-bold mb-4">Ringkasan Data</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm opacity-90">Total Penduduk</p>
                <p className="text-2xl sm:text-3xl font-bold">{totalPenduduk}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm opacity-90">Kategori Pekerjaan</p>
                <p className="text-2xl sm:text-3xl font-bold">{pekerjaanData.length}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm opacity-90">Tingkat Pendidikan</p>
                <p className="text-2xl sm:text-3xl font-bold">{pendidikanData.length}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm opacity-90">Jenis Kelamin</p>
                <p className="text-2xl sm:text-3xl font-bold">{jenisKelaminData.length}</p>
              </div>
            </div>
          </section>
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}
