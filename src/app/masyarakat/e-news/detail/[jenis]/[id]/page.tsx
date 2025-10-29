"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import HeaderCard from "../../../../../components/HeaderCard";
import BottomNavigation from '../../../../../components/BottomNavigation';
import {
  getENewsItemById,
  type ENewsItem
} from "../../../../../../lib/enewsService";
import { ChevronLeft, Calendar, MapPin, Share2 } from "lucide-react";

type ValidJenis = "berita" | "pengumuman";

export default function ENewsDetailPage() {
  const params = useParams<{ jenis?: string; id?: string }>();
  const jenisParam = Array.isArray(params?.jenis) ? params?.jenis[0] : params?.jenis;
  const idParam = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [newsItem, setNewsItem] = useState<ENewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNewsItem = async () => {
      if (!jenisParam || !idParam) {
        setError("Data E-News tidak ditemukan.");
        setLoading(false);
        return;
      }

      if (jenisParam !== "berita" && jenisParam !== "pengumuman") {
        setError("Jenis E-News tidak valid.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const item = await getENewsItemById(idParam, jenisParam as ValidJenis);
        if (!item) {
          setError("E-News tidak ditemukan.");
          setNewsItem(null);
        } else {
          setNewsItem(item);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading e-news detail:", err);
        setError("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    loadNewsItem();
  }, [jenisParam, idParam]);

  const formattedDate = useMemo(() => {
    if (!newsItem?.tanggal) {
      return "-";
    }

    const dateValue = new Date(newsItem.tanggal);
    if (Number.isNaN(dateValue.valueOf())) {
      return newsItem.tanggal;
    }

    return dateValue.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }, [newsItem?.tanggal]);

  const renderHero = () => {
    if (!newsItem?.gambar) {
      return (
        <div className="h-full w-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">{newsItem?.jenis === 'berita' ? '📰' : '📢'}</div>
            <div className="text-blue-600 font-bold text-lg">E-News</div>
            <div className="text-sm text-blue-500 mt-1">Desa Peguyangan Kaja</div>
          </div>
        </div>
      );
    }

    if (newsItem.gambar.startsWith("/logo/")) {
      return (
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <Image
            src={newsItem.gambar}
            alt={newsItem.judul}
            width={160}
            height={160}
            className="opacity-90"
          />
        </div>
      );
    }

    if (newsItem.gambar.startsWith("http") || newsItem.gambar.startsWith("data:")) {
      return (
        <img
          src={newsItem.gambar}
          alt={newsItem.judul}
          className="h-full w-full object-cover"
        />
      );
    }

    return (
      <div className="h-full w-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-2">{newsItem?.jenis === 'berita' ? '📰' : '📢'}</div>
          <div className="text-blue-600 font-bold text-lg">E-News</div>
          <div className="text-sm text-blue-500 mt-1">Desa Peguyangan Kaja</div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-[100svh] bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-auto w-full max-w-md pb-24 pt-4">
        <HeaderCard title="E-News Detail" backUrl="/masyarakat/e-news" />

        {loading ? (
          <div className="px-4 mt-6 space-y-4">
            <div className="h-48 w-full animate-pulse rounded-2xl bg-gray-200" />
            {[1, 2, 3].map((key) => (
              <div key={key} className="rounded-xl bg-white p-4 shadow-sm animate-pulse">
                <div className="h-4 w-32 rounded bg-gray-200 mb-3" />
                <div className="h-20 w-full rounded-lg bg-gray-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-4 mt-12">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <div className="text-4xl mb-4">❌</div>
              <h2 className="text-lg font-semibold text-red-600 mb-2">Data tidak tersedia</h2>
              <p className="text-sm text-red-500 mb-6">{error}</p>
              <Link
                href="/masyarakat/e-news"
                className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-2 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                <ChevronLeft size={16} />
                Kembali ke E-News
              </Link>
            </div>
          </div>
        ) : newsItem ? (
          <div className="px-4 space-y-6">
            {/* Hero Image */}
            <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-gray-200 shadow-md">
              {renderHero()}
            </div>

            {/* Badge dan Share */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
                <span className={`text-sm font-semibold ${
                  newsItem.jenis === 'berita' ? 'text-blue-600' : 'text-amber-600'
                }`}>
                  {newsItem.jenis === 'berita' ? '📰 Berita' : '📢 Pengumuman'}
                </span>
              </div>
              <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {newsItem.judul}
              </h1>
            </div>

            {/* Meta Information */}
            <div className="space-y-3 pb-4 border-b border-gray-200">
              <div className="flex items-start gap-3">
                <Calendar className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs text-gray-600 mb-1">
                    {newsItem.jenis === 'berita' ? 'Tanggal Kegiatan' : 'Tanggal Pengumuman'}
                  </p>
                  <p className="text-sm font-semibold text-gray-900">{formattedDate}</p>
                </div>
              </div>

              {newsItem.jenis === 'berita' && newsItem.lokasi && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Lokasi Kegiatan</p>
                    <p className="text-sm font-semibold text-gray-900">{newsItem.lokasi}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                {newsItem.jenis === 'berita' ? 'Deskripsi Kegiatan' : 'Deskripsi Pengumuman'}
              </h2>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {newsItem.deskripsi || 'Tidak ada deskripsi'}
                </p>
              </div>
            </div>

          </div>
        ) : null}
      </div>

      <BottomNavigation />
    </main>
  );
}
