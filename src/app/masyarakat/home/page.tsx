"use client";

import type { JSX } from "react";
import Link from "next/link";
import { useCurrentUser } from "../lib/useCurrentUser";
import BottomNavigation from '../../components/BottomNavigation';
import {
  Newspaper,
  Building2,
  FileText,
  DollarSign,
  Database,
  Users,
  Star,
  Mountain,
  MessageSquare,
  ShoppingBag,
  Building,
  TrendingUp,
  Camera,
  Gift,
  Map,
  Landmark,
  BookOpen,
  UserCheck,
  Clipboard,
  Bell,
  Store,
} from "lucide-react";
import HeaderCard from "../../components/HeaderCard";

const DesaLogo = "/logo/LOGO_DPKJ.png";

type MenuItem = {
  title: string;
  href: string;
  icon: JSX.Element;
  gradient: string;
};

const allMenuItems: MenuItem[] = [
  {
    title: "E-News",
    href: "/masyarakat/e-news",
    gradient: "from-blue-500 to-blue-600",
    icon: (
      <div className="relative">
        <Newspaper className="h-5 w-5" />
        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-white rounded-full"></div>
      </div>
    ),
  },
  {
    title: "Profil Desa",
    href: "/masyarakat/profil-desa",
    gradient: "from-emerald-500 to-emerald-600",
    icon: (
      <div className="relative">
        <Landmark className="h-5 w-5" />
        <Building2 className="h-3 w-3 absolute -bottom-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Regulasi",
    href: "/masyarakat/regulasi",
    gradient: "from-purple-500 to-purple-600",
    icon: (
      <div className="relative">
        <BookOpen className="h-5 w-5" />
        <FileText className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Keuangan",
    href: "/masyarakat/keuangan",
    gradient: "from-green-500 to-green-600",
    icon: (
      <div className="relative">
        <DollarSign className="h-5 w-5" />
        <TrendingUp className="h-2.5 w-2.5 absolute -bottom-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Data Desa",
    href: "/masyarakat/profil-desa",
    gradient: "from-indigo-500 to-indigo-600",
    icon: (
      <div className="relative">
        <Database className="h-5 w-5" />
        <Map className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Layanan Publik",
    href: "/masyarakat/layanan-publik",
    gradient: "from-cyan-500 to-cyan-600",
    icon: (
      <div className="relative">
        <UserCheck className="h-5 w-5" />
        <Users className="h-2.5 w-2.5 absolute -bottom-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "IKM",
    href: "/masyarakat/ikm",
    gradient: "from-orange-500 to-orange-600",
    icon: (
      <div className="relative">
        <Clipboard className="h-5 w-5" />
        <Star className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Wisata & Budaya",
    href: "/masyarakat/wisata-budaya",
    gradient: "from-pink-500 to-pink-600",
    icon: (
      <div className="relative">
        <Mountain className="h-5 w-5" />
        <Camera className="h-2.5 w-2.5 absolute -bottom-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Pengaduan",
    href: "/masyarakat/pengaduan",
    gradient: "from-red-500 to-red-600",
    icon: (
      <div className="relative">
        <MessageSquare className="h-5 w-5" />
        <Bell className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "E-UMKM",
    href: "/masyarakat/e-umkm",
    gradient: "from-amber-500 to-amber-600",
    icon: (
      <div className="relative">
        <Store className="h-5 w-5" />
        <ShoppingBag className="h-2.5 w-2.5 absolute -bottom-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
];

export default function HomeMasyarakatMobile() {
  const { user } = useCurrentUser();
  let menuItems: MenuItem[] = allMenuItems;
  if (user?.role === "warga_luar") {
    menuItems = allMenuItems.filter(
      (item) => item.title === "E-Toko" || item.title === "Wisata & Budaya"
    );
  }
  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        {/* Header Card */}
        <HeaderCard 
          title="Beranda"
          subtitle="Sistem Informasi Desa"
          backUrl="/masyarakat/home"
        />

        {/* Welcome Section */}
        <section className="mb-6 rounded-3xl bg-gradient-to-r from-slate-600 to-slate-700 p-6 text-white shadow-xl">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <div className="mb-2 text-sm opacity-90">Ucapan Selamat Datang</div>
              <div className="flex h-20 w-52 items-center justify-center rounded-xl bg-white/20 text-sm font-medium backdrop-blur-sm">
                Foto Kepala Desa
              </div>
            </div>
            <div className="text-center">
              <div className="mb-2 flex justify-center">
                <div className="relative">
                  <Landmark className="h-16 w-16 text-white/90" />
                  <Building2 className="h-6 w-6 absolute -bottom-1 -right-1 text-white bg-slate-600 rounded-full p-1" />
                </div>
              </div>
              <div className="flex justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-white/80" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </section>

        {/* Services Card */}
        <section className="mb-8">
          <div className="rounded-3xl bg-white/95 p-6 shadow-xl ring-1 ring-gray-200 backdrop-blur-sm">
            <div className="grid grid-cols-5 gap-3 text-center text-xs">
              {menuItems.map((item) => (
                <Link key={item.title} href={item.href} className="group">
                  <div className="flex flex-col items-center">
                    <div
                      className={`mb-3 grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br ${item.gradient} text-xl text-white shadow-xl ring-2 ring-white/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-white/40 group-active:scale-95`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-center font-bold leading-tight text-gray-800 text-[10px]">
                      {item.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="mb-6">
          <h3 className="mb-4 text-lg font-bold text-blue-800">Berita Terbaru</h3>
          <div className="rounded-3xl bg-white/90 p-4 shadow-xl ring-1 ring-blue-200 backdrop-blur-sm">
            <div className="mb-4 text-center text-sm font-semibold text-blue-700">
              Foto Berita Terbaru
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 p-12 text-center shadow-inner">
              <div className="relative mx-auto">
                <Newspaper className="h-16 w-16 text-blue-600" />
                <Camera className="h-6 w-6 absolute -bottom-1 -right-1 text-blue-700 bg-blue-200 rounded-full p-1" />
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="flex justify-center gap-2">
                <span className="h-3 w-3 rounded-full bg-blue-600 shadow-sm" />
                <span className="h-3 w-3 rounded-full bg-blue-300" />
                <span className="h-3 w-3 rounded-full bg-blue-300" />
              </div>
            </div>
          </div>
        </section>

        {/* News Link Section */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 p-4 shadow-xl ring-1 ring-blue-200 backdrop-blur-sm">
            <div className="mb-4 text-center text-sm font-semibold text-blue-700">
              Link Yang Menuju Berita
            </div>
            <div className="h-3 w-full rounded-full bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 shadow-inner" />
          </div>
        </section>

        {/* UKM Data Section */}
        <section className="mb-6">
          <h3 className="mb-4 text-lg font-bold text-amber-800">Data UKM</h3>
          <div className="rounded-3xl bg-white/90 p-4 shadow-xl ring-1 ring-amber-200 backdrop-blur-sm">
            <div className="mb-4 text-center text-sm font-semibold text-amber-700">
              Produk
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 p-12 text-center shadow-inner">
              <div className="relative mx-auto">
                <Store className="h-16 w-16 text-amber-600" />
                <ShoppingBag className="h-6 w-6 absolute -bottom-1 -right-1 text-amber-700 bg-amber-200 rounded-full p-1" />
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="flex justify-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-600 shadow-sm" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}


