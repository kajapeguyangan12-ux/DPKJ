"use client";

import type { JSX } from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "../lib/useCurrentUser";
import HeaderCard from "../../components/HeaderCard";
import BottomNavigation from '../../components/BottomNavigation';
import { collection, getDocs, query, orderBy, limit, where, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Newspaper,
  Building2,
  FileText,
  DollarSign,
  Database,
  Users,
  Star,
  Mountain,
  MessageSquare,
  ShoppingBag,
  Building,
  TrendingUp,
  Camera,
  Gift,
  Map,
  Landmark,
  BookOpen,
  UserCheck,
  Clipboard,
  Bell,
  Store,
} from "lucide-react";

interface Berita {
  id: string;
  judul: string;
  foto?: string;
  tanggal?: any;
  createdAt?: any;
}

interface UMKM {
  id: string;
  namaUsaha: string;
  fotoUsaha?: string[];
  rating?: number;
  kategori?: string;
}

interface PengaturanHome {
  judulSelamatDatang: string;
  ucapanSelamatDatang: string;
  fotoKepalaDesa: string;
  namaKepalaDesa: string;
  fotoSlideshow: string[];
  popupAktif: boolean;
  popupTipe: "gambar" | "youtube";
  popupJudul: string;
  popupIsi: string;
  popupFoto: string;
  popupYoutubeUrl: string;
}

type MenuItem = {
  title: string;
  href: string;
  icon: JSX.Element;
  gradient: string;
};

const allMenuItems: MenuItem[] = [
  {
    title: "E-News",
    href: "/masyarakat/e-news",
    gradient: "from-blue-500 to-blue-600",
    icon: (
      <div className="relative">
        <Newspaper className="h-5 w-5" />
        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-white rounded-full"></div>
      </div>
    ),
  },
  {
    title: "Profil Desa",
    href: "/masyarakat/profil-desa",
    gradient: "from-emerald-500 to-emerald-600",
    icon: (
      <div className="relative">
        <Landmark className="h-5 w-5" />
        <Building2 className="h-3 w-3 absolute -bottom-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Regulasi",
    href: "/masyarakat/regulasi",
    gradient: "from-purple-500 to-purple-600",
    icon: (
      <div className="relative">
        <BookOpen className="h-5 w-5" />
        <FileText className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Keuangan",
    href: "/masyarakat/keuangan",
    gradient: "from-green-500 to-green-600",
    icon: (
      <div className="relative">
        <DollarSign className="h-5 w-5" />
        <TrendingUp className="h-2.5 w-2.5 absolute -bottom-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Data Desa",
    href: "/masyarakat/data-desa",
    gradient: "from-indigo-500 to-indigo-600",
    icon: (
      <div className="relative">
        <Database className="h-5 w-5" />
        <Map className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Layanan Publik",
    href: "/masyarakat/layanan-publik",
    gradient: "from-cyan-500 to-cyan-600",
    icon: (
      <div className="relative">
        <UserCheck className="h-5 w-5" />
        <Users className="h-2.5 w-2.5 absolute -bottom-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "IKM",
    href: "/masyarakat/ikm",
    gradient: "from-orange-500 to-orange-600",
    icon: (
      <div className="relative">
        <Clipboard className="h-5 w-5" />
        <Star className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Wisata & Budaya",
    href: "/masyarakat/wisata-budaya",
    gradient: "from-pink-500 to-pink-600",
    icon: (
      <div className="relative">
        <Mountain className="h-5 w-5" />
        <Camera className="h-2.5 w-2.5 absolute -bottom-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "Pengaduan",
    href: "/masyarakat/pengaduan",
    gradient: "from-red-500 to-red-600",
    icon: (
      <div className="relative">
        <MessageSquare className="h-5 w-5" />
        <Bell className="h-2.5 w-2.5 absolute -top-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
  {
    title: "E-UMKM",
    href: "/masyarakat/e-umkm",
    gradient: "from-amber-500 to-amber-600",
    icon: (
      <div className="relative">
        <Store className="h-5 w-5" />
        <ShoppingBag className="h-2.5 w-2.5 absolute -bottom-0.5 -right-0.5 text-white" />
      </div>
    ),
  },
];

export default function HomeMasyarakatMobile() {
  const { user } = useCurrentUser();
  const router = useRouter();
  const [beritaList, setBeritaList] = useState<Berita[]>([]);
  const [umkmList, setUmkmList] = useState<UMKM[]>([]);
  const [currentBeritaIndex, setCurrentBeritaIndex] = useState(0);
  const [currentUmkmIndex, setCurrentUmkmIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pengaturan, setPengaturan] = useState<PengaturanHome | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSlideshowIndex, setCurrentSlideshowIndex] = useState(0);

  useEffect(() => {
    fetchData();
    fetchPengaturan();
  }, []);

  useEffect(() => {
    // Show popup only once per session if active
    const popupShown = sessionStorage.getItem('popupShown');
    if (pengaturan?.popupAktif && !popupShown) {
      setShowPopup(true);
      sessionStorage.setItem('popupShown', 'true');
    }
  }, [pengaturan]);

  // Auto slide berita setiap 3 detik
  useEffect(() => {
    if (beritaList.length > 0) {
      const interval = setInterval(() => {
        setCurrentBeritaIndex((prev) => (prev + 1) % beritaList.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [beritaList]);

  // Auto slide UMKM setiap 3 detik
  useEffect(() => {
    if (umkmList.length > 0) {
      const interval = setInterval(() => {
        setCurrentUmkmIndex((prev) => (prev + 1) % umkmList.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [umkmList]);

  // Auto slide slideshow setiap 4 detik
  useEffect(() => {
    if (pengaturan?.fotoSlideshow && pengaturan.fotoSlideshow.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlideshowIndex((prev) => (prev + 1) % pengaturan.fotoSlideshow.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [pengaturan?.fotoSlideshow]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch 3 berita terbaru
      const beritaQuery = query(
        collection(db, "e-news"),
        orderBy("createdAt", "desc"),
        limit(3)
      );
      const beritaSnapshot = await getDocs(beritaQuery);
      const berita: Berita[] = [];
      beritaSnapshot.forEach((doc) => {
        berita.push({ id: doc.id, ...doc.data() } as Berita);
      });
      setBeritaList(berita);
      console.log('Berita terbaru:', berita);

      // Fetch 3 UMKM dengan rating tertinggi (hanya yang aktif)
      const umkmQuery = query(
        collection(db, "e-umkm"),
        where("status", "==", "aktif"),
        orderBy("rating", "desc"),
        limit(3)
      );
      const umkmSnapshot = await getDocs(umkmQuery);
      const umkm: UMKM[] = [];
      umkmSnapshot.forEach((doc) => {
        umkm.push({ id: doc.id, ...doc.data() } as UMKM);
      });
      setUmkmList(umkm);
      console.log('UMKM rating tertinggi:', umkm);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPengaturan = async () => {
    try {
      const docRef = doc(db, "pengaturan", "home");
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setPengaturan(docSnap.data() as PengaturanHome);
      }
    } catch (error) {
      console.error('Error fetching pengaturan:', error);
    }
  };

  const extractYouTubeId = (url: string): string => {
    if (!url) return "";
    // Support for regular YouTube videos and YouTube Shorts
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  const handleBeritaClick = () => {
    if (beritaList[currentBeritaIndex]) {
      router.push(`/masyarakat/e-news/${beritaList[currentBeritaIndex].id}`);
    }
  };

  const handleUmkmClick = () => {
    if (umkmList[currentUmkmIndex]) {
      router.push(`/masyarakat/e-umkm`);
    }
  };

  let menuItems: MenuItem[] = allMenuItems;
  if (user?.role === "warga_luar_dpkj") {
    menuItems = allMenuItems.filter(
      (item) => item.title === "E-Toko" || item.title === "Wisata & Budaya"
    );
  }
  return (
    <main className="min-h-[100svh] bg-gradient-to-b from-red-50 to-gray-50 text-gray-800">
      {/* Popup Modal */}
      {showPopup && pengaturan?.popupAktif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          {pengaturan.popupTipe === "youtube" ? (
            // Popup YouTube - Modern & Professional
            <div className="relative w-full max-w-3xl h-[70vh] bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none"></div>
              
              {/* Close Button - Modern Style */}
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 z-20 p-3 bg-black/60 hover:bg-red-500 backdrop-blur-sm rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-90 group"
              >
                <svg className="w-6 h-6 text-white group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* YouTube Iframe - Centered Zoom with object-fit cover effect */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <iframe
                  className="w-full h-full scale-150"
                  style={{
                    objectFit: 'cover',
                    transform: 'scale(1.3)',
                    transformOrigin: 'center center'
                  }}
                  src={`https://www.youtube.com/embed/${extractYouTubeId(pengaturan.popupYoutubeUrl)}?autoplay=1&mute=0&loop=1&playlist=${extractYouTubeId(pengaturan.popupYoutubeUrl)}&rel=0&modestbranding=1&controls=1&playsinline=1`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              
              {/* Bottom Gradient Overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            </div>
          ) : (
            // Popup Gambar + Text - Original
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Popup Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-t-3xl flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{pengaturan.popupJudul}</h3>
                <button
                  onClick={() => setShowPopup(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Popup Content */}
              <div className="p-6">
                {pengaturan.popupFoto && (
                  <img
                    src={pengaturan.popupFoto}
                    alt="Popup"
                    className="w-full h-48 object-cover rounded-2xl mb-4"
                  />
                )}
                <p className="text-gray-700 whitespace-pre-line">{pengaturan.popupIsi}</p>
              </div>
              
              {/* Popup Footer */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={() => setShowPopup(false)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mx-auto w-full max-w-md px-3 sm:px-4 pb-24 sm:pb-28 pt-4">
        {/* Using HeaderCard Component */}
        <HeaderCard 
          title="Beranda" 
          subtitle="Sistem Informasi Desa"
        />

        {/* Welcome Section - Modern Professional Design */}
        <section className="mb-6 relative overflow-hidden rounded-3xl shadow-2xl">
          {/* Background with gradient and pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>
          
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Profile Picture Section */}
              <div className="flex-shrink-0">
                <div className="relative">
                  {/* Decorative rings */}
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="absolute -inset-2 bg-white/10 rounded-full"></div>
                  
                  {/* Main picture container */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-white/50 shadow-2xl">
                    {pengaturan?.fotoKepalaDesa ? (
                      <img
                        src={pengaturan.fotoKepalaDesa}
                        alt="Kepala Desa"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center backdrop-blur-sm">
                        <Landmark className="h-14 w-14 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Status badge */}
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-7 h-7 rounded-full ring-4 ring-white/30 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 text-center sm:text-left">
                {/* Title with icon */}
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {pengaturan?.judulSelamatDatang || "Ucapan Selamat Datang"}
                  </h3>
                </div>

                {/* Slideshow box */}
                <div className="relative">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
                    {loading ? (
                      <div className="flex items-center justify-center gap-2 text-gray-400 h-48">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                        <span className="text-sm">Memuat...</span>
                      </div>
                    ) : pengaturan?.fotoSlideshow && pengaturan.fotoSlideshow.length > 0 ? (
                      <div className="relative">
                        {/* Slideshow Image */}
                        <div className="relative h-48 sm:h-56">
                          <img
                            src={pengaturan.fotoSlideshow[currentSlideshowIndex]}
                            alt={`Slideshow ${currentSlideshowIndex + 1}`}
                            className="w-full h-full object-cover transition-all duration-500"
                          />
                          
                          {/* Gradient overlay bottom */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>

                        {/* Info overlay at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white/50">
                                <span className="text-white text-xs font-bold">
                                  {pengaturan.namaKepalaDesa?.charAt(0) || 'K'}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-white drop-shadow-lg">
                                  {pengaturan.namaKepalaDesa || 'Kepala Desa'}
                                </p>
                                <p className="text-xs text-white/90 drop-shadow-lg">Dauh Puri Kaja</p>
                              </div>
                            </div>
                            <div className="text-xs text-white/90 drop-shadow-lg bg-black/30 px-2 py-1 rounded-full">
                              {currentSlideshowIndex + 1}/{pengaturan.fotoSlideshow.length}
                            </div>
                          </div>
                        </div>

                        {/* Navigation dots */}
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-1.5">
                          {pengaturan.fotoSlideshow.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlideshowIndex(index)}
                              className={`transition-all duration-300 rounded-full ${
                                index === currentSlideshowIndex 
                                  ? 'w-6 h-2 bg-white shadow-lg' 
                                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic text-center">
                          "{pengaturan?.ucapanSelamatDatang || "Selamat datang di Sistem Informasi Desa Dauh Puri Kaja."}"
                        </p>
                        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {pengaturan?.namaKepalaDesa?.charAt(0) || 'K'}
                            </span>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-800">
                              {pengaturan?.namaKepalaDesa || 'Kepala Desa'}
                            </p>
                            <p className="text-xs text-gray-500">Dauh Puri Kaja</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Decorative quote mark */}
                  <div className="absolute -top-3 -left-2 text-white/20 text-6xl font-serif leading-none">"</div>
                </div>

                {/* Indicator dots */}
                <div className="flex justify-center sm:justify-start gap-2 mt-4">
                  <span className="h-2 w-8 rounded-full bg-white shadow-lg" />
                  <span className="h-2 w-2 rounded-full bg-white/40" />
                  <span className="h-2 w-2 rounded-full bg-white/40" />
                </div>
              </div>
            </div>

            {/* Bottom decorative line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>
        </section>

        {/* Services Card */}
        <section className="mb-8">
          <div className="rounded-3xl bg-white/95 p-3 sm:p-4 md:p-6 shadow-xl ring-1 ring-gray-200 backdrop-blur-sm">
            <div className="grid gap-2 sm:gap-3 md:gap-4 text-center text-xs" style={{ 
              gridTemplateColumns: `repeat(auto-fit, minmax(60px, 1fr))`
            }}>
              {menuItems.map((item) => (
                <Link key={item.title} href={item.href} className="group">
                  <div className="flex flex-col items-center">
                    <div
                      className={`mb-2 sm:mb-3 grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-3xl bg-gradient-to-br ${item.gradient} text-lg sm:text-xl text-white shadow-xl ring-2 ring-white/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:ring-4 group-hover:ring-white/40 group-active:scale-95 active:scale-95`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-center font-bold leading-tight text-gray-800 text-[10px] sm:text-xs px-1 line-clamp-2">
                      {item.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="mb-6">
          <h3 className="mb-4 text-base sm:text-lg font-bold text-blue-800">Berita Terbaru</h3>
          {loading ? (
            <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-blue-200 backdrop-blur-sm">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
              </div>
            </div>
          ) : beritaList.length > 0 ? (
            <div 
              onClick={handleBeritaClick}
              className="rounded-3xl bg-white/90 shadow-xl ring-1 ring-blue-200 backdrop-blur-sm overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative h-48 sm:h-64 bg-gradient-to-br from-blue-100 to-blue-200">
                {beritaList[currentBeritaIndex]?.foto ? (
                  <img
                    src={beritaList[currentBeritaIndex].foto}
                    alt={beritaList[currentBeritaIndex].judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper className="h-16 w-16 text-blue-600" />
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-bold text-sm sm:text-base line-clamp-2">
                    {beritaList[currentBeritaIndex]?.judul || 'Berita Terbaru'}
                  </h4>
                </div>
              </div>
              
              <div className="p-4 text-center">
                <div className="flex justify-center gap-2">
                  {beritaList.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentBeritaIndex(index);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentBeritaIndex 
                          ? 'w-8 bg-blue-600' 
                          : 'w-2 bg-blue-300 hover:bg-blue-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-blue-200 backdrop-blur-sm text-center text-gray-500">
              Tidak ada berita tersedia
            </div>
          )}
        </section>

        {/* News Section - Auto Slide */}
        <section className="mb-6">
          <h3 className="mb-4 text-base sm:text-lg font-bold text-blue-800">Berita Terbaru</h3>
          {loading ? (
            <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-blue-200 backdrop-blur-sm">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
              </div>
            </div>
          ) : beritaList.length > 0 ? (
            <div 
              onClick={handleBeritaClick}
              className="rounded-3xl bg-white/90 shadow-xl ring-1 ring-blue-200 backdrop-blur-sm overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative h-48 sm:h-64 bg-gradient-to-br from-blue-100 to-blue-200">
                {beritaList[currentBeritaIndex]?.foto ? (
                  <img
                    src={beritaList[currentBeritaIndex].foto}
                    alt={beritaList[currentBeritaIndex].judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper className="h-16 w-16 text-blue-600" />
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-bold text-sm sm:text-base line-clamp-2">
                    {beritaList[currentBeritaIndex]?.judul || 'Berita Terbaru'}
                  </h4>
                </div>
              </div>
              
              <div className="p-4 text-center">
                <div className="flex justify-center gap-2">
                  {beritaList.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentBeritaIndex(index);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentBeritaIndex 
                          ? 'w-8 bg-blue-600' 
                          : 'w-2 bg-blue-300 hover:bg-blue-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-blue-200 backdrop-blur-sm text-center text-gray-500">
              Tidak ada berita tersedia
            </div>
          )}
        </section>

        {/* UKM Data Section - Auto Slide with Rating */}
        <section className="mb-6">
          <h3 className="mb-4 text-base sm:text-lg font-bold text-amber-800">Data UKM</h3>
          {loading ? (
            <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-amber-200 backdrop-blur-sm">
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-amber-600"></div>
              </div>
            </div>
          ) : umkmList.length > 0 ? (
            <div 
              onClick={handleUmkmClick}
              className="rounded-3xl bg-white/90 shadow-xl ring-1 ring-amber-200 backdrop-blur-sm overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="relative h-48 sm:h-64 bg-gradient-to-br from-amber-100 to-amber-200">
                {umkmList[currentUmkmIndex]?.fotoUsaha?.[0] ? (
                  <img
                    src={umkmList[currentUmkmIndex].fotoUsaha[0]}
                    alt={umkmList[currentUmkmIndex].namaUsaha}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store className="h-16 w-16 text-amber-600" />
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Rating badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-gray-800">
                    {umkmList[currentUmkmIndex]?.rating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white font-bold text-sm sm:text-base line-clamp-2">
                    {umkmList[currentUmkmIndex]?.namaUsaha || 'UMKM Terbaik'}
                  </h4>
                  {umkmList[currentUmkmIndex]?.kategori && (
                    <p className="text-white/80 text-xs mt-1">
                      {umkmList[currentUmkmIndex].kategori}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="p-4 text-center">
                <div className="flex justify-center gap-2">
                  {umkmList.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentUmkmIndex(index);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentUmkmIndex 
                          ? 'w-8 bg-amber-600' 
                          : 'w-2 bg-amber-300 hover:bg-amber-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white/90 p-8 shadow-xl ring-1 ring-amber-200 backdrop-blur-sm text-center text-gray-500">
              Tidak ada UMKM tersedia
            </div>
          )}
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}


