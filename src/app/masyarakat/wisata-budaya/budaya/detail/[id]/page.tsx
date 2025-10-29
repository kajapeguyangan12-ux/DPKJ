"use client";

import { useState, use } from "react";
import Link from "next/link";
import HeaderCard from "../../../../../components/HeaderCard";
import BottomNavigation from '../../../../../components/BottomNavigation';

type CultureDetailProps = {
  params: Promise<{
    id: string;
  }>;
};

type CultureDetail = {
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
  schedule: string;
  requirements: string[];
  contact: string;
  history: string;
};

const cultureDetails: Record<string, CultureDetail> = {
  "1": {
    id: "1",
    title: "Seni Tari Tradisional",
    category: "Seni",
    address: "Jl. Budaya No. 1, Peguyangan, Kecamatan Denpasar",
    location: "Lokasi Sesuai GPS",
    description: "Pertunjukan tari tradisional Bali yang memukau",
    fullDescription: "Seni tari tradisional Peguyangan merupakan warisan budaya yang telah diwariskan turun-temurun selama berabad-abad. Tarian ini menggabungkan gerakan yang anggun dengan musik tradisional Bali seperti gamelan. Para penari mengenakan kostum tradisional yang indah dan menggunakan properti seperti kipas dan selendang untuk memperkaya ekspresi tarian.",
    image: "/api/placeholder/400/300",
    rating: 4.9,
    distance: "1.5 km",
    coordinates: { lat: -8.6400, lng: 115.2067 },
    schedule: "Setiap hari Sabtu, 19:00 - 21:00 WITA",
    requirements: ["Pakaian sopan", "Tidak makan/minum di area pertunjukan", "Dilarang merekam tanpa izin"],
    contact: "+62 811-2345-6789",
    history: "Tarian ini pertama kali dipentaskan pada upacara adat tahun 1950 dan telah menjadi bagian penting dari identitas budaya desa Peguyangan."
  },
  "2": {
    id: "2",
    title: "Upacara Melasti",
    category: "Upacara",
    address: "Pantai Peguyangan, Desa Peguyangan, Kecamatan Denpasar",
    location: "Lokasi Sesuai GPS",
    description: "Upacara pembersihan diri umat Hindu Bali",
    fullDescription: "Upacara Melasti adalah ritual suci umat Hindu Bali untuk menyucikan diri dan alam semesta. Dilakukan di pantai dengan membawa pratima (simbol dewa) untuk dimandikan di laut. Upacara ini biasanya dilakukan menjelang hari raya besar seperti Nyepi atau Galungan. Prosesi diiringi dengan doa, mantra, dan persembahan yang sakral.",
    image: "/api/placeholder/400/300",
    rating: 4.8,
    distance: "2.1 km",
    coordinates: { lat: -8.6500, lng: 115.2167 },
    schedule: "Setiap Purnama, 06:00 - 09:00 WITA",
    requirements: ["Berpakaian adat Bali", "Berpartisipasi dalam doa", "Menjaga kekhidmatan"],
    contact: "+62 812-3456-7890",
    history: "Tradisi Melasti telah dilakukan sejak zaman kerajaan Bali kuno dan merupakan bagian dari filosofi Tri Hita Karana untuk menjaga harmoni antara manusia, alam, dan Tuhan."
  },
  "3": {
    id: "3",
    title: "Museum Sejarah Peguyangan",
    category: "Sejarah",
    address: "Jl. Sejarah No. 8, Peguyangan, Kecamatan Denpasar",
    location: "Lokasi Sesuai GPS",
    description: "Koleksi artefak dan peninggalan sejarah desa",
    fullDescription: "Museum Sejarah Peguyangan menyimpan berbagai artefak bersejarah yang menceritakan perjalanan panjang desa ini. Koleksi meliputi prasasti kuno, alat pertanian tradisional, pakaian adat, dan foto-foto bersejarah. Museum ini menjadi pusat pendidikan tentang sejarah dan perkembangan Desa Peguyangan dari masa ke masa.",
    image: "/api/placeholder/400/300",
    rating: 4.7,
    distance: "900 m",
    coordinates: { lat: -8.6600, lng: 115.2267 },
    schedule: "Selasa - Minggu, 09:00 - 16:00 WITA",
    requirements: ["Tidak makan/minum", "Tidak menyentuh artefak", "Mengikuti tur guide"],
    contact: "+62 813-5678-9012",
    history: "Museum didirikan tahun 1995 untuk melestarikan warisan budaya dan sejarah desa Peguyangan yang telah berusia lebih dari 500 tahun."
  },
  "4": {
    id: "4",
    title: "Workshop Kerajinan Bambu",
    category: "Kerajinan",
    address: "Jl. Kerajinan No. 15, Peguyangan, Kecamatan Denpasar",
    location: "Lokasi Sesuai GPS",
    description: "Belajar membuat kerajinan tangan dari bambu",
    fullDescription: "Workshop ini memberikan kesempatan untuk belajar membuat berbagai kerajinan tangan dari bambu, mulai dari anyaman sederhana hingga ukiran yang kompleks. Peserta akan didampingi oleh pengrajin lokal yang berpengalaman dan dapat membawa pulang hasil karya mereka sendiri. Workshop ini juga berfungsi sebagai upaya pelestarian kerajinan tradisional Bali.",
    image: "/api/placeholder/400/300",
    rating: 4.6,
    distance: "1.3 km",
    coordinates: { lat: -8.6700, lng: 115.2367 },
    schedule: "Setiap hari, 10:00 - 15:00 WITA",
    requirements: ["Registrasi terlebih dahulu", "Menggunakan alat pelindung", "Membayar biaya workshop"],
    contact: "+62 814-6789-0123",
    history: "Kerajinan bambu telah menjadi mata pencaharian masyarakat Peguyangan sejak abad ke-18 dan terus dilestarikan hingga saat ini."
  }
};

export default function BudayaDetailPage({ params }: CultureDetailProps) {
  const [activeTab, setActiveTab] = useState<"info" | "location" | "history">("info");
  const resolvedParams = use(params);
  const cultureDetail = cultureDetails[resolvedParams.id];

  if (!cultureDetail) {
    return (
      <main className="min-h-[100svh] bg-red-50 text-gray-900">
        <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
          <div className="text-center py-12">
            <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-red-200 backdrop-blur-sm">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-lg font-semibold text-gray-700 mb-2">Budaya tidak ditemukan</div>
              <div className="text-sm text-gray-600 mb-4">Data budaya yang Anda cari tidak tersedia</div>
              <Link
                href="/masyarakat/wisata-budaya/budaya"
                className="inline-flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition"
              >
                Kembali ke Budaya
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
          title="Detail Budaya"
          subtitle={cultureDetail.title}
          backUrl="/masyarakat/wisata-budaya/budaya"
        />

        {/* Main Image Section */}
        <div className="mb-6 rounded-3xl bg-white/95 shadow-lg ring-1 ring-red-100 overflow-hidden">
          <div className="relative h-64 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
            <div className="text-center text-red-600">
              <CultureIcon className="mx-auto h-20 w-20 mb-3 opacity-50" />
              <div className="text-lg font-medium">Foto</div>
              <div className="text-sm text-red-500 mt-1">{cultureDetail.title}</div>
            </div>
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                ⭐ {cultureDetail.rating}
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {cultureDetail.distance}
              </div>
            </div>
          </div>
        </div>

        {/* Culture Name Section */}
        <div className="mb-4">
          <div className="rounded-2xl bg-white/95 shadow-lg ring-1 ring-red-100 p-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900 mb-2">Nama Kegiatan Budaya</div>
              <div className="text-lg font-semibold text-red-600">{cultureDetail.title}</div>
              <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
                {cultureDetail.category}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <div className="rounded-2xl bg-white/95 shadow-lg ring-1 ring-red-100 p-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 mb-3">Deskripsi Kegiatan</div>
              <div className="text-sm text-gray-700 leading-relaxed text-left">
                {cultureDetail.fullDescription}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4 flex rounded-2xl bg-white/95 shadow-lg ring-1 ring-red-100 p-1">
          {[
            { id: "info", label: "Informasi", icon: <InfoIcon className="h-4 w-4" /> },
            { id: "location", label: "Lokasi", icon: <LocationIcon className="h-4 w-4" /> },
            { id: "history", label: "Sejarah", icon: <HistoryIcon className="h-4 w-4" /> }
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
                    {cultureDetail.address}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Jadwal Kegiatan</div>
                  <div className="text-sm text-gray-600 flex items-start gap-2">
                    <ClockIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    {cultureDetail.schedule}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">Persyaratan</div>
                  <div className="space-y-2">
                    {cultureDetail.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-600">{requirement}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">Kontak</div>
                  <div className="text-sm text-gray-600 flex items-start gap-2">
                    <PhoneIcon className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    {cultureDetail.contact}
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
                    Lat: {cultureDetail.coordinates.lat}, Lng: {cultureDetail.coordinates.lng}
                  </div>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-red-100 to-red-200 p-8 text-center">
                  <MapIcon className="mx-auto h-16 w-16 text-red-600 mb-2" />
                  <div className="text-sm font-medium text-gray-700">Peta Lokasi</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="rounded-2xl bg-white/95 shadow-lg ring-1 ring-red-100 p-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 mb-3">Sejarah & Asal-usul</div>
                <div className="text-sm text-gray-700 leading-relaxed text-left">
                  {cultureDetail.history}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-red-500 text-white py-4 px-6 rounded-2xl text-lg font-semibold shadow-lg hover:bg-red-600 transition">
            Ikuti Kegiatan
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/90 text-red-600 py-3 px-4 rounded-xl text-sm font-medium shadow-lg ring-1 ring-red-200 hover:bg-white hover:shadow-xl transition flex items-center justify-center gap-2">
              <ShareIcon className="h-4 w-4" />
              Bagikan
            </button>
            <button className="bg-white/90 text-red-600 py-3 px-4 rounded-xl text-sm font-medium shadow-lg ring-1 ring-red-200 hover:bg-white hover:shadow-xl transition flex items-center justify-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Jadwalkan
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

function CheckIcon({ className }: IconProps) {
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
      <polyline points="20 6 9 17 4 12" />
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
