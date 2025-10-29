"use client";

import Link from "next/link";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from '../../components/BottomNavigation';

export default function WisataBudayaPage() {
  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-900">
      <div className="mx-auto w-full max-w-md px-4 pb-24 pt-4">
        {/* Header Card */}
        <HeaderCard 
          title="Wisata & Budaya"
          subtitle="Jelajahi Kekayaan Desa"
          backUrl="/masyarakat/home"
        />

        {/* Main Content Cards */}
        <div className="space-y-4">
          {/* Wisata Card */}
          <Link href="/masyarakat/wisata-budaya/wisata">
            <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-xl hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                    <TourismIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">Wisata</div>
                    <div className="text-sm text-gray-600">Jelajahi destinasi menarik</div>
                  </div>
                </div>
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 ring-1 ring-gray-200 transition-transform group-hover:translate-x-1">
                  <ArrowIcon className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
          </Link>

          {/* Budaya Card */}
          <Link href="/masyarakat/wisata-budaya/budaya">
            <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-200 transition-all hover:shadow-xl hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                    <CultureIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">Budaya</div>
                    <div className="text-sm text-gray-600">Kekayaan tradisi dan adat</div>
                  </div>
                </div>
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 ring-1 ring-gray-200 transition-transform group-hover:translate-x-1">
                  <ArrowIcon className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Info Section */}
        <div className="mt-8 rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-gray-200 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <InfoIllustration className="h-16 w-16 text-gray-600" />
            </div>
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Jelajahi Wisata & Budaya Peguyangan
            </div>
            <div className="text-xs text-gray-600 leading-relaxed">
              Temukan destinasi wisata menarik dan kekayaan budaya yang dimiliki Desa Peguyangan Kaja
            </div>
          </div>
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

function TourismIcon({ className }: IconProps) {
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
      <path d="M12 2L3 7v10c0 5.5 3.8 7.9 9 9 .7.2 1.3.2 2 0 5.2-1.1 9-3.5 9-9V7l-9-5z" />
      <path d="M9 12l2 2 4-4" />
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

function ArrowIcon({ className }: IconProps) {
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
      <path d="M7 17l9.2-9.2M17 17V7H7" />
    </svg>
  );
}



function InfoIllustration({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="32" cy="32" r="24" />
      <path d="M32 16v16" />
      <circle cx="32" cy="40" r="2" />
    </svg>
  );
}
