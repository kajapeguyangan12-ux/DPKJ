"use client";

import { useState } from "react";
import type { JSX } from "react";
import BottomNavigation from '../../../components/BottomNavigation';
import HeaderCard from '../../../components/HeaderCard';
import Link from "next/link";
import Image from "next/image";

const DesaLogo = "/logo/LOGO_DPKJ.png";
const BgdLogo = "/logo/Logo_BGD.png";

type DukcapilService = {
  title: string;
  icon: JSX.Element;
  description: string;
};

const dukcapilServices: DukcapilService[] = [
  {
    title: "Paket Akta Lahir",
    icon: <BirthIcon className="h-12 w-12 text-red-600" />,
    description: "Pembuatan akta kelahiran",
  },
  {
    title: "Paket Akta Perkawinan",
    icon: <MarriageIcon className="h-12 w-12 text-red-600" />,
    description: "Pembuatan akta perkawinan",
  },
  {
    title: "Paket Akta Perceraian",
    icon: <DivorceIcon className="h-12 w-12 text-red-600" />,
    description: "Pembuatan akta perceraian",
  },
  {
    title: "Paket Akta Kematian",
    icon: <DeathIcon className="h-12 w-12 text-red-600" />,
    description: "Pembuatan akta kematian",
  },
  {
    title: "Kartu Keluarga",
    icon: <FamilyCardIcon className="h-12 w-12 text-red-600" />,
    description: "Pembuatan kartu keluarga",
  },
  {
    title: "Surat Pindah Domisili",
    icon: <MovingIcon className="h-12 w-12 text-red-600" />,
    description: "Surat pindah domisili",
  },
  {
    title: "Akta/Surat Lainnya",
    icon: <DocumentIcon className="h-12 w-12 text-red-600" />,
    description: "Akta atau surat lainnya",
  },
  {
    title: "KTP Elektronik Denpasar",
    icon: <KtpIcon className="h-12 w-12 text-red-600" />,
    description: "KTP Elektronik Denpasar",
  },
  {
    title: "Kartu Identitas Anak",
    icon: <ChildIdIcon className="h-12 w-12 text-red-600" />,
    description: "Kartu identitas anak",
  },
];

export default function PelayananTaringDukcapilPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = dukcapilServices.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-900">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        {/* Header */}
        <HeaderCard title="Pelayanan Taring Dukcapil" backUrl="/masyarakat/layanan-publik" />

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-full border border-red-100 bg-white/95 px-4 py-3 pl-10 text-sm shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
          </div>
        </div>

        {/* Services Grid */}
        <section className="space-y-4">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredServices.map((service) => (
                <Link
                  key={service.title}
                  href={
                    service.title === "Paket Akta Lahir"
                      ? "/masyarakat/layanan-publik/paket-akta-lahir"
                      : service.title === "Paket Akta Perkawinan"
                      ? "/masyarakat/layanan-publik/paket-akta-perkawinan"
                      : service.title === "Paket Akta Perceraian"
                      ? "/masyarakat/layanan-publik/paket-akta-perceraian"
                      : service.title === "Paket Akta Kematian"
                      ? "/masyarakat/layanan-publik/paket-akta-kematian"
                      : service.title === "Kartu Keluarga"
                      ? "/masyarakat/layanan-publik/kartu-keluarga"
                      : service.title === "Surat Pindah Domisili"
                      ? "/masyarakat/layanan-publik/surat-pindah-domisili"
                      : service.title === "Akta/Surat Lainnya"
                      ? "/masyarakat/layanan-publik/akta-surat-lainnya"
                      : service.title === "KTP Elektronik Denpasar"
                      ? "/masyarakat/layanan-publik/ktp-elektronik-denpasar"
                      : service.title === "Kartu Identitas Anak"
                      ? "/masyarakat/layanan-publik/kartu-identitas-anak"
                      : "#"
                  }
                  className="flex h-full flex-col items-center justify-between gap-3 rounded-3xl border border-red-100 bg-white/95 px-4 py-6 text-center shadow-lg ring-1 ring-red-200 transition hover:-translate-y-[1px] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                >
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-red-50">
                    {service.icon}
                  </div>
                  <div>
                    <span className="text-sm font-semibold leading-snug text-gray-800">
                      {service.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-red-200 bg-white/80 px-6 py-10 text-center text-sm text-gray-600">
              <p className="font-semibold text-red-600">Tidak ditemukan</p>
              <p className="mt-1">
                Silakan ubah kata kunci pencarian.
              </p>
            </div>
          )}
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}

type IconProps = {
  className?: string;
};

function HomeIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 12.5v8.5h13v-8.5" />
      <path d="M9.5 21v-6h5v6" />
    </svg>
  );
}

function HistoryIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v6h6" />
      <path d="M21 12a9 9 0 1 0-3.27 6.92" />
      <path d="M12 7v5l3 1.5" />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c2-4 6-6 8-6s6 2 8 6" />
    </svg>
  );
}

function DocumentIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  );
}

function BackIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.65" y1="16.65" x2="21" y2="21" />
    </svg>
  );
}

function BirthIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M24 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" />
      <path d="M16 32c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4" />
      <path d="M20 20c1.1-1.1 2.6-1.8 4.2-1.8s3.1.7 4.2 1.8" />
      <path d="M12 40c2.2-4.4 6.6-7.4 11.4-7.4s9.2 3 11.4 7.4" />
    </svg>
  );
}

function MarriageIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="16" cy="14" r="6" />
      <circle cx="32" cy="14" r="6" />
      <path d="M6 36c1.5-6 6-10 10-10s8.5 4 10 10" />
      <path d="M22 36c1.5-6 6-10 10-10s8.5 4 10 10" />
      <path d="M24 20l3 3 3-3" />
    </svg>
  );
}

function DivorceIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="16" cy="14" r="6" />
      <circle cx="32" cy="14" r="6" />
      <path d="M6 36c1.5-6 6-10 10-10s8.5 4 10 10" />
      <path d="M22 36c1.5-6 6-10 10-10s8.5 4 10 10" />
      <path d="M24 20l-3-3-3 3" />
      <path d="M30 20l-3-3-3 3" />
    </svg>
  );
}

function DeathIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="24" cy="14" r="6" />
      <path d="M14 36c1.5-6 6-10 10-10s8.5 4 10 10" />
      <path d="M18 26c2-2.5 6-2.5 8 0" />
      <path d="M20 40c2.2-4.4 6.6-7.4 11.4-7.4s9.2 3 11.4 7.4" />
    </svg>
  );
}

function FamilyCardIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="8" y="12" width="32" height="24" rx="2" />
      <path d="M14 18h4" />
      <path d="M14 22h8" />
      <path d="M14 26h6" />
      <path d="M26 18h8" />
      <path d="M26 22h8" />
      <path d="M26 26h6" />
      <circle cx="16" cy="32" r="2" />
      <circle cx="24" cy="32" r="2" />
      <circle cx="32" cy="32" r="2" />
    </svg>
  );
}

function MovingIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="20" cy="10" r="5" />
      <path d="M12 44l4-10" />
      <path d="M28 44l-3-8-5-14" />
      <path d="M18 20l12 4 6 10" />
      <path d="M32 42h8" />
      <path d="M8 36h32" />
    </svg>
  );
}

function KtpIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="12" y="8" width="24" height="32" rx="4" />
      <path d="M20 14h8" />
      <path d="M18 20h12" />
      <path d="M18 26h12" />
      <path d="M18 32h6" />
      <circle cx="32" cy="24" r="4" />
      <path d="M28 28l3 3 6-6" />
    </svg>
  );
}

function ChildIdIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="24" cy="16" r="8" />
      <path d="M14 38c1.5-6 6-10 10-10s8.5 4 10 10" />
      <path d="M20 22c2-2.5 6-2.5 8 0" />
      <rect x="8" y="32" width="32" height="8" rx="2" />
      <circle cx="16" cy="36" r="1" />
      <circle cx="32" cy="36" r="1" />
    </svg>
  );
}
