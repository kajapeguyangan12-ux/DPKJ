"use client";

import Image from "next/image";
import Link from "next/link";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from '../../components/BottomNavigation';

const DesaLogo = "/logo/LOGO_DPKJ.png";
const BgdLogo = "/logo/Logo_BGD.png";

const sample = [
  { id: 1, title: "Judul Notifikasi", date: "07 Apr 2025", desc: "Keterangan" },
  { id: 2, title: "Judul Notifikasi", date: "06 Apr 2025", desc: "Keterangan" },
  { id: 3, title: "Judul Notifikasi", date: "05 Apr 2025", desc: "Keterangan" },
];

export default function NotifikasiMasyarakatPage() {
  return (
    <main className="min-h-[100svh] bg-gradient-to-b from-red-50 to-gray-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-3 sm:px-4 pb-24 sm:pb-28 pt-4">
        <HeaderCard title="Notifikasi" backUrl="/masyarakat/home" showBackButton={false} />

        <ul className="space-y-2 sm:space-y-3">
          {sample.map((n, idx) => (
            <li key={n.id} className={`rounded-2xl border bg-white/95 p-2 sm:p-3 shadow ring-1 ring-black/10 backdrop-blur transition-all ${idx === 0 ? "ring-2 ring-sky-400" : ""}`}>
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="grid h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 place-items-center rounded-lg bg-gray-900 text-white text-lg sm:text-xl">📰</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-xs sm:text-sm line-clamp-2">{n.title}</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">{n.date}</div>
                  <div className="text-xs sm:text-sm text-gray-700 line-clamp-1">{n.desc}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <BottomNavigation />
    </main>
  );
}
