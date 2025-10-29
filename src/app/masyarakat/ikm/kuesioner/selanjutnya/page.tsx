'use client';

import React, { useState, useEffect } from 'react';
import BottomNavigation from '../../../../components/BottomNavigation';
import HeaderCard from '../../../../components/HeaderCard';

export default function KuesionerSelanjutnyaPage() {
  const [selectedService, setSelectedService] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.service-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const services = [
    'Surat Keterangan Menikah',
    'Beda Nama',
    'Surat Keterangan Berpergian',
    'Surat Keterangan Kematian',
    'Surat Keterangan Ahli Waris',
    'Surat Pindah',
    'Tanda Lapor Diri (STLD)',
    'Keterangan Domisili (Non Permanen)',
    'Keterangan Pensiunan',
    'Keterangan Belum Kawin',
    'Keterangan Izin Keramaian',
    'Keterangan Lahir',
    'Pernyataan yang perlu di TTD mengetahui perbekel',
    'Pengantar KIS',
    'Pengantar KIP',
    'Keterangan Kurang Mampu',
    'Keterangan Kelakuan Baik',
    'Keterangan Belum Bekerja',
    'Pengajuan Penghasilan',
    'Pengajuan Santunan Kematian',
    'SKDWNI',
    'Surat Ijin Usaha',
    'Pengantar Surat Nikah',
    'Keterangan Masuk Sekolah',
    'Pembuatan Akta dan KK',
    'Perbarui KK',
    'Lainnya'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Selected service:', selectedService);
  };

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">

      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Indeks Kepuasan Masyarakat" 
          subtitle="Survey Kepuasan"
          backUrl="/masyarakat/ikm/kuesioner"
          showBackButton={true}
        />

        {/* Form Section */}
        <section className="mb-6 relative z-10">
          <div className="rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-red-200 backdrop-blur-sm overflow-visible relative z-20">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Survey kepuasan masyarakat...
              </h2>
              <div className="w-full h-1 bg-gradient-to-r from-red-200 via-red-300 to-red-200 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Jenis Layanan</label>
                <div className="relative z-30 service-dropdown">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-left flex items-center justify-between relative z-30"
                  >
                    <span className={selectedService ? 'text-gray-900' : 'text-gray-500'}>
                      {selectedService || 'Pilih layanan...'}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
                      {services.map((service) => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => {
                            setSelectedService(service);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-red-500 hover:text-white transition-colors cursor-pointer ${
                            selectedService === service ? 'bg-red-500 text-white' : 'text-gray-900'
                          } first:rounded-t-xl last:rounded-b-xl border-none outline-none`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Questionnaire Data Box */}
              <div className="bg-white rounded-2xl p-4 shadow-lg ring-1 ring-red-100 mb-6">
                <div className="text-center">
                  <div className="w-full h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-xl mb-2 flex items-center justify-center shadow-inner">
                    <span className="text-red-600 text-lg font-bold">Data Kuesioner</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 justify-center">
                <a href="/masyarakat/ikm/kuesioner" className="block">
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200"
                  >
                    Sebelumnya
                  </button>
                </a>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      {/* Navigation Bar */}
      <BottomNavigation />
    </main>
  );
}
