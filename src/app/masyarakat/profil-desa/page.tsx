"use client";

import Link from "next/link";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from '../../components/BottomNavigation';

export default function ProfilDesaPage() {
  const menuItems = [
    {
      id: 1,
      title: "Wilayah Desa",
      icon: "🗺️",
      href: "/masyarakat/profil-desa/wilayah"
    },
    {
      id: 2,
      title: "Sejarah Desa",
      icon: "📚",
      href: "/masyarakat/profil-desa/sejarah"
    },
    {
      id: 3,
      title: "Visi & Misi",
      icon: "🎯",
      href: "/masyarakat/profil-desa/visi-misi"
    },
    {
      id: 4,
      title: "Struktur Pemerintahan",
      icon: "👥",
      href: "/masyarakat/profil-desa/struktur"
    },
    {
      id: 5,
      title: "Lembaga Kemasyarakatan",
      icon: "🏛️",
      href: "/masyarakat/profil-desa/lembaga"
    }
  ];

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Profil Desa" 
          subtitle="Informasi Desa"
          backUrl="/masyarakat/home"
          showBackButton={true}
        />

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center justify-between rounded-2xl border border-gray-300 bg-white p-4 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold">{item.title}</div>
                </div>
              </div>
              <div className="text-gray-400">›</div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}
