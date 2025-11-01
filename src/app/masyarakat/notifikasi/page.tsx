"use client";

import { useState, useEffect } from "react";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from '../../components/BottomNavigation';
import { getNotifikasiByUser } from "../../../lib/layananPublikService";
import type { NotifikasiLayanan } from "../../../lib/layananPublikService";

const getNotificationIcon = (status: string) => {
  switch (status) {
    case 'diproses':
      return '⏳';
    case 'diterima':
      return '✅';
    case 'ditolak':
      return '❌';
    case 'selesai':
      return '🎉';
    default:
      return '📋';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'diproses':
      return 'Sedang Diproses';
    case 'diterima':
      return 'Diterima';
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
    case 'diproses':
      return 'text-yellow-600 bg-yellow-50';
    case 'diterima':
      return 'text-green-600 bg-green-50';
    case 'ditolak':
      return 'text-red-600 bg-red-50';
    case 'selesai':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

export default function NotifikasiMasyarakatPage() {
  const [notifikasi, setNotifikasi] = useState<NotifikasiLayanan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifikasi = async () => {
      try {
        // Get userId from localStorage
        const userId = localStorage.getItem('userId') || 'user-' + Date.now();
        const data = await getNotifikasiByUser(userId);
        setNotifikasi(data);
      } catch (error) {
        console.error('Error fetching notifikasi:', error);
        // Set empty array on error to prevent crash
        setNotifikasi([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifikasi();
  }, []);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <main className="min-h-[100svh] bg-gradient-to-b from-red-50 to-gray-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-3 sm:px-4 pb-24 sm:pb-28 pt-4">
        <HeaderCard title="Notifikasi" backUrl="/masyarakat/home" showBackButton={false} />

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : notifikasi.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-500">Belum ada notifikasi</p>
          </div>
        ) : (
          <ul className="space-y-2 sm:space-y-3">
            {notifikasi.map((n, idx) => (
              <li key={n.id} className={`rounded-2xl border bg-white/95 p-3 sm:p-4 shadow ring-1 ring-black/10 backdrop-blur transition-all hover:shadow-md`}>
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-red-500 to-red-600 text-white text-xl">
                    {getNotificationIcon(n.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm line-clamp-2 mb-1">{n.jenisLayanan}</div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(n.status)}`}>
                        {getStatusText(n.status)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{formatDate(n.createdAt)}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{n.pesan}</div>
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
