'use client';

import BottomNavigation from '../../../components/BottomNavigation';
import React from 'react';

export default function VoucherSayaPage() {
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
              <div className="text-base font-bold text-gray-900">Voucher Saya</div>
              <div className="text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-red-200 backdrop-blur-sm text-center">
            {/* Voucher Illustration */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <svg className="w-32 h-32" viewBox="0 0 128 128" fill="none">
                  {/* Voucher Background */}
                  <rect x="20" y="40" width="88" height="48" rx="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2"/>
                  {/* Dotted Line */}
                  <line x1="64" y1="40" x2="64" y2="88" stroke="#D97706" strokeWidth="2" strokeDasharray="4,4"/>
                  {/* Gift Icon */}
                  <rect x="48" y="52" width="32" height="24" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1"/>
                  <rect x="52" y="48" width="24" height="4" fill="#EF4444"/>
                  <rect x="52" y="76" width="24" height="4" fill="#EF4444"/>
                  <line x1="56" y1="48" x2="56" y2="80" stroke="#DC2626" strokeWidth="2"/>
                  <line x1="72" y1="48" x2="72" y2="80" stroke="#DC2626" strokeWidth="2"/>
                  <line x1="52" y1="56" x2="76" y2="56" stroke="#DC2626" strokeWidth="2"/>
                  <line x1="52" y1="68" x2="76" y2="68" stroke="#DC2626" strokeWidth="2"/>
                  {/* Bow */}
                  <path d="M40 64 L64 52 L64 76 Z" fill="#EF4444"/>
                  <path d="M88 64 L64 52 L64 76 Z" fill="#EF4444"/>
                  {/* Text Lines */}
                  <line x1="24" y1="96" x2="104" y2="96" stroke="#D97706" strokeWidth="2"/>
                  <line x1="24" y1="100" x2="104" y2="100" stroke="#D97706" strokeWidth="2"/>
                  <line x1="24" y1="104" x2="104" y2="104" stroke="#D97706" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            {/* Voucher Details */}
            <div className="mb-8 bg-white rounded-2xl p-4 shadow-lg ring-1 ring-red-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Nama voucher</h3>
                <span className="text-gray-500 text-sm">kode voucher</span>
              </div>
              <div className="w-full h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-xl mb-3 flex items-center justify-center shadow-inner">
                <span className="text-red-600 text-sm font-medium">Foto Voucher</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">deskripsi</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-sm">view</span>
                  </button>
                  <button className="flex items-center space-x-1 text-red-600 hover:text-red-800">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-sm">hapus</span>
                  </button>
                </div>
                <span className="text-gray-500 text-sm">Tanggal exp</span>
              </div>
            </div>

            {/* Empty State Message */}
            <div className="text-center py-4">
              <p className="text-gray-500 text-base">
                Belum ada voucher yang tersedia
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Navigation Bar */}
      <BottomNavigation />
    </main>
  );
}
