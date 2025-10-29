"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from '../../components/BottomNavigation';

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
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Keuangan" 
          subtitle="APB Desa"
          backUrl="/masyarakat/home"
        />

        <section className="rounded-3xl border border-gray-300 bg-gray-100/80 p-4 shadow-lg backdrop-blur">
          <div className="flex items-start justify-between gap-3 rounded-2xl border border-gray-300 bg-white/90 p-4 shadow-inner">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Analisis Keuangan
              </p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white shadow">
                <span>Analisa Realisasi Keuangan</span>
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-gray-900 shadow-inner">
                  *
                </span>
              </div>
        </div>
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-gray-300 bg-white">
          [=]
        </div>
      </div>

          <div className="mt-4 rounded-2xl border border-gray-300 bg-white/90 p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  APBD Desa Tahun {selectedYear}
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {categoryLabels[activeCategory]}
                </p>
              </div>
              <label className="flex w-fit flex-col text-xs font-semibold text-gray-600">
                Filter Tahun
                <select
                  className="mt-1 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm focus:border-gray-400 focus:outline-none"
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(Number(event.target.value))}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-xl bg-gray-900/90 p-3 text-white shadow">
                <p className="text-[10px] uppercase tracking-wide text-gray-200/70">
                  Total Anggaran
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatCurrency(totalAnggaran)}
                </p>
              </div>
              <div className="rounded-xl bg-white p-3 text-gray-900 shadow-sm ring-1 ring-gray-200">
                <p className="text-[10px] uppercase tracking-wide text-gray-500">
                  Total Realisasi
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {formatCurrency(totalRealisasi)}
                </p>
              </div>
              <div className="rounded-xl bg-white p-3 text-gray-900 shadow-sm ring-1 ring-gray-200">
                <p className="text-[10px] uppercase tracking-wide text-gray-500">
                  Selisih
                </p>
                <p
                  className="mt-1 text-sm font-semibold"
                  aria-live="polite"
                >
                  {formatCurrency(totalDifference)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {(Object.keys(categoryLabels) as FinanceCategory[]).map((category) => {
              const isActive = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-gray-900 bg-gray-900 text-white shadow"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-dashed border-gray-400 bg-white p-4 shadow-inner">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Grafik {datasetLabels[activeDataset]}
              </p>
              <span className="text-[11px] text-gray-500">
                Nilai dalam Rupiah
              </span>
            </div>
            <div className="mt-3 space-y-3">
              {chartRows.map((row) => {
                const widthPercent =
                  maxChartValue === 0
                    ? 0
                    : Math.max(
                        8,
                        Math.round((Math.abs(row.amount) / maxChartValue) * 100)
                      );

                const barColor =
                  activeDataset === "realisasi"
                    ? "bg-emerald-500"
                    : activeDataset === "lebihKurang"
                    ? row.amount >= 0
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                    : "bg-rose-500";

                return (
                  <div key={`${row.label}-${activeDataset}`}>
                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                      <span className="pr-2">{row.label}</span>
                      <span>{formatCurrency(row.amount)}</span>
                    </div>
                    <div className="mt-1 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-full ${barColor}`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {chartRows.length === 0 && (
                <div className="grid h-24 place-items-center rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-500">
                  Data tidak tersedia untuk kombinasi ini.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {(Object.keys(datasetLabels) as DatasetKey[]).map((dataset) => {
              const isActive = dataset === activeDataset;
              return (
                <button
                  key={dataset}
                  type="button"
                  onClick={() => setActiveDataset(dataset)}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-gray-900 bg-gray-900 text-white shadow"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {datasetLabels[dataset]}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-5 space-y-4">
          <div className="rounded-3xl border border-gray-300 bg-white p-4 shadow">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Tabel Anggaran
              </h2>
              <span className="text-xs text-gray-500">
                {formatCurrency(totalAnggaran)}
              </span>
            </div>
            <table className="w-full border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="rounded-l-xl bg-gray-100 px-3 py-2">
                    Komponen
                  </th>
                  <th className="rounded-r-xl bg-gray-100 px-3 py-2 text-right">
                    Nilai
                  </th>
                </tr>
              </thead>
              <tbody>
                {sectionForYear.anggaran.map((row) => (
                  <tr key={`anggaran-${row.label}`}>
                    <td className="rounded-l-xl bg-gray-50 px-3 py-2 text-gray-700">
                      {row.label}
                    </td>
                    <td className="rounded-r-xl bg-gray-50 px-3 py-2 text-right font-semibold text-gray-900">
                      {formatCurrency(row.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-3xl border border-gray-300 bg-white p-4 shadow">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">
                Tabel Realisasi
              </h2>
              <span className="text-xs text-gray-500">
                {formatCurrency(totalRealisasi)}
              </span>
            </div>
            <table className="w-full border-separate border-spacing-y-2 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                  <th className="rounded-l-xl bg-gray-100 px-3 py-2">
                    Komponen
                  </th>
                  <th className="rounded-r-xl bg-gray-100 px-3 py-2 text-right">
                    Nilai
                  </th>
                </tr>
              </thead>
              <tbody>
                {sectionForYear.realisasi.map((row) => (
                  <tr key={`realisasi-${row.label}`}>
                    <td className="rounded-l-xl bg-gray-50 px-3 py-2 text-gray-700">
                      {row.label}
                    </td>
                    <td className="rounded-r-xl bg-gray-50 px-3 py-2 text-right font-semibold text-gray-900">
                      {formatCurrency(row.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Ringkasan Selisih</p>
              <p className="mt-1 text-xs">
                Realisasi {totalDifference >= 0 ? "lebih" : "kurang"}{" "}
                {formatCurrency(Math.abs(totalDifference))} dibandingkan
                anggaran pada tahun {selectedYear}.
              </p>
              <ul className="mt-3 space-y-1 text-xs text-gray-600">
                {differenceRows.map((row) => (
                  <li key={`diff-${row.label}`} className="flex justify-between">
                    <span>{row.label}</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(row.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
