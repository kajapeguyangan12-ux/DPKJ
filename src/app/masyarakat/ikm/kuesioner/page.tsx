'use client';

import React, { useState } from 'react';
import BottomNavigation from '../../../components/BottomNavigation';
import HeaderCard from '../../../components/HeaderCard';

export default function KuesionerPage() {
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    jenisKelamin: '',
    usia: '',
    noHandphone: '',
    dusun: '',
    desa: '',
    kecamatan: '',
    pendidikan: '',
    pekerjaan: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form data:', formData);
  };

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Indeks Kepuasan Masyarakat" 
          subtitle="Kuesioner Survey"
          backUrl="/masyarakat/ikm" 
        />

        {/* Form Section */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 p-6 shadow-xl ring-1 ring-red-200 backdrop-blur-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-2">
                Kuesioner Survey kepuasan masyarakat...
              </h2>
              <div className="w-full h-1 bg-gradient-to-r from-red-200 via-red-300 to-red-200 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Data Diri Section */}
              <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Data Diri</h3>
                <p className="text-sm text-gray-600 mb-4">Data diri dibawah...</p>
              </div>

              {/* NIK */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                <input
                  type="text"
                  value={formData.nik}
                  onChange={(e) => handleInputChange('nik', e.target.value)}
                  placeholder="Input NIK"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  placeholder="Input Nama"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <input
                  type="text"
                  value={formData.jenisKelamin}
                  onChange={(e) => handleInputChange('jenisKelamin', e.target.value)}
                  placeholder="Input Jenis Kelamin"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {/* Usia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usia</label>
                <input
                  type="text"
                  value={formData.usia}
                  onChange={(e) => handleInputChange('usia', e.target.value)}
                  placeholder="Input Usia"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {/* No Handphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No Handphone</label>
                <input
                  type="text"
                  value={formData.noHandphone}
                  onChange={(e) => handleInputChange('noHandphone', e.target.value)}
                  placeholder="Input No Handphone"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {/* Dusun */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dusun</label>
                <input
                  type="text"
                  value={formData.dusun}
                  onChange={(e) => handleInputChange('dusun', e.target.value)}
                  placeholder="Input Dusun"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {/* Desa */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desa</label>
                <input
                  type="text"
                  value={formData.desa}
                  onChange={(e) => handleInputChange('desa', e.target.value)}
                  placeholder="Input Desa"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {/* Kecamatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={formData.kecamatan}
                  onChange={(e) => handleInputChange('kecamatan', e.target.value)}
                  placeholder="Input Kecamatan"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {/* Pendidikan Terakhir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pendidikan Terakhir</label>
                <input
                  type="text"
                  value={formData.pendidikan}
                  onChange={(e) => handleInputChange('pendidikan', e.target.value)}
                  placeholder="Input Pendidikan Terakhir"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {/* Pekerjaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pekerjaan</label>
                <input
                  type="text"
                  value={formData.pekerjaan}
                  onChange={(e) => handleInputChange('pekerjaan', e.target.value)}
                  placeholder="Input Pekerjaan"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <a href="/masyarakat/ikm/kuesioner/selanjutnya" className="block">
                  <button
                    type="button"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200"
                  >
                    Selanjutnya
                  </button>
                </a>
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
