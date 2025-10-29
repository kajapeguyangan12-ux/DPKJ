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
    <main className="min-h-[100svh] bg-merah-putih animate-bg-pan text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard title="Notifikasi" />

        <ul className="space-y-3">
          {sample.map((n, idx) => (
            <li key={n.id} className={`rounded-2xl border bg-white/95 p-3 shadow ring-1 ring-black/10 backdrop-blur ${idx === 0 ? "ring-2 ring-sky-400" : ""}`}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-gray-900 text-white">📰</div>
                <div>
                  <div className="font-semibold">{n.title}</div>
                  <div className="text-xs text-gray-600">{n.date}</div>
                  <div className="text-sm">{n.desc}</div>
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
