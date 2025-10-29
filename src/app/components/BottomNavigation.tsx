"use client";

import Link from "next/link";

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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-md border-t bg-white/90 px-3 sm:px-4 md:px-6 py-1 sm:py-2 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] backdrop-blur">
      <ul className="grid grid-cols-4 text-center gap-1 text-[10px] sm:text-xs text-gray-700">
        <li>
          <Link href="/masyarakat/home" className="grid place-items-center gap-0.5 sm:gap-1 py-1">
            <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-blue-500 text-white shadow-lg">
              <HomeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="font-medium line-clamp-1">Beranda</span>
          </Link>
        </li>
        <li>
          <Link href="/masyarakat/riwayat" className="grid place-items-center gap-0.5 sm:gap-1 py-1">
            <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-purple-500 text-white shadow-lg">
              <HistoryIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="font-medium line-clamp-1">Riwayat</span>
          </Link>
        </li>
        <li>
          <Link href="/masyarakat/notifikasi" className="grid place-items-center gap-0.5 sm:gap-1 py-1">
            <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-orange-500 text-white shadow-lg">
              <BellIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="font-medium line-clamp-1">Notifikasi</span>
          </Link>
        </li>
        <li>
          <Link href="/masyarakat/profil" className="grid place-items-center gap-0.5 sm:gap-1 py-1">
            <span className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-full bg-green-500 text-white shadow-lg">
              <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="font-medium line-clamp-1">Profil</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}