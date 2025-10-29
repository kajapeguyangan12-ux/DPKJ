"use client";

import BottomNavigation from '../../../../components/BottomNavigation';
import Link from "next/link";
import HeaderCard from "../../../../components/HeaderCard";

export default function DataDiriPage() {
  return (
    <main className="min-h-[100svh] bg-merah-putih animate-bg-pan text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard title="Data Diri" />

        <div className="mb-3">
          <Link href="/masyarakat/profil/edit" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-lg shadow-sm">‹</Link>
        </div>

        {/* Data Diri Kependudukan */}
        <section className="mb-3">
          <Link
            href="/masyarakat/profil/edit/data-diri/kependudukan"
            className="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                🏛️
              </div>
              <div>
                <div className="text-sm font-semibold">Data Diri Kependudukan</div>
              </div>
            </div>
            <div className="text-gray-400">›</div>
          </Link>
        </section>

        {/* Lokasi Tinggal */}
        <section className="mb-3">
          <Link
            href="/masyarakat/profil/edit/data-diri/lokasi"
            className="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                📍
              </div>
              <div>
                <div className="text-sm font-semibold">Lokasi Tinggal</div>
              </div>
            </div>
            <div className="text-gray-400">›</div>
          </Link>
        </section>

        {/* Kontak */}
        <section>
          <Link
            href="/masyarakat/profil/edit/data-diri/kontak"
            className="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                📞
              </div>
              <div>
                <div className="text-sm font-semibold">Kontak</div>
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
