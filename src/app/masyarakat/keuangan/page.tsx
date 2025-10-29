"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from '../../components/BottomNavigation';
import { BarChart3, TrendingUp } from "lucide-react";

type FinanceCategory = "pendapatan" | "belanja" | "pembiayaan";
type DatasetKey = "anggaran" | "realisasi" | "lebihKurang";

type FinanceRow = {
  label: string;
  amount: number;
};

const yearOptions = [2025, 2024, 2023] as const;

const categoryLabels: Record<FinanceCategory, string> = {
  pendapatan: "Pendapatan",
  belanja: "Belanja",
  pembiayaan: "Pembiayaan",
};

const datasetLabels: Record<DatasetKey, string> = {
  anggaran: "Anggaran",
  realisasi: "Realisasi",
  lebihKurang: "Lebih/Kurang",
};

const financeData: Record<
  FinanceCategory,
  Record<number, { anggaran: FinanceRow[]; realisasi: FinanceRow[] }>
> = {
  pendapatan: {
    2025: {
      anggaran: [
        { label: "Pendapatan Asli Desa", amount: 180_000_000 },
        { label: "Dana Desa", amount: 520_000_000 },
        { label: "Bagi Hasil Pajak & Retribusi", amount: 130_000_000 },
      ],
      realisasi: [
        { label: "Pendapatan Asli Desa", amount: 165_000_000 },
        { label: "Dana Desa", amount: 498_000_000 },
        { label: "Bagi Hasil Pajak & Retribusi", amount: 124_000_000 },
      ],
    },
    2024: {
      anggaran: [
        { label: "Pendapatan Asli Desa", amount: 165_000_000 },
        { label: "Dana Desa", amount: 490_000_000 },
        { label: "Bagi Hasil Pajak & Retribusi", amount: 118_000_000 },
      ],
      realisasi: [
        { label: "Pendapatan Asli Desa", amount: 158_000_000 },
        { label: "Dana Desa", amount: 470_000_000 },
        { label: "Bagi Hasil Pajak & Retribusi", amount: 110_000_000 },
      ],
    },
    2023: {
      anggaran: [
        { label: "Pendapatan Asli Desa", amount: 150_000_000 },
        { label: "Dana Desa", amount: 460_000_000 },
        { label: "Bagi Hasil Pajak & Retribusi", amount: 105_000_000 },
      ],
      realisasi: [
        { label: "Pendapatan Asli Desa", amount: 142_000_000 },
        { label: "Dana Desa", amount: 445_000_000 },
        { label: "Bagi Hasil Pajak & Retribusi", amount: 100_000_000 },
      ],
    },
  },
  belanja: {
    2025: {
      anggaran: [
        { label: "Belanja Pegawai", amount: 210_000_000 },
        { label: "Belanja Operasional", amount: 175_000_000 },
        { label: "Belanja Modal", amount: 320_000_000 },
      ],
      realisasi: [
        { label: "Belanja Pegawai", amount: 208_000_000 },
        { label: "Belanja Operasional", amount: 168_000_000 },
        { label: "Belanja Modal", amount: 295_000_000 },
      ],
    },
    2024: {
      anggaran: [
        { label: "Belanja Pegawai", amount: 200_000_000 },
        { label: "Belanja Operasional", amount: 160_000_000 },
        { label: "Belanja Modal", amount: 300_000_000 },
      ],
      realisasi: [
        { label: "Belanja Pegawai", amount: 194_000_000 },
        { label: "Belanja Operasional", amount: 154_000_000 },
        { label: "Belanja Modal", amount: 288_000_000 },
      ],
    },
    2023: {
      anggaran: [
        { label: "Belanja Pegawai", amount: 192_000_000 },
        { label: "Belanja Operasional", amount: 150_000_000 },
        { label: "Belanja Modal", amount: 280_000_000 },
      ],
      realisasi: [
        { label: "Belanja Pegawai", amount: 182_000_000 },
        { label: "Belanja Operasional", amount: 145_000_000 },
        { label: "Belanja Modal", amount: 270_000_000 },
      ],
    },
  },
  pembiayaan: {
    2025: {
      anggaran: [
        { label: "Penerimaan Pembiayaan", amount: 85_000_000 },
        { label: "Pengeluaran Pembiayaan", amount: 35_000_000 },
      ],
      realisasi: [
        { label: "Penerimaan Pembiayaan", amount: 80_000_000 },
        { label: "Pengeluaran Pembiayaan", amount: 28_000_000 },
      ],
    },
    2024: {
      anggaran: [
        { label: "Penerimaan Pembiayaan", amount: 75_000_000 },
        { label: "Pengeluaran Pembiayaan", amount: 32_000_000 },
      ],
      realisasi: [
        { label: "Penerimaan Pembiayaan", amount: 70_000_000 },
        { label: "Pengeluaran Pembiayaan", amount: 26_000_000 },
      ],
    },
    2023: {
      anggaran: [
        { label: "Penerimaan Pembiayaan", amount: 68_000_000 },
        { label: "Pengeluaran Pembiayaan", amount: 28_000_000 },
      ],
      realisasi: [
        { label: "Penerimaan Pembiayaan", amount: 63_000_000 },
        { label: "Pengeluaran Pembiayaan", amount: 20_000_000 },
      ],
    },
  },
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export default function KeuanganMasyarakatPage() {
  const [selectedYear, setSelectedYear] = useState<number>(yearOptions[0]);
  const [activeCategory, setActiveCategory] =
    useState<FinanceCategory>("pendapatan");
  const [activeDataset, setActiveDataset] =
    useState<DatasetKey>("anggaran");

  const sectionForYear =
    financeData[activeCategory][selectedYear] ??
    financeData[activeCategory][yearOptions[0]];

  const differenceRows = useMemo<FinanceRow[]>(() => {
    const realisasiMap = new Map(
      sectionForYear.realisasi.map((row) => [row.label, row.amount])
    );

    return sectionForYear.anggaran.map((row) => ({
      label: row.label,
      amount: (realisasiMap.get(row.label) ?? 0) - row.amount,
    }));
  }, [sectionForYear]);

  const chartRows =
    activeDataset === "lebihKurang"
      ? differenceRows
      : activeDataset === "anggaran"
      ? sectionForYear.anggaran
      : sectionForYear.realisasi;

  const maxChartValue =
    chartRows.length > 0
      ? Math.max(...chartRows.map((row) => Math.abs(row.amount)))
      : 1;

  const totalAnggaran = sectionForYear.anggaran.reduce(
    (sum, row) => sum + row.amount,
    0
  );
  const totalRealisasi = sectionForYear.realisasi.reduce(
    (sum, row) => sum + row.amount,
    0
  );
  const totalDifference = totalRealisasi - totalAnggaran;

  return (
    <main className="min-h-[100svh] bg-gradient-to-b from-blue-50 to-gray-100 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <HeaderCard 
          title="Keuangan" 
          subtitle="Informasi Keuangan Desa"
          backUrl="/masyarakat/home"
          showBackButton={true}
        />

        {/* Analisis Keuangan Card */}
        <div className="mb-4 rounded-2xl bg-white/90 backdrop-blur-sm p-4 shadow-lg ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Analisis Keuangan</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Analisa Realisasi Keuangan</span>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 border border-gray-300">
              <BarChart3 className="w-5 h-5 text-gray-600" />
            </div>
          </div>
        </div>

        {/* APBD Section */}
        <div className="mb-4 rounded-2xl bg-white/90 backdrop-blur-sm p-4 shadow-lg ring-1 ring-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">APBD Desa Tahun {selectedYear}</h2>
              <p className="text-sm text-gray-600">{categoryLabels[activeCategory]}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-600 mb-1">Filter Tahun:</label>
              <select
                className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm focus:border-gray-400 focus:outline-none"
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {(Object.keys(categoryLabels) as FinanceCategory[]).map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-red-300 bg-red-200 text-red-800 shadow"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              );
            })}
          </div>

          {/* Grafik Section */}
          <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h3 className="text-center text-lg font-semibold text-gray-700 mb-4">Grafik</h3>
            <div className="flex items-center justify-center h-32">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">Grafik {datasetLabels[activeDataset]}</p>
                <p className="text-xs text-gray-400">Data akan ditampilkan di sini</p>
              </div>
            </div>
          </div>

          {/* Dataset Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(datasetLabels) as DatasetKey[]).map((dataset) => {
              const isActive = dataset === activeDataset;
              return (
                <button
                  key={dataset}
                  type="button"
                  onClick={() => setActiveDataset(dataset)}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-red-300 bg-red-200 text-red-800 shadow"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {datasetLabels[dataset]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tabel Section */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm p-4 shadow-lg ring-1 ring-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tabel</h3>
            
            {/* Tabel Anggaran */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Tabel Anggaran</h4>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="space-y-2">
                  {sectionForYear.anggaran.map((row, index) => (
                    <div key={`anggaran-${row.label}-${index}`} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-sm text-gray-700">{row.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(row.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabel Realisasi */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Tabel Realisasi</h4>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="space-y-2">
                  {sectionForYear.realisasi.map((row, index) => (
                    <div key={`realisasi-${row.label}-${index}`} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-sm text-gray-700">{row.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{formatCurrency(row.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}