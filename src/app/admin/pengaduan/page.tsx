'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { 
  getAllLaporan,
  updateLaporanStatus,
  LaporanMasyarakat
} from '../../../lib/laporanService';
import Link from 'next/link';
import Image from 'next/image';

type FilterType = 'all' | 'menunggu' | 'diproses' | 'disetujui' | 'selesai' | 'ditolak';
type SortType = 'newest' | 'oldest' | 'priority';

const KATEGORI_OPTIONS = [
  'Infrastruktur',
  'Keamanan', 
  'Lingkungan',
  'Pelayanan',
  'Kesehatan',
  'Pendidikan',
  'Lainnya'
];

const STATUS_CONFIG = {
  menunggu: {
    label: 'Menunggu',
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    icon: '⏳'
  },
  diproses: {
    label: 'Diproses',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: '🔄'
  },
  disetujui: {
    label: 'Disetujui',
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: '✅'
  },
  selesai: {
    label: 'Selesai',
    color: 'from-green-600 to-teal-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    icon: '✔️'
  },
  ditolak: {
    label: 'Ditolak',
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: '❌'
  }
};

export default function AdminPengaduanPage() {
  const [laporanList, setLaporanList] = useState<LaporanMasyarakat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState<LaporanMasyarakat | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [catatanAdmin, setCatatanAdmin] = useState('');
  const [alasanTolak, setAlasanTolak] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const data = await getAllLaporan();
      setLaporanList(data);
    } catch (error) {
      console.error('Error fetching laporan:', error);
      alert('Gagal memuat data pengaduan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedLaporan?.id || !newStatus) return;
    
    try {
      setSubmitting(true);
      
      const updateData: any = {
        status: newStatus as any,
        catatanAdmin: catatanAdmin || undefined
      };

      if (newStatus === 'ditolak' && alasanTolak) {
        updateData.alasanTolak = alasanTolak;
      }

      await updateLaporanStatus(selectedLaporan.id, updateData);
      await fetchLaporan();
      
      setShowStatusModal(false);
      setShowDetailModal(false);
      setNewStatus('');
      setCatatanAdmin('');
      setAlasanTolak('');
      
      alert('Status berhasil diperbarui');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal memperbarui status');
    } finally {
      setSubmitting(false);
    }
  };

  const openDetailModal = (laporan: LaporanMasyarakat) => {
    setSelectedLaporan(laporan);
    setShowDetailModal(true);
  };

  const openStatusModal = (laporan: LaporanMasyarakat) => {
    setSelectedLaporan(laporan);
    setNewStatus(laporan.status);
    setCatatanAdmin(laporan.catatanAdmin || '');
    setAlasanTolak(laporan.alasanTolak || '');
    setShowStatusModal(true);
  };

  // Filter and sort
  const filteredLaporan = laporanList
    .filter(item => {
      const matchesSearch = 
        item.judulLaporan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.namaLengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kategoriLaporan.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
      } else if (sortBy === 'oldest') {
        return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
      }
      return 0;
    });

  const stats = {
    total: laporanList.length,
    menunggu: laporanList.filter(l => l.status === 'menunggu').length,
    diproses: laporanList.filter(l => l.status === 'diproses').length,
    selesai: laporanList.filter(l => l.status === 'selesai' || l.status === 'disetujui').length,
    ditolak: laporanList.filter(l => l.status === 'ditolak').length,
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-br from-white via-gray-50 to-orange-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="relative p-8 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-xl">
                  <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg">Pengaduan Masyarakat</h1>
                  <p className="text-orange-100 text-base mt-1 font-medium">Kelola dan tanggapi pengaduan dari warga</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="px-8 py-6 bg-gradient-to-br from-white to-gray-50">
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Total</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-2xl shadow-lg border border-yellow-200 hover:shadow-xl transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-yellow-700 mb-1">Menunggu</p>
                    <p className="text-3xl font-bold text-yellow-900">{stats.menunggu}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">⏳</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl shadow-lg border border-blue-200 hover:shadow-xl transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-700 mb-1">Diproses</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.diproses}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🔄</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-700 mb-1">Selesai</p>
                    <p className="text-3xl font-bold text-green-900">{stats.selesai}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">✔️</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-2xl shadow-lg border border-red-200 hover:shadow-xl transition-all hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-red-700 mb-1">Ditolak</p>
                    <p className="text-3xl font-bold text-red-900">{stats.ditolak}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">❌</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="px-8 py-6 bg-white border-t border-gray-200">
            <div className="flex items-center gap-4 mb-6">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari pengaduan, nama pelapor, kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-gray-700 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="px-5 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 transition-all"
              >
                <option value="newest">🕐 Terbaru</option>
                <option value="oldest">🕑 Terlama</option>
              </select>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[
                { id: 'all', label: 'Semua', count: stats.total },
                { id: 'menunggu', label: 'Menunggu', count: stats.menunggu },
                { id: 'diproses', label: 'Diproses', count: stats.diproses },
                { id: 'disetujui', label: 'Disetujui', count: stats.selesai },
                { id: 'selesai', label: 'Selesai', count: stats.selesai },
                { id: 'ditolak', label: 'Ditolak', count: stats.ditolak }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as FilterType)}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50 scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
                  }`}
                >
                  {filter.label}
                  <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    activeFilter === filter.id
                      ? 'bg-white/30 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Laporan List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 bg-white px-8 py-6 rounded-3xl shadow-xl">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-200 border-t-orange-600"></div>
              <p className="text-gray-700 font-bold text-lg">Memuat data pengaduan...</p>
            </div>
          </div>
        ) : filteredLaporan.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Tidak Ada Pengaduan</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Tidak ada pengaduan yang sesuai dengan pencarian Anda' : 'Belum ada pengaduan dari masyarakat'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Reset Pencarian
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredLaporan.map((laporan) => {
              const statusConfig = STATUS_CONFIG[laporan.status];
              
              return (
                <div
                  key={laporan.id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 group"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        {laporan.fotoLaporan && laporan.fotoLaporan.length > 0 ? (
                          <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-lg">
                            <img
                              src={laporan.fotoLaporan[0]}
                              alt={laporan.judulLaporan}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            {laporan.fotoLaporan.length > 1 && (
                              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                                +{laporan.fotoLaporan.length - 1} foto
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                              {laporan.judulLaporan}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-full text-sm font-bold">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                {laporan.kategoriLaporan}
                              </span>
                              <span className={`inline-flex items-center gap-2 px-4 py-1.5 ${statusConfig.bgColor} ${statusConfig.textColor} rounded-full text-sm font-bold`}>
                                <span>{statusConfig.icon}</span>
                                {statusConfig.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                          {laporan.isiLaporan}
                        </p>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 font-semibold mb-0.5">Pelapor</p>
                              <p className="text-sm font-bold text-gray-900 truncate">{laporan.namaLengkap}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 font-semibold mb-0.5">Telepon</p>
                              <p className="text-sm font-bold text-gray-900 truncate">{laporan.noTelepon}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs text-gray-500 font-semibold mb-0.5">Alamat</p>
                              <p className="text-sm font-bold text-gray-900 truncate">{laporan.alamat}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs text-gray-500 font-semibold mb-0.5">Tanggal</p>
                              <p className="text-sm font-bold text-gray-900 truncate">{formatDate(laporan.tanggalLaporan)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => openDetailModal(laporan)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Detail
                          </button>
                          <button
                            onClick={() => openStatusModal(laporan)}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Ubah Status
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedLaporan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
              {/* Modal Header */}
              <div className="relative p-8 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold mb-1">Detail Pengaduan</h2>
                      <p className="text-orange-100 font-medium">Informasi lengkap pengaduan masyarakat</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${STATUS_CONFIG[selectedLaporan.status].color} text-white rounded-2xl text-base font-bold shadow-lg`}>
                      <span className="text-2xl">{STATUS_CONFIG[selectedLaporan.status].icon}</span>
                      Status: {STATUS_CONFIG[selectedLaporan.status].label}
                    </span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedLaporan.judulLaporan}</h3>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded-xl text-sm font-bold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {selectedLaporan.kategoriLaporan}
                    </span>
                  </div>

                  {/* Photos */}
                  {selectedLaporan.fotoLaporan && selectedLaporan.fotoLaporan.length > 0 && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Foto Pengaduan
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedLaporan.fotoLaporan.map((foto, index) => (
                          <div key={index} className="relative rounded-2xl overflow-hidden shadow-lg aspect-square">
                            <img
                              src={foto}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                              onClick={() => window.open(foto, '_blank')}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      Isi Pengaduan
                    </h4>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-2xl">
                      {selectedLaporan.isiLaporan}
                    </p>
                  </div>

                  {/* Reporter Info */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Informasi Pelapor
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500 font-semibold mb-1">Nama Lengkap</p>
                        <p className="text-base font-bold text-gray-900">{selectedLaporan.namaLengkap}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500 font-semibold mb-1">NIK</p>
                        <p className="text-base font-bold text-gray-900">{selectedLaporan.nik}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500 font-semibold mb-1">No. Telepon</p>
                        <p className="text-base font-bold text-gray-900">{selectedLaporan.noTelepon}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500 font-semibold mb-1">Email</p>
                        <p className="text-base font-bold text-gray-900">{selectedLaporan.email || '-'}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl col-span-2">
                        <p className="text-sm text-gray-500 font-semibold mb-1">Alamat</p>
                        <p className="text-base font-bold text-gray-900">{selectedLaporan.alamat}</p>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {selectedLaporan.catatanAdmin && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Catatan Admin
                      </h4>
                      <p className="text-gray-700 leading-relaxed bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
                        {selectedLaporan.catatanAdmin}
                      </p>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {selectedLaporan.alasanTolak && (
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Alasan Penolakan
                      </h4>
                      <p className="text-gray-700 leading-relaxed bg-red-50 p-6 rounded-2xl border-2 border-red-200">
                        {selectedLaporan.alasanTolak}
                      </p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                      <p className="text-sm text-gray-500 font-semibold mb-1">Tanggal Laporan</p>
                      <p className="text-base font-bold text-gray-900">{formatDate(selectedLaporan.tanggalLaporan)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
                      <p className="text-sm text-gray-500 font-semibold mb-1">Terakhir Diupdate</p>
                      <p className="text-base font-bold text-gray-900">{formatDate(selectedLaporan.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:shadow-lg transition-all"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openStatusModal(selectedLaporan);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                >
                  Ubah Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedLaporan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-slideUp">
              {/* Modal Header */}
              <div className="relative p-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Ubah Status Pengaduan</h2>
                      <p className="text-orange-100 text-sm">Update status dan tambahkan catatan</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Current Info */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{selectedLaporan.judulLaporan}</h3>
                  <p className="text-sm text-gray-600">Pelapor: <span className="font-bold">{selectedLaporan.namaLengkap}</span></p>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Pilih Status Baru <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setNewStatus(key)}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          newStatus === key
                            ? `bg-gradient-to-r ${config.color} text-white border-transparent shadow-lg scale-105`
                            : `${config.bgColor} ${config.textColor} border-gray-200 hover:border-gray-300 hover:shadow-md`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{config.icon}</span>
                          <span className="font-bold">{config.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catatan Admin */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Catatan Admin
                  </label>
                  <textarea
                    value={catatanAdmin}
                    onChange={(e) => setCatatanAdmin(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    placeholder="Tambahkan catatan untuk masyarakat..."
                  />
                </div>

                {/* Alasan Tolak (only if status is ditolak) */}
                {newStatus === 'ditolak' && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Alasan Penolakan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={alasanTolak}
                      onChange={(e) => setAlasanTolak(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-red-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                      placeholder="Jelaskan alasan penolakan..."
                      required
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  disabled={submitting}
                  className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-300 hover:bg-gray-50 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={submitting || !newStatus || (newStatus === 'ditolak' && !alasanTolak)}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </span>
                  ) : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
