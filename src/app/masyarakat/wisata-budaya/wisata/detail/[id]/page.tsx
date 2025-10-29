"use client";

import { useState, use } from "react";
import Link from "next/link";
import HeaderCard from "../../../../../components/HeaderCard";
import BottomNavigation from '../../../../../components/BottomNavigation';

type TourismDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

type TourismDetail = {
  id: string;
  title: string;
  category: string;
  address: string;
  location: string;
  description: string;
  fullDescription: string;
  image: string;
  rating: number;
  distance: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: string[];
  openHours: string;
  contact: string;
};

const tourismDetails: Record<string, TourismDetail> = {
  "1": {
    id: "1",
    title: "Air Terjun Peguyangan",
    category: "Alam",
    address: "Jl. Air Terjun No. 1, Peguyangan, Kecamatan Denpasar",
    location: "Lokasi Sesuai GPS",
    description: "Air terjun alami dengan pemandangan yang menakjubkan",
    fullDescription: "Air Terjun Peguyangan adalah salah satu destinasi wisata alam terbaik di Bali. Dengan ketinggian sekitar 25 meter, air terjun ini menawarkan pemandangan yang sangat indah dan udara yang segar. Pengunjung dapat berenang di kolam alami yang jernih dan melakukan aktivitas outdoor seperti hiking dan photography.",
    image: "/api/placeholder/400/300",
    rating: 4.8,
    distance: "2.5 km",
    coordinates: { lat: -8.6500, lng: 115.2167 },
    facilities: ["Area Parkir", "Gazebo", "Toilet", "Warung Makan"],
    openHours: "06:00 - 18:00 WITA",
    contact: "+62 812-3456-7890"
  },
  "2": {
    id: "2",
    title: "Pura Peguyangan",
    category: "Religi",
    address: "Jl. Pura Peguyangan, Desa Peguyangan, Kecamatan Denpasar",
    location: "Lokasi Sesuai GPS",
    description: "Pura bersejarah dengan arsitektur tradisional Bali",
    fullDescription: "Pura Peguyangan merupakan pura bersejarah yang dibangun pada abad ke-15. Dengan arsitektur tradisional Bali yang khas, pura ini menjadi tempat ibadah umat Hindu sekaligus destinasi wisata budaya. Pengunjung dapat melihat langsung upacara keagamaan dan mempelajari filosofi Tri Hita Karana.",
    image: "/api/placeholder/400/300",
    rating: 4.9,
    distance: "1.2 km",
    coordinates: { lat: -8.6600, lng: 115.2267 },
    facilities: ["Area Parkir", "Pura", "Toilet", "Tempat Istirahat"],
    openHours: "07:00 - 17:00 WITA",
    contact: "+62 811-2345-6789"
  },
  "3": {
    id: "3",
    title: "Warung Makan Lokal",
    category: "Kuliner",
    address: "Jl. Raya Peguyangan No. 45",
    location: "Lokasi Sesuai GPS",
    description: "Kuliner khas Bali dengan cita rasa autentik",
    fullDescription: "Warung makan ini menyajikan berbagai hidangan tradisional Bali dengan cita rasa autentik yang telah diwariskan turun-temurun. Menu andalan seperti babi guling, ayam betutu, dan lawar menjadi favorit para pengunjung. Dengan harga terjangkau dan pelayanan yang ramah, warung ini menjadi destinasi kuliner wajib dikunjungi.",
    image: "/api/placeholder/400/300",
    rating: 4.6,
    distance: "800 m",
    coordinates: { lat: -8.6700, lng: 115.2367 },
    facilities: ["Area Parkir", "Tempat Duduk", "Toilet", "WiFi"],
    openHours: "08:00 - 22:00 WITA",
    contact: "+62 813-5678-9012"
  },
  "4": {
    id: "4",
    title: "Galeri Seni Peguyangan",
    category: "Budaya",
    address: "Jl. Seni Budaya No. 12",
    location: "Lokasi Sesuai GPS",
    description: "Koleksi seni dan kerajinan tangan lokal",
    fullDescription: "Galeri seni ini memamerkan berbagai karya seni dan kerajinan tangan hasil karya seniman lokal Peguyangan. Pengunjung dapat melihat proses pembuatan kerajinan tradisional Bali seperti ukiran kayu, anyaman bambu, dan lukisan tradisional. Galeri ini juga menyediakan workshop untuk belajar membuat kerajinan tangan.",
    image: "/api/placeholder/400/300",
    rating: 4.7,
    distance: "1.8 km",
    coordinates: { lat: -8.6800, lng: 115.2467 },
    facilities: ["Area Parkir", "Galeri", "Workshop", "Toko Souvenir"],
    openHours: "09:00 - 16:00 WITA",
    contact: "+62 814-6789-0123"
  }
};

export default function WisataDetailPage({ params }: TourismDetailProps) {
  const [activeTab, setActiveTab] = useState<"info" | "location" | "review">("info");
  const resolvedParams = use(params);
  const tourismDetail = tourismDetails[resolvedParams.id];

  if (!tourismDetail) {
    return (
      <main className="min-h-[100svh] bg-red-50 text-gray-900">
        <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
          <div className="text-center py-12">
            <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-red-200 backdrop-blur-sm">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-lg font-semibold text-gray-700 mb-2">Wisata tidak ditemukan</div>
              <div className="text-sm text-gray-600 mb-4">Data wisata yang Anda cari tidak tersedia</div>
              <Link
                href="/masyarakat/wisata-budaya/wisata"
                className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition"
              >
                Kembali ke Wisata
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-900">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        {/* Header Card */}
        <HeaderCard 
          title="Detail Wisata"
          subtitle={tourismDetail.title}
          backUrl="/masyarakat/wisata-budaya/wisata"
        />

        {/* Main Image Section */}
        <div className="mb-6 rounded-3xl bg-white/95 shadow-lg ring-1 ring-red-100 overflow-hidden">
          <div className="relative h-64 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
            <div className="text-center text-red-600">
              <ImageIcon className="mx-auto h-20 w-20 mb-3 opacity-50" />
              <div className="text-lg font-medium">Foto</div>
              <div className="text-sm text-red-500 mt-1">{tourismDetail.title}</div>
            </div>
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                ⭐ {tourismDetail.rating}
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {tourismDetail.distance}
              </div>
            </div>
          </div>
        </div>

        {/* Tourism Name Section */}
        <div className="mb-4">
          <div className="rounded-2xl bg-white/95 shadow-lg ring-1 ring-red-100 p-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-2">Nama Wisata</div>
              <div className="text-lg font-semibold text-red-600">{tourismDetail.title}</div>
              <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
                {tourismDetail.category}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <div className="rounded-2xl bg-white/95 shadow-lg ring-1 ring-red-100 p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-3">Deskripsi Wisata</div>
              <div className="text-sm text-gray-700 leading-relaxed text-left">
                {tourismDetail.fullDescription}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4 flex rounded-2xl bg-white/95 shadow-lg ring-1 ring-red-100 p-1">
          {[
            { id: "info", label: "Informasi", icon: <InfoIcon className="h-4 w-4" /> },
            { id: "location", label: "Lokasi", icon: <LocationIcon className="h-4 w-4" /> },
            { id: "review", label: "Ulasan", icon: <StarIcon className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-red-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-red-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-6">
          {activeTab === "info" && (
            <div className="rounded-2xl bg-white/95 shadow-lg ring-1 ring-red-100 p-4">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Alamat Lengkap</div>
                  <div className="text-sm text-gray-600 flex items-start gap-2">
                    <LocationIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    {tourismDetail.address}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Jam Operasional</div>
                  <div className="text-sm text-gray-600 flex items-start gap-2">
                    <ClockIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    {tourismDetail.openHours}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Fasilitas</div>
                  <div className="flex flex-wrap gap-2">
                    {tourismDetail.facilities.map((facility, index) => (
                      <div key={index} className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                        {facility}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Kontak</div>
                  <div className="text-sm text-gray-600 flex items-start gap-2">
                    <PhoneIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    {tourismDetail.contact}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "location" && (
            <div className="rounded-2xl bg-white/95 shadow-lg ring-1 ring-red-100 p-4">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Koordinat GPS</div>
                  <div className="text-sm text-gray-600">
                    Lat: {tourismDetail.coordinates.lat}, Lng: {tourismDetail.coordinates.lng}
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-red-100 to-red-200 p-8 text-center">
                  <MapIcon className="mx-auto h-16 w-16 text-red-600 mb-2" />
                  <div className="text-sm font-medium text-gray-700">Peta Lokasi</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "review" && (
            <div className="rounded-2xl bg-white/95 shadow-lg ring-1 ring-red-100 p-4">
              <div className="text-center py-8">
                <StarIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <div className="text-sm font-semibold text-gray-700 mb-1">Belum ada ulasan</div>
                <div className="text-xs text-gray-600">Jadilah yang pertama memberikan ulasan</div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-red-500 text-white py-4 px-6 rounded-2xl text-lg font-semibold shadow-lg hover:bg-red-600 transition">
            Kunjungi Sekarang
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/90 text-red-600 py-3 px-4 rounded-xl text-sm font-medium shadow-lg ring-1 ring-red-200 hover:bg-white hover:shadow-xl transition flex items-center justify-center gap-2">
              <ShareIcon className="h-4 w-4" />
              Bagikan
            </button>
            <button className="bg-white/90 text-red-600 py-3 px-4 rounded-xl text-sm font-medium shadow-lg ring-1 ring-red-200 hover:bg-white hover:shadow-xl transition flex items-center justify-center gap-2">
              <HeartIcon className="h-4 w-4" />
              Favorit
            </button>
          </div>

          {/* Google Maps Button */}
          <button className="w-full bg-green-500 text-white py-3 px-4 rounded-xl text-sm font-medium shadow-lg hover:bg-green-600 transition flex items-center justify-center gap-2">
            <MapPinIcon className="h-4 w-4" />
            Buka di Google Maps
          </button>
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

function InfoIcon({ className }: IconProps) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
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

function StarIcon({ className }: IconProps) {
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
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ClockIcon({ className }: IconProps) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PhoneIcon({ className }: IconProps) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

function MapPinIcon({ className }: IconProps) {
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

function ShareIcon({ className }: IconProps) {
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function HeartIcon({ className }: IconProps) {
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
