"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import layananPublikService from '@/lib/layananPublikService';
import laporanService from '@/lib/laporanService';
import { useCurrentUser } from '../lib/useCurrentUser';
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from '../../components/BottomNavigation';

interface RiwayatItem {
  id: string;
  type: 'layanan' | 'laporan';
  title: string;
  subtitle?: string;
  status: string;
  date: any;
  data: any;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'layanan':
      return '📋';
    case 'laporan':
      return '📢';
    default:
      return '📄';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
    case 'menunggu':
      return 'Menunggu';
    case 'diproses':
      return 'Sedang Diproses';
    case 'diterima':
    case 'disetujui':
      return 'Disetujui';
    case 'ditolak':
      return 'Ditolak';
    case 'selesai':
      return 'Selesai';
    default:
      return 'Status Tidak Diketahui';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
    case 'menunggu':
      return 'text-yellow-600 bg-yellow-50';
    case 'diproses':
      return 'text-blue-600 bg-blue-50';
    case 'diterima':
    case 'disetujui':
    case 'selesai':
      return 'text-green-600 bg-green-50';
    case 'ditolak':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export default function RiwayatMasyarakatPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useCurrentUser();
  const [allData, setAllData] = useState<RiwayatItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'laporan-saya' | 'disimpan'>('laporan-saya');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!userLoading) {
      if (user?.uid) {
        loadData();
      } else {
        // User is null or not authenticated, load sample data
        loadSampleData();
      }
    }
  }, [user, userLoading]);

  const loadSampleData = () => {
    const sampleData: RiwayatItem[] = [
      {
        id: 'sample1',
        type: 'layanan',
        title: 'Surat Keterangan Domisili',
        subtitle: 'Ahmad Dani - 1234567890123456',
        status: 'disetujui',
        date: new Date(),
        data: {
          jenisLayanan: 'Surat Keterangan Domisili',
          namaLengkap: 'Ahmad Dani',
          nik: '1234567890123456'
        }
      },
      {
        id: 'sample2',
        type: 'laporan',
        title: 'Jalan Rusak di RT 03',
        subtitle: 'Infrastruktur - Sari Indah',
        status: 'diproses',
        date: new Date(Date.now() - 86400000),
        data: {
          judulLaporan: 'Jalan Rusak di RT 03',
          kategoriLaporan: 'Infrastruktur',
          namaLengkap: 'Sari Indah'
        }
      },
      {
        id: 'sample3',
        type: 'layanan',
        title: 'Surat Keterangan Usaha',
        subtitle: 'Budi Santoso - 9876543210123456',
        status: 'menunggu',
        date: new Date(Date.now() - 172800000), // 2 days ago
        data: {
          jenisLayanan: 'Surat Keterangan Usaha',
          namaLengkap: 'Budi Santoso',
          nik: '9876543210123456'
        }
      }
    ];
    setAllData(sampleData);
  };

  const loadData = async () => {
    if (!user?.uid) return;
    
    setDataLoading(true);
    try {
      const [layananData, laporanData] = await Promise.all([
        layananPublikService.getUserSubmissions(user.uid),
        laporanService.getUserReports(user.uid)
      ]);

      const formattedData: RiwayatItem[] = [
        ...layananData.map((item: any) => ({
          id: item.id,
          type: 'layanan' as const,
          title: item.jenisPelayanan || item.jenisLayanan || 'Layanan Publik',
          subtitle: `${item.namaLengkap || item.nama || user.displayName || 'Pemohon'} - ${item.nik || 'NIK tidak tersedia'}`,
          status: item.status || 'pending',
          date: item.createdAt || item.tanggalPengajuan,
          data: item
        })),
        ...laporanData.map((item: any) => ({
          id: item.id,
          type: 'laporan' as const,
          title: item.judulLaporan || item.judul || 'Laporan Masyarakat',
          subtitle: `${item.kategoriLaporan || 'Kategori'} - ${item.namaLengkap || item.pelapor || user.displayName || 'Pelapor'}`,
          status: item.status || 'menunggu',
          date: item.createdAt || item.tanggalLaporan,
          data: item
        }))
      ].sort((a, b) => {
        const dateA = a.date?.toDate?.() ? a.date.toDate() : new Date(a.date);
        const dateB = b.date?.toDate?.() ? b.date.toDate() : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });

      setAllData(formattedData);
    } catch (error) {
      console.error('Error loading riwayat data:', error);
      // Fallback: Show sample data if real data fails
      loadSampleData();
    } finally {
      setDataLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredData = allData.filter(item => {
    // Filter berdasarkan tab
    if (activeTab === 'disimpan') {
      // Untuk tab disimpan, tampilkan item yang disimpan (bisa ditambah logic nanti)
      return false; // Sementara kosong
    }
    
    // Filter berdasarkan pencarian
    if (searchQuery) {
      return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return true;
  });

  return (
    <main className="min-h-[100svh] bg-gradient-to-b from-red-50 to-gray-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-3 sm:px-4 pb-24 sm:pb-28 pt-4">
        <HeaderCard title="Aktivitas" backUrl="/masyarakat/home" showBackButton={false} />

        {/* Tabs */}
        <div className="flex mb-4 bg-white rounded-2xl p-1 shadow ring-1 ring-black/10">
          <button
            onClick={() => setActiveTab('laporan-saya')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'laporan-saya'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Laporan Saya
          </button>
          <button
            onClick={() => setActiveTab('disimpan')}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-xl transition-all ${
              activeTab === 'disimpan'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Disimpan
          </button>
        </div>

        {/* Search Bar */}
        {activeTab === 'disimpan' && (
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-600 focus:border-red-600 sm:text-sm"
              />
            </div>
          </div>
        )}

        {(userLoading || dataLoading) ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : activeTab === 'disimpan' ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Item yang disimpan</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Yuk perhatikan sekitar desa sama dan buat laporan di fitur Pengaduan!
            </p>
          </div>
        ) : !userLoading && !dataLoading && filteredData.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kamu belum pernah membuat laporan</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Yuk perhatikan sekitar desa sama dan buat laporan di fitur Pengaduan!
            </p>
            <div className="mt-6">
              <button 
                onClick={() => router.push('/masyarakat/pengaduan/create')}
                className="bg-red-600 text-white px-6 py-3 rounded-2xl hover:bg-red-700 transition-colors font-medium"
              >
                Buat Laporan
              </button>
            </div>
          </div>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {filteredData.map((item, idx) => (
              <li 
                key={item.id} 
                className="rounded-2xl border bg-white/95 p-3 sm:p-4 shadow ring-1 ring-black/10 backdrop-blur transition-all hover:shadow-md cursor-pointer"
                onClick={() => {
                  // Navigate to detail page or open modal
                  console.log('Selected item:', item);
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white text-xl">
                    {getActivityIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm line-clamp-2 mb-1">{item.title}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{formatDate(item.date)}</div>
                    {item.subtitle && (
                      <div className="text-xs text-gray-500 line-clamp-2">{item.subtitle}</div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
      <BottomNavigation />
    </main>
  );
}