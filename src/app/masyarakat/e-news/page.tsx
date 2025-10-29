"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from '../../components/BottomNavigation';
import { getPublishedENewsItems, subscribeToPublishedENews, type ENewsItem } from "../../../lib/enewsService";
import { ChevronRight, Calendar, MapPin } from "lucide-react";

export default function ENewsPage() {
  const [activeTab, setActiveTab] = useState<'berita' | 'pengumuman'>('berita');
  const [newsData, setNewsData] = useState<ENewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading e-news data...');
        setLoading(true);
        const data = await getPublishedENewsItems();
        console.log('E-news data loaded:', data);
        setNewsData(data);
        setError(null);
      } catch (error) {
        console.error('Error loading e-news data:', error);
        setError(error instanceof Error ? error.message : 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToPublishedENews((items) => {
      console.log('Received real-time update:', items);
      setNewsData(items);
    });

    return () => unsubscribe();
  }, []);

  const beritaData = newsData.filter(item => item.jenis === 'berita');
  const pengumumanData = newsData.filter(item => item.jenis === 'pengumuman');

  const currentData = activeTab === 'berita' ? beritaData : pengumumanData;

  return (
    <main className="min-h-[100svh] bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-auto w-full max-w-md pb-24 pt-4">
        <HeaderCard 
          title="E-News" 
          subtitle="Berita & Pengumuman"
          backUrl="/masyarakat/home"
        />

        {/* Tab Navigation */}
        <div className="px-4 mb-6">
          <div className="flex gap-3 rounded-2xl bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('berita')}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'berita'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Berita
              <span className="ml-1 font-normal text-xs">({beritaData.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('pengumuman')}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'pengumuman'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Pengumuman
              <span className="ml-1 font-normal text-xs">({pengumumanData.length})</span>
            </button>
          </div>
        </div>

        {/* News Cards */}
        <div className="px-4 space-y-4">
          {error && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-red-700">
              <p className="font-semibold text-sm">⚠️ Error: {error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
                <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              </div>
              <p className="text-gray-600 font-medium">Memuat data...</p>
            </div>
          ) : currentData.length > 0 ? (
            currentData.map((item) => (
              <Link
                key={item.id}
                href={`/masyarakat/e-news/detail/${item.jenis}/${item.id}`}
              >
                <div className="group rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                  {/* Image Container */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {item.gambar && item.gambar !== '/logo/default.png' ? (
                      item.gambar.startsWith('http') ? (
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <img
                          src={item.gambar}
                          alt={item.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
                        <div className="text-5xl">
                          {item.jenis === 'berita' ? '📰' : '📢'}
                        </div>
                      </div>
                    )}
                    {/* Badge */}
                    <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-md">
                      <span className={`text-xs font-semibold ${
                        item.jenis === 'berita' ? 'text-blue-600' : 'text-amber-600'
                      }`}>
                        {item.jenis === 'berita' ? 'Berita' : 'Pengumuman'}
                      </span>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="p-4">
                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.judul}
                    </h3>

                    {/* Meta Information */}
                    <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                      <Calendar size={14} className="flex-shrink-0" />
                      <span>
                        {(() => {
                          try {
                            const date = new Date(item.tanggal);
                            return date.toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            });
                          } catch {
                            return item.tanggal;
                          }
                        })()}
                      </span>
                    </div>

                    {/* Location for berita */}
                    {item.jenis === 'berita' && item.lokasi && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="truncate">{item.lokasi}</span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                      {item.deskripsi || 'Tidak ada deskripsi'}
                    </p>

                    {/* CTA Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-600">Lihat Selengkapnya</span>
                      <ChevronRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">{activeTab === 'berita' ? '📰' : '📢'}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Belum ada {activeTab === 'berita' ? 'berita' : 'pengumuman'}
              </h3>
              <p className="text-gray-600">
                {activeTab === 'berita' ? 'Berita' : 'Pengumuman'} akan muncul di sini setelah admin mempublikasikannya.
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </main>
  );
}
