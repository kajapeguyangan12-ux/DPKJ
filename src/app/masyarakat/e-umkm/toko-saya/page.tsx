'use client';

import BottomNavigation from '../../../components/BottomNavigation';
import React from 'react';

export default function TokoSayaPage() {
  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        {/* Header Card */}
        <div className="mb-4 rounded-2xl border border-black/10 bg-white/70 shadow-lg ring-1 ring-black/5 backdrop-blur">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 -z-10 opacity-50 [background:radial-gradient(120%_100%_at_0%_0%,#ef4444,transparent_60%)]" />
            <div className="flex items-center justify-between px-4 py-2">
              <a href="/masyarakat/e-umkm" className="text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              <div className="text-base font-bold text-gray-900">Toko Saya</div>
              <div className="text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-red-200 backdrop-blur-sm text-center">
            {/* Store Illustration */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none">
                  {/* Store Building */}
                  <rect x="24" y="60" width="80" height="50" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                  {/* Roof */}
                  <path d="M20 60 L64 20 L108 60" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
                  {/* Awning */}
                  <rect x="20" y="60" width="88" height="8" rx="4" fill="#EF4444"/>
                  <rect x="20" y="62" width="88" height="2" fill="#DC2626"/>
                  <rect x="20" y="64" width="88" height="2" fill="#DC2626"/>
                  <rect x="20" y="66" width="88" height="2" fill="#DC2626"/>
                  {/* Windows */}
                  <rect x="32" y="70" width="20" height="20" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1"/>
                  <rect x="76" y="70" width="20" height="20" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1"/>
                  {/* Door */}
                  <rect x="56" y="80" width="16" height="30" rx="2" fill="#6B7280" stroke="#374151" strokeWidth="1"/>
                  {/* Door Handle */}
                  <circle cx="68" cy="95" r="1.5" fill="#374151"/>
                  {/* Sign */}
                  <rect x="40" y="45" width="48" height="12" rx="2" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1"/>
                  <text x="64" y="53" textAnchor="middle" fontSize="6" fill="#D97706" fontWeight="bold">TOKO</text>
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <p className="text-gray-600 text-base leading-relaxed">
                Anda belum memiliki toko. Ayo daftarkan toko anda disini
              </p>
            </div>

            {/* Register Button */}
            <button className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-3 px-6 rounded-full transition-colors duration-200 flex items-center space-x-2 mx-auto border border-red-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Daftarkan Toko</span>
            </button>
          </div>
        </section>
      </div>

      {/* Navigation Bar */}
      <BottomNavigation />
    </main>
  );
}
