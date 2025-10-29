'use client';

import React, { useState, useEffect } from 'react';
import BottomNavigation from '../../components/BottomNavigation';
import Image from 'next/image';
import HeaderCard from '../../components/HeaderCard';

export default function IKMPage() {
  // Generate dynamic years (2 years back + current year only, no future years)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11
  
  const years = [
    (currentYear - 2).toString(),
    (currentYear - 1).toString(),
    currentYear.toString()
  ];

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState(monthNames[currentMonth]);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  // Update current date/time periodically for realtime behavior
  useEffect(() => {
    const updateCurrentDateTime = () => {
      const now = new Date();
      const nowYear = now.getFullYear().toString();
      const nowMonth = monthNames[now.getMonth()];
      
      // Only update if user hasn't manually selected different values
      if (selectedYear === currentYear.toString()) {
        setSelectedYear(nowYear);
      }
      if (selectedMonth === monthNames[currentMonth]) {
        setSelectedMonth(nowMonth);
      }
    };

    // Update every minute to keep it realtime
    const interval = setInterval(updateCurrentDateTime, 60000);
    
    return () => clearInterval(interval);
  }, [selectedYear, selectedMonth, currentYear, currentMonth, monthNames]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setIsYearDropdownOpen(false);
        setIsMonthDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const months = monthNames;

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">

      <div className="mx-auto w-full max-w-md px-4 pb-32 pt-4">
        <HeaderCard 
          title="Indeks Kepuasan Masyarakat" 
          subtitle="IKM Desa Peguyangan"
          backUrl="/masyarakat/home"
          showBackButton={true}
        />

        {/* Filter Section */}
        <section className="mb-12 relative z-10">
          <div className="rounded-3xl bg-white/90 p-4 shadow-xl ring-1 ring-red-200 backdrop-blur-sm relative overflow-visible">
            <p className="text-gray-600 text-sm mb-3">Silakan pilih filter...</p>
            <div className="grid grid-cols-2 gap-3 relative z-20">
              {/* Year Dropdown */}
              <div className="relative z-30 dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    setIsYearDropdownOpen(!isYearDropdownOpen);
                    setIsMonthDropdownOpen(false);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-left flex items-center justify-between relative z-30"
                >
                  <span className="text-gray-900">{selectedYear}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isYearDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {years.map((year, index) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => {
                          setSelectedYear(year);
                          setIsYearDropdownOpen(false);
                        }}
                        style={{
                          backgroundColor: selectedYear === year ? '#ef4444' : 'white',
                          color: selectedYear === year ? 'white' : '#374151',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedYear !== year) {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                            e.currentTarget.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedYear !== year) {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#374151';
                          }
                        }}
                        className={`w-full p-3 text-left transition-all duration-200 cursor-pointer border-none outline-none ${
                          index === 0 ? 'rounded-t-xl' : ''
                        } ${
                          index === years.length - 1 ? 'rounded-b-xl' : ''
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Month Dropdown */}
              <div className="relative z-30 dropdown-container">
                <button
                  type="button"
                  onClick={() => {
                    setIsMonthDropdownOpen(!isMonthDropdownOpen);
                    setIsYearDropdownOpen(false);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-left flex items-center justify-between relative z-30"
                >
                  <span className="text-gray-900">{selectedMonth}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isMonthDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {months.map((month, index) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => {
                          setSelectedMonth(month);
                          setIsMonthDropdownOpen(false);
                        }}
                        style={{
                          backgroundColor: selectedMonth === month ? '#ef4444' : 'white',
                          color: selectedMonth === month ? 'white' : '#374151',
                        }}
                        onMouseEnter={(e) => {
                          if (selectedMonth !== month) {
                            e.currentTarget.style.backgroundColor = '#ef4444';
                            e.currentTarget.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedMonth !== month) {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#374151';
                          }
                        }}
                        className={`w-full p-3 text-left transition-all duration-200 cursor-pointer border-none outline-none ${
                          index === 0 ? 'rounded-t-xl' : ''
                        } ${
                          index === months.length - 1 ? 'rounded-b-xl' : ''
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* IKM Logo and Title */}
        <section className="mb-6 relative z-0">
          <div className="rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-red-200 backdrop-blur-sm text-center relative z-0">
            {/* IKM Logo */}
            <div className="mb-6 flex justify-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg ring-1 ring-red-400/40 bg-white grid place-items-center">
                <Image
                  src="/logo/LOGO_DPKJ.png"
                  alt="Logo DPKJ"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Indeks Kepuasan Masyarakat (IKM) Desa
            </h2>
            <h3 className="text-base font-semibold text-red-600 mb-6">
              DAUH PURI KAJA Kecamatan Denpasar Utara
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Tahun {selectedYear}
            </p>

            {/* IKM Value Box */}
            <div className="bg-white rounded-2xl p-4 shadow-lg ring-1 ring-red-100 mb-4">
              <div className="text-center">
                <div className="w-full h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl mb-2 flex items-center justify-center shadow-inner">
                  <span className="text-red-600 text-lg font-bold">Nilai IKM</span>
                </div>
              </div>
            </div>

            {/* Service Name Box */}
            <div className="bg-white rounded-2xl p-4 shadow-lg ring-1 ring-red-100 mb-4">
              <div className="text-center">
                <div className="w-full h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl mb-2 flex items-center justify-center shadow-inner">
                  <span className="text-red-600 text-lg font-bold">Nama Pelayanan</span>
                </div>
              </div>
            </div>

            {/* Service Data Box */}
            <div className="bg-white rounded-2xl p-4 shadow-lg ring-1 ring-red-100 mb-6">
              <div className="text-center">
                <div className="w-full h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-xl mb-2 flex items-center justify-center shadow-inner">
                  <span className="text-red-600 text-lg font-bold">Data Pelayanan</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 justify-center">
              <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-200 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Cetak</span>
              </button>
            </div>

            {/* Questionnaire Button */}
            <div className="mt-4">
              <a href="/masyarakat/ikm/kuesioner" className="block">
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200">
                  Isi Kuesioner SKM
                </button>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Navigation Bar */}
      <BottomNavigation />
    </main>
  );
}
