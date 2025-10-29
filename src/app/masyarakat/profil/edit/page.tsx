"use client";

import BottomNavigation from '../../../components/BottomNavigation';
import Link from "next/link";
import HeaderCard from "../../../components/HeaderCard";

export default function EditProfilMasyarakatPage() {
  return (
    <main className="min-h-[100svh] bg-merah-putih animate-bg-pan text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard title="Pusat Pengaturan" />

        <div className="mb-3">
          <Link href="/masyarakat/profil" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-lg shadow-sm">‹</Link>
        </div>

        {/* Akun Anda Section */}
        <section className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Akun Anda</h2>
          <Link
            href="/masyarakat/profil/edit/akun"
            className="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                👤
              </div>
              <div>
                <div className="text-sm font-semibold">Pengaturan Akun Anda</div>
                <div className="text-xs text-gray-600">Foto Profil, Username, Email, Kata Sandi</div>
              </div>
            </div>
            <div className="text-gray-400">›</div>
          </Link>
        </section>

        {/* Perubahan Data Diri Section */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Perubahan Data Diri</h2>
          <Link
            href="/masyarakat/profil/edit/data-diri"
            className="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                📋
              </div>
              <div>
                <div className="text-sm font-semibold">Data Diri</div>
              </div>
            </div>
            <div className="text-gray-400">›</div>
          </Link>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
