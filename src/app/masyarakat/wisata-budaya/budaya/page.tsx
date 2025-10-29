"use client";

import { useState } from "react";
import Link from "next/link";
import HeaderCard from "../../../components/HeaderCard";
import BottomNavigation from '../../../components/BottomNavigation';

type FilterType = "All" | "Seni" | "Upacara" | "Sejarah" | "Kerajinan";

type CultureItem = {
  id: string;
  title: string;
  category: string;
  address: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  distance: string;
};

const cultureData: CultureItem[] = [
  {
    id: "1",
    title: "Seni Tari Tradisional",
    category: "Seni",
    address: "Jl. Budaya No. 1, Peguyangan",
    location: "Lokasi Sesuai GPS",
    description: "Pertunjukan tari tradisional Bali yang memukau",
    image: "/api/placeholder/300/200",
    rating: 4.9,
    distance: "1.5 km"
  },
  {
    id: "2",
    title: "Upacara Melasti",
    category: "Upacara",
    address: "Pantai Peguyangan, Desa Peguyangan",
    location: "Lokasi Sesuai GPS",
    description: "Upacara pembersihan diri umat Hindu Bali",
    image: "/api/placeholder/300/200",
    rating: 4.8,
    distance: "2.1 km"
  },
  {
    id: "3",
    title: "Museum Sejarah Peguyangan",
    category: "Sejarah",
    address: "Jl. Sejarah No. 8, Peguyangan",
    location: "Lokasi Sesuai GPS",
    description: "Koleksi artefak dan peninggalan sejarah desa",
    image: "/api/placeholder/300/200",
    rating: 4.7,
    distance: "900 m"
  },
  {
    id: "4",
    title: "Workshop Kerajinan Bambu",
    category: "Kerajinan",
    address: "Jl. Kerajinan No. 15, Peguyangan",
    location: "Lokasi Sesuai GPS",
    description: "Belajar membuat kerajinan tangan dari bambu",
    image: "/api/placeholder/300/200",
    rating: 4.6,
    distance: "1.3 km"
  }
];

export default function BudayaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filteredData = cultureData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-900">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        {/* Header Card */}
        <HeaderCard 
          title="Budaya"
          subtitle="Warisan Tradisional"
          backUrl="/masyarakat/wisata-budaya"
        />

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-12 pr-4 py-3 rounded-2xl border border-red-100 bg-white/95 shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {(["All", "Seni", "Upacara", "Sejarah", "Kerajinan"] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-white/80 text-gray-700 ring-1 ring-red-200 hover:bg-white hover:shadow-md"
              }`}
            >
              {filter}
            </button>
          ))}
          <button className="px-3 py-2 rounded-full bg-white/80 text-gray-700 ring-1 ring-red-200 hover:bg-white hover:shadow-md">
            <FilterIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Culture Listings */}
        <div className="space-y-4">
          {filteredData.map((item) => (
            <div key={item.id} className="group">
              <div className="rounded-3xl bg-white/95 shadow-lg ring-1 ring-red-100 overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]">
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <div className="text-center text-red-600">
                    <CultureIcon className="mx-auto h-16 w-16 mb-2 opacity-50" />
                    <div className="text-sm font-medium">Foto</div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
                      ⭐ {item.rating}
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {item.distance}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                    <div className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                      {item.category}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <LocationIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-600">{item.address}</div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-600">{item.location}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl text-sm font-medium hover:bg-red-600 transition">
                      Ikuti Acara
                    </button>
                    <Link href={`/masyarakat/wisata-budaya/budaya/detail/${item.id}`} className="bg-gray-100 text-gray-700 py-2 px-4 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                      Detail
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-red-200 backdrop-blur-sm">
              <SearchIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <div className="text-lg font-semibold text-gray-700 mb-2">Tidak ada hasil ditemukan</div>
              <div className="text-sm text-gray-600">Coba ubah kata kunci pencarian atau filter</div>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {filteredData.length > 0 && (
          <div className="mt-6 text-center">
            <button className="bg-white/90 text-red-600 py-3 px-6 rounded-2xl text-sm font-medium shadow-lg ring-1 ring-red-200 hover:bg-white hover:shadow-xl transition">
              Muat Lebih Banyak
            </button>
          </div>
        )}
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
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 11v9h14v-9" />
      <path d="M10 20v-6h4v6" />
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
      strokeWidth={1.7}
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
      strokeWidth={1.7}
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

function SearchIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}



function CultureIcon({ className }: IconProps) {
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
      <path d="M12 3 5 9h14z" />
      <path d="M6 9v9h12V9" />
      <path d="M9 18v3h6v-3" />
    </svg>
  );
}

function LocationIcon({ className }: IconProps) {
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
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function MapIcon({ className }: IconProps) {
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
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}
