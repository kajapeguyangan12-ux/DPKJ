"use client";

import Image from "next/image";
import Link from "next/link";
import HeaderCard from "../../../components/HeaderCard";
import BottomNavigation from '../../../components/BottomNavigation';

export default function ProfilDetailMasyarakatPage() {
  // Mock user detail; replace with real data
  const detail = [
    { label: "Nama", value: "Nama Lengkap" },
    { label: "No KK", value: "-" },
    { label: "NIK", value: "-" },
    { label: "Alamat", value: "-" },
    { label: "No. Telp", value: "-" },
    { label: "Jenis Kelamin", value: "-" },
    { label: "Pekerjaan", value: "-" },
    { label: "Suku Bangsa", value: "-" },
    { label: "Tempat/Tangga Lahir", value: "-" },
    { label: "Kewarganegaraan", value: "-" },
    { label: "Pendidikan Terakhir", value: "-" },
    { label: "Status Perkawinan", value: "-" },
  ];

  return (
    <main className="min-h-[100svh] bg-merah-putih animate-bg-pan text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard title="Profil" />

        <div className="mb-3">
          <Link href="/masyarakat/profil" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-lg shadow-sm">‹</Link>
        </div>

        <div className="mb-5 grid place-items-center">
          <div className="grid h-28 w-28 place-items-center rounded-full bg-white/90 shadow ring-1 ring-black/10 text-6xl">👤</div>
        </div>

        <section className="space-y-3">
          {detail.map((d, i) => (
            <div key={i} className="rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm">
              <div className="text-sm font-semibold">{d.label}</div>
              <div className="text-sm text-gray-700">{d.value}</div>
            </div>
          ))}
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
