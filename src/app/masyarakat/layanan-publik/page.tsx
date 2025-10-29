"use client";

import { useMemo, useState } from "react";
import type { JSX } from "react";
import Link from "next/link";
import HeaderCard from "@/app/components/HeaderCard";
import BottomNavigation from "@/app/components/BottomNavigation";

type ServiceItem = {
  title: string;
  icon: JSX.Element;
  category: string;
};

const services: ServiceItem[] = [
  {
    title: "Surat Kelakuan Baik",
    icon: <ConductIcon className="h-12 w-12 text-red-600" />,
    category: "Administrasi Umum",
  },
  {
    title: "Surat Keterangan Belum Nikah/Kawin",
    icon: <SingleStatusIcon className="h-12 w-12 text-red-600" />,
    category: "Kependudukan",
  },
  {
    title: "Surat Keterangan Belum Bekerja",
    icon: <EmploymentIcon className="h-12 w-12 text-red-600" />,
    category: "Ketenagakerjaan",
  },
  {
    title: "Surat Keterangan Kawin/Menikah",
    icon: <MarriageIcon className="h-12 w-12 text-red-600" />,
    category: "Kependudukan",
  },
  {
    title: "Surat Keterangan Kematian",
    icon: <CertificateIcon className="h-12 w-12 text-red-600" />,
    category: "Kependudukan",
  },
  {
    title: "Surat Keterangan Perjalanan",
    icon: <TravelIcon className="h-12 w-12 text-red-600" />,
    category: "Perizinan",
  },
  {
    title: "Pelayanan Taring Dukcapil",
    icon: <CommunityIcon className="h-12 w-12 text-red-600" />,
    category: "Kependudukan",
  },
];

const categories = [
  "Semua",
  ...Array.from(new Set(services.map((service) => service.category))),
];

export default function LayananPublikPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    return services.filter((service) => {
      const matchCategory =
        selectedCategory === "Semua" || service.category === selectedCategory;
      const matchQuery =
        normalizedQuery.length === 0 ||
        service.title.toLowerCase().includes(normalizedQuery);

      return matchCategory && matchQuery;
    });
  }, [query, selectedCategory]);

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-900">
      {isFilterOpen ? (
        <button
          type="button"
          aria-label="Tutup menu filter"
          className="fixed inset-0 z-10 cursor-default bg-red-500/10"
          onClick={() => setIsFilterOpen(false)}
        />
      ) : null}
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        <HeaderCard 
          title="Layanan Publik" 
          subtitle="Administrasi & Perizinan"
          backUrl="/masyarakat/home"
        />

        <section className="mb-6 space-y-4">
          <div className="relative flex items-center gap-3">
            <label className="flex flex-1 items-center gap-3 rounded-full border border-red-100 bg-white/95 px-4 py-2 shadow-sm ring-1 ring-red-200">
              <SearchIcon className="h-5 w-5 text-red-500" />
              <span className="sr-only">Cari layanan</span>
              <input
                type="search"
                className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                placeholder="Cari layanan"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-red-100 bg-white/95 px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-red-200 transition hover:bg-red-50"
                onClick={() => setIsFilterOpen((prev) => !prev)}
                aria-expanded={isFilterOpen}
                aria-haspopup="true"
              >
                <span>
                  {selectedCategory === "Semua" ? "Filter" : selectedCategory}
                </span>
                <FilterIcon className="h-4 w-4 text-red-500" />
              </button>
              {isFilterOpen ? (
                <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-2xl border border-red-100 bg-white/95 p-2 text-left text-sm shadow-xl ring-1 ring-red-200">
                  <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-red-500">
                    Kategori
                  </p>
                  <ul className="space-y-1">
                    {categories.map((category) => {
                      const isActive = selectedCategory === category;
                      return (
                        <li key={category}>
                          <button
                            type="button"
                            className={`w-full rounded-xl px-3 py-2 text-left transition ${
                              isActive
                                ? "bg-red-100 font-semibold text-red-700"
                                : "text-gray-700 hover:bg-red-50"
                            }`}
                            onClick={() => {
                              setSelectedCategory(category);
                              setIsFilterOpen(false);
                            }}
                          >
                            {category}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-red-100 bg-white/95 px-4 py-4 shadow ring-1 ring-red-200">
            <p className="text-sm font-semibold text-red-700">Penting!</p>
            <p className="text-xs leading-relaxed text-gray-600">
              Untuk layanan pemohon dapat menyiapkan berkas sesuai persyaratan
              dan mengajukan permohonan langsung melalui sistem desa.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {filteredServices.map((service) => (
                <Link
                  key={service.title}
                  href={
                    service.title === "Surat Kelakuan Baik"
                      ? "/masyarakat/layanan-publik/surat-kelakuan-baik"
                      : service.title === "Surat Keterangan Belum Nikah/Kawin"
                      ? "/masyarakat/layanan-publik/surat-keterangan-belum-nikah"
                      : service.title === "Surat Keterangan Belum Bekerja"
                      ? "/masyarakat/layanan-publik/surat-keterangan-belum-bekerja"
                      : service.title === "Surat Keterangan Kawin/Menikah"
                      ? "/masyarakat/layanan-publik/surat-keterangan-kawin-menikah"
                      : service.title === "Surat Keterangan Kematian"
                      ? "/masyarakat/layanan-publik/surat-keterangan-kematian"
                      : service.title === "Surat Keterangan Perjalanan"
                      ? "/masyarakat/layanan-publik/surat-keterangan-perjalanan"
                      : service.title === "Pelayanan Taring Dukcapil"
                      ? "/masyarakat/layanan-publik/pelayanan-taring-dukcapil"
                      : "#" // For other services, you can add their respective routes
                  }
                  className="group relative flex h-full flex-col items-center justify-between gap-4 overflow-hidden rounded-3xl border border-red-100 bg-gradient-to-br from-white to-red-50/30 px-4 py-6 text-center shadow-md ring-1 ring-red-200/50 transition duration-300 hover:border-red-200 hover:shadow-lg hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                  <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-red-100 to-red-50 transition duration-300 group-hover:from-red-200 group-hover:to-red-100">
                    {service.icon}
                  </div>
                  <span className="relative text-sm font-semibold leading-snug text-gray-800 transition duration-300 group-hover:text-red-700">
                    {service.title}
                  </span>
                  <span className="relative text-[11px] font-medium uppercase tracking-wide text-red-400/80 transition duration-300 group-hover:text-red-500">
                    {service.category}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-red-200 bg-white/80 px-6 py-10 text-center text-sm text-gray-600">
              <p className="font-semibold text-red-600">Tidak ditemukan</p>
              <p className="mt-1">
                Silakan ubah kata kunci pencarian atau pilih kategori lain.
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

function FilterIcon({ className }: IconProps) {
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
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </svg>
  );
}

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

function ConductIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M9 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm7.5-9c1.11 0 2-0.9 2-2s-0.89-2-2-2-2 0.9-2 2 0.89 2 2 2zm0 1.5c-1.66 0-5 0.83-5 2.5V13h10v-1.5c0-1.67-3.34-2.5-5-2.5z" />
    </svg>
  );
}

function SingleStatusIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M12 14c-3.31 0-6 1.79-6 4v2h12v-2c0-2.21-2.69-4-6-4z" />
      <path d="M19.5 10c0.83 0 1.5-0.67 1.5-1.5S20.33 7 19.5 7 18 7.67 18 8.5s0.67 1.5 1.5 1.5z" />
      <path d="M19.5 11c-1.38 0-2.5 0.74-2.5 1.66v1.34h5v-1.34c0-0.92-1.12-1.66-2.5-1.66z" />
    </svg>
  );
}

function EmploymentIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="9" cy="8" r="2.5" />
      <path d="M5 19h8v-3c0-1.66-1.34-3-3-3s-3 1.34-3 3v3z" />
      <rect x="11" y="10" width="9" height="9" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 13h3M14 16h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MarriageIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="8" r="2.5" />
      <path d="M4 19h4v-3c0-1.33 0.89-2.45 2.1-2.8M16 19h4v-3c0-1.33-0.89-2.45-2.1-2.8M12 12c-1.1 0-2 0.9-2 2v1h4v-1c0-1.1-0.9-2-2-2z" />
      <line x1="6" y1="15" x2="18" y2="15" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CertificateIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19 3H5c-1.1 0-2 0.9-2 2v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V5c0-1.1-0.9-2-2-2zm-5 9.5c-1.1 0-2-0.9-2-2s0.9-2 2-2 2 0.9 2 2-0.9 2-2 2zm5 2.5H5v-2h14v2z" />
    </svg>
  );
}

function TravelIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M17.92 7.02C17.45 4.18 14.97 2 12 2c-2.97 0-5.45 2.18-5.92 5.02C4.97 7.55 3 9.75 3 12.5C3 16.04 5.96 19 9.5 19h8c3.04 0 5.5-2.46 5.5-5.5C21 9.75 19.03 7.55 17.92 7.02zM15 10h-4v3H8l4 4 4-4h-3z" />
    </svg>
  );
}

function CommunityIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-0.29 0-0.62 0.02-0.97 0.05 1.16 0.84 1.97 1.97 1.97 3.25V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
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
