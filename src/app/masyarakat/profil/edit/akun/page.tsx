"use client";

import BottomNavigation from '../../../../components/BottomNavigation';
import Link from "next/link";
import HeaderCard from "../../../../components/HeaderCard";

export default function PengaturanAkunPage() {
  return (
    <main className="min-h-[100svh] bg-merah-putih animate-bg-pan text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard title="Pengaturan Akun" />

        <div className="mb-3">
          <Link href="/masyarakat/profil/edit" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-lg shadow-sm">‹</Link>
        </div>

        {/* Ubah Foto Profil */}
        <section className="mb-3">
          <Link
            href="/masyarakat/profil/edit/akun/foto-profil"
            className="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                📷
              </div>
              <div>
                <div className="text-sm font-semibold">Ubah Foto Profil</div>
              </div>
            </div>
            <div className="text-gray-400">›</div>
          </Link>
        </section>

        {/* Ubah Email */}
        <section className="mb-3">
          <Link
            href="/masyarakat/profil/edit/akun/email"
            className="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                ✉️
              </div>
              <div>
                <div className="text-sm font-semibold">Ubah Email</div>
              </div>
            </div>
            <div className="text-gray-400">›</div>
          </Link>
        </section>

        {/* Ubah Kata Sandi */}
        <section>
          <Link
            href="/masyarakat/profil/edit/akun/kata-sandi"
            className="flex items-center justify-between rounded-xl border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                🔒
              </div>
              <div>
                <div className="text-sm font-semibold">Ubah Kata Sandi</div>
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
