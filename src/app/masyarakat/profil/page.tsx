"use client";

import Image from "next/image";
import Link from "next/link";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from '../../components/BottomNavigation';
const SiGedeLogo = "/logo/LOGO_DPKJ.png";

export default function ProfilMasyarakatPage() {
  // Mock data; replace with real user data later
  const user = {
    nama: "Nama Lengkap",
    nik: "NIK",
    desa: "Dauh Puri Kaja",
    role: "Role",
  };

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Profil" 
          subtitle="Data Pribadi"
          backUrl="/masyarakat/home"
        />



        <section className="mb-6 rounded-2xl border border-black/20 bg-gradient-to-b from-rose-50 to-white p-0 shadow ring-1 ring-black/10 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(120%_100%_at_0%_0%,#ef4444,transparent_60%)]" />
            <div className="flex items-start justify-between gap-2 px-4 pt-3">
              <div className="inline-flex items-center gap-2 text-rose-700 font-bold">
                <Image src={SiGedeLogo} alt="SiGede" width={18} height={18} />
                <span>SiGede</span>
              </div>
              <div className="text-right text-sm">
                <div className="font-semibold">{user.nama}</div>
                <div className="flex items-center justify-end gap-1"><span>{user.desa}</span><span>📍</span></div>
                <div className="text-gray-700">{user.role}</div>
              </div>
            </div>
            <div className="px-4 pb-4 pt-1 text-sm">
              <div className="text-gray-800">{user.nik}</div>
            </div>
            <div className="h-2 w-full bg-gradient-to-r from-rose-700 via-rose-400 to-rose-300" />
          </div>
        </section>

        <section className="grid place-items-center">
          <div className="grid place-items-center">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-white/90 shadow ring-1 ring-black/10 text-6xl">👤</div>
            <Link href="#" className="mt-2 text-sm text-sky-700 hover:underline">Edit</Link>
          </div>

          <div className="mt-6 grid w-full gap-3 px-6">
            <Link href="/masyarakat/profil/detail" className="mx-auto w-40 rounded-full border border-gray-300 bg-gray-200 px-4 py-2 text-center text-sm font-semibold text-gray-800 shadow-sm">Detail</Link>
            <Link href="/masyarakat/profil/edit" className="mx-auto w-40 rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-[inset_0_-2px_0_#0b78c1,0_2px_0_#0b78c133] hover:bg-sky-600 text-center block">Edit Profil</Link>
          </div>

          {/* Logout Section */}
          <div className="mt-8 px-6">
            <button
              onClick={() => {
                // Clear any authentication data if needed
                // For now, just redirect to login page
                window.location.href = '/masyarakat/login';
              }}
              className="mx-auto w-40 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-center text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 hover:border-red-400 transition-colors"
            >
              Logout Akun
            </button>
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
