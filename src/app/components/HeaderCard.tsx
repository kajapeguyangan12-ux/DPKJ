"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  title?: string;
  backUrl?: string;
  subtitle?: string;
};

const DesaLogo = "/logo/LOGO_DPKJ.png";

// Custom arrow left icon component
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export default function HeaderCard({ title = "Beranda", backUrl = "/masyarakat/home", subtitle }: Props) {
  return (
    <div className="mb-6 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200/50 backdrop-blur-xl">
      <div className="relative">
        {/* Enhanced Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-red-600 to-red-700 opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-white/10"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)`
        }}></div>

        <div className="relative z-10 flex items-center justify-between px-6 py-4">
          {/* Left Section - Always Back Button */}
          <Link 
            href={backUrl} 
            className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:scale-105 active:scale-95"
          >
            <ArrowLeftIcon className="h-5 w-5 text-white transition-transform group-hover:-translate-x-0.5" />
          </Link>

          {/* Center Section - Title & Subtitle */}
          <div className="text-center">
            <h1 className="text-lg font-bold text-white tracking-wide">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-white/80 font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Section - DPKJ Logo */}
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white/95 backdrop-blur-sm shadow-sm ring-1 ring-white/20">
            <Image
              src={DesaLogo}
              alt="Dauh Puri Kaja"
              width={32}
              height={32}
              className="object-contain"
              priority
              onError={(e) => {
                console.log('DPKJ Logo failed to load');
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
    </div>
  );
}
