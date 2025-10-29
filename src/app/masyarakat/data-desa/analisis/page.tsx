"use client";

import React, { useState, useEffect } from "react";
import HeaderCard from "../../../components/HeaderCard";
import BottomNavigation from "../../../components/BottomNavigation";
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

// Data untuk grafik batang (Jenis Kelamin)
const jenisKelaminData: ChartData[] = [
  { name: "Laki-laki", value: 245 },
  { name: "Perempuan", value: 318 },
];

// Data untuk grafik donat (Pekerjaan)
const pekerjaanData: ChartData[] = [
  { name: "PNS", value: 85 },
  { name: "Swasta", value: 142 },
  { name: "Wiraswasta", value: 178 },
  { name: "Petani", value: 95 },
  { name: "Lainnya", value: 63 },
];

// Data untuk grafik batang tambahan (Pendidikan)
const pendidikanData: ChartData[] = [
  { name: "SD", value: 120 },
  { name: "SMP", value: 98 },
  { name: "SMA", value: 215 },
  { name: "S1", value: 105 },
  { name: "S2", value: 25 },
];

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

  useEffect(() => {
    // Trigger animasi saat komponen dimuat
    setIsLoaded(true);
  }, []);

  return (
    <main className="min-h-[100svh] bg-gradient-to-br from-red-50 via-white to-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-3 sm:px-4 pb-20 pt-4">
        {/* Header */}
        <HeaderCard 
          title="Analisis Data"
          subtitle="Visualisasi Data Desa Dauh Puri Kaja"
          backUrl="/masyarakat/data-desa"
        />

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
              <p className="text-xs text-gray-600 mt-2">Total: 563 Penduduk</p>
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
              <p className="text-xs text-gray-600 mt-2">Total: 563 Penduduk</p>
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
              <p className="text-xs text-gray-600 mt-2">Total: 563 Penduduk</p>
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
                <p className="text-2xl sm:text-3xl font-bold">563</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm opacity-90">Kategori Pekerjaan</p>
                <p className="text-2xl sm:text-3xl font-bold">5</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm opacity-90">Tingkat Pendidikan</p>
                <p className="text-2xl sm:text-3xl font-bold">5</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm opacity-90">Jenis Kelamin</p>
                <p className="text-2xl sm:text-3xl font-bold">2</p>
              </div>
            </div>
          </section>
        </div>

      </div>

      <BottomNavigation />
    </main>
  );
}
