"use client";

import Image from "next/image";
import Link from "next/link";
import HeaderCard from "../../components/HeaderCard";
import { useState } from "react";
import BottomNavigation from '../../components/BottomNavigation';

const DesaLogo = "/logo/LOGO_DPKJ.png";
const BgdLogo = "/logo/Logo_BGD.png";

export default function RiwayatMasyarakatPage() {
  const [tab, setTab] = useState<"laporan" | "saved">("laporan");

  return (
    <main className="min-h-[100svh] bg-gradient-to-b from-red-50 to-gray-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-3 sm:px-4 pb-24 sm:pb-28 pt-4">
        <HeaderCard title="Aktivitas" backUrl="/masyarakat/home" showBackButton={false} />

        <div className="mb-4 flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setTab("laporan")}
            className={`flex-1 rounded-full border px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold shadow-sm transition-all ${
              tab === "laporan" ? "bg-sky-100 border-sky-300 text-sky-900" : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            Laporan Saya
          </button>
          <button
            onClick={() => setTab("saved")}
            className={`flex-1 rounded-full border px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold shadow-sm transition-all ${
              tab === "saved" ? "bg-sky-100 border-sky-300 text-sky-900" : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            Disimpan
          </button>
        </div>

        {tab === "laporan" ? (
          <section className="mt-4 grid place-items-center text-center py-8 sm:py-12">
            <div className="mx-auto max-w-[260px] px-4">
              <div className="mb-3 grid place-items-center">
                <div className="h-24 w-24 sm:h-36 sm:w-36 rounded-xl bg-black/10 grid place-items-center text-4xl sm:text-6xl">🧑🏻‍💻</div>
              </div>
              <div className="text-sm sm:text-base font-bold">Kamu belum pernah membuat laporan</div>
              <div className="mt-1 text-xs sm:text-sm text-gray-700">
                Yuk perhatikan sekitar desa kamu dan buat laporan di fitur Pengaduan!
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-2">
            <div className="mb-4 w-32 sm:w-40">
              <div className="relative">
                <select className="w-full appearance-none rounded-full border border-gray-300 bg-white px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm shadow-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200">
                  <option value="all">semua</option>
                  <option value="pengaduan">Pengaduan</option>
                  <option value="enews">E-News</option>
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-2 sm:right-3 grid place-items-center text-xs sm:text-base">▾</span>
              </div>
            </div>

            <div className="grid place-items-center text-center py-8 sm:py-12">
              <div className="mx-auto max-w-[260px] px-4">
                <div className="mb-3 grid place-items-center">
                  <div className="h-24 w-24 sm:h-36 sm:w-36 rounded-xl bg-black/10 grid place-items-center text-4xl sm:text-6xl">📥</div>
                </div>
                <div className="text-sm sm:text-base font-bold">Belum Ada Item yang disimpan</div>
              </div>
            </div>
          </section>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}
