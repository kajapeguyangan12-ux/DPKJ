"use client";

import { useState } from "react";
import BottomNavigation from '../../components/BottomNavigation';
import Image from "next/image";
import Link from "next/link";
import HeaderCard from "../../components/HeaderCard";

const DesaLogo = "/logo/Lambang_Desa_Peguyangan_Kaja.png";
const BgdLogo = "/logo/Logo_BGD.png";

type FilterType = "All" | "Infrastruktur" | "Keamanan" | "Lingkungan" | "Pelayanan" | "Lainnya";
type SortType = "Terbaru" | "Terlama" | "Status" | "Prioritas";

type ComplaintItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  status: "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
  description: string;
  image: string;
  priority: "Rendah" | "Sedang" | "Tinggi";
  location: string;
};

const complaintData: ComplaintItem[] = [
  {
    id: "1",
    title: "Jalan Berlubang di Gang Mawar",
    category: "Infrastruktur",
    date: "15 Nov 2025",
    status: "Diproses",
    description: "Jalan berlubang parah mengganggu akses kendaraan warga",
    image: "/api/placeholder/200/150",
    priority: "Tinggi",
    location: "Gang Mawar RT 02/RW 01"
  },
  {
    id: "2",
    title: "Lampu Jalan Mati",
    category: "Infrastruktur",
    date: "14 Nov 2025",
    status: "Menunggu",
    description: "Lampu jalan di depan rumah tidak menyala selama 3 hari",
    image: "/api/placeholder/200/150",
    priority: "Sedang",
    location: "Jl. Peguyangan Kaja No. 25"
  },
  {
    id: "3",
    title: "Sampah Menumpuk",
    category: "Lingkungan",
    date: "13 Nov 2025",
    status: "Selesai",
    description: "Tumpukan sampah di pinggir jalan belum diangkut",
    image: "/api/placeholder/200/150",
    priority: "Sedang",
    location: "Jl. Raya Peguyangan"
  },
  {
    id: "4",
    title: "Pelayanan Administrasi Lambat",
    category: "Pelayanan",
    date: "12 Nov 2025",
    status: "Ditolak",
    description: "Antrian pelayanan di kantor desa terlalu lama",
    image: "/api/placeholder/200/150",
    priority: "Rendah",
    location: "Kantor Desa Peguyangan"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Menunggu": return "bg-yellow-100 text-yellow-700";
    case "Diproses": return "bg-blue-100 text-blue-700";
    case "Selesai": return "bg-green-100 text-green-700";
    case "Ditolak": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-700";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Rendah": return "bg-gray-100 text-gray-600";
    case "Sedang": return "bg-orange-100 text-orange-600";
    case "Tinggi": return "bg-red-100 text-red-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

export default function PengaduanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [activeSort, setActiveSort] = useState<SortType>("Terbaru");

  const filteredData = complaintData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || item.category === activeFilter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (activeSort) {
      case "Terbaru": return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "Terlama": return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "Status": return a.status.localeCompare(b.status);
      case "Prioritas": return b.priority.localeCompare(a.priority);
      default: return 0;
    }
  });

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-900">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        {/* Header Card */}
        <HeaderCard 
          title="Pengaduan"
          subtitle="Layanan Aspirasi Masyarakat"
          backUrl="/masyarakat/home"
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

        {/* Filter and Sort Controls */}
        <div className="mb-6 flex gap-2">
          <select
            className="flex-1 px-4 py-2 rounded-2xl border border-red-100 bg-white/95 shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as FilterType)}
          >
            <option value="All">Kategori</option>
            <option value="Infrastruktur">Infrastruktur</option>
            <option value="Keamanan">Keamanan</option>
            <option value="Lingkungan">Lingkungan</option>
            <option value="Pelayanan">Pelayanan</option>
            <option value="Lainnya">Lainnya</option>
          </select>

          <select
            className="flex-1 px-4 py-2 rounded-2xl border border-red-100 bg-white/95 shadow-sm ring-1 ring-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as SortType)}
          >
            <option value="Terbaru">Urutkan</option>
            <option value="Terbaru">Terbaru</option>
            <option value="Terlama">Terlama</option>
            <option value="Status">Status</option>
            <option value="Prioritas">Prioritas</option>
          </select>
        </div>

        {/* Latest Reports Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Data Laporan Terbaru</h3>

          <div className="space-y-4">
            {filteredData.map((item) => (
              <div key={item.id} className="group">
                <div className="rounded-3xl bg-white/95 shadow-lg ring-1 ring-red-100 overflow-hidden transition-all hover:shadow-xl hover:scale-[1.02]">
                  {/* Image Section */}
                  <div className="relative h-32 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                    <div className="text-center text-red-600">
                      <ImageIcon className="mx-auto h-8 w-8 mb-1 opacity-50" />
                      <div className="text-xs font-medium">Foto</div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                          {item.category}
                        </div>
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-red-500" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <LocationIcon className="h-4 w-4 text-red-500" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </div>
                      <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-red-200 backdrop-blur-sm">
              <SearchIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <div className="text-lg font-semibold text-gray-700 mb-2">Tidak ada laporan ditemukan</div>
              <div className="text-sm text-gray-600">Coba ubah kata kunci pencarian atau filter</div>
            </div>
          </div>
        )}

        {/* Create Report Button */}
        <div className="fixed bottom-20 right-4 z-50">
          <Link href="/masyarakat/pengaduan/buat">
            <button className="bg-green-500 text-white py-3 px-4 rounded-2xl text-sm font-bold shadow-lg hover:bg-green-600 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95">
              <PlusIcon className="h-4 w-4" />
              Buat Laporan
            </button>
          </Link>
        </div>
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

function ImageIcon({ className }: IconProps) {
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
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
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
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
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

function PlusIcon({ className }: IconProps) {
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
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
