"use client";

import { useState } from "react";
import HeaderCard from "../../../components/HeaderCard";
import BottomNavigation from '../../../components/BottomNavigation';

export default function VisiMisiPage() {
  const [activeTab, setActiveTab] = useState<'visi' | 'misi'>('visi');

  const visiContent = {
    icon: "🎯",
    title: "Visi Desa Peguyangan Kaja",
    content: `Terwujudnya Desa Peguyangan Kaja yang maju, mandiri, dan sejahtera melalui pengembangan potensi lokal berbasis teknologi informasi dan kearifan lokal Bali.

    Pencapaian visi ini didasarkan pada:
    • Peningkatan kualitas sumber daya manusia
    • Pengembangan ekonomi kreatif dan UMKM
    • Pelestarian seni, budaya, dan adat istiadat Bali
    • Pemanfaatan teknologi untuk pelayanan publik
    • Kerjasama antar stakeholder pembangunan`
  };

  const misiContent = {
    icon: "🏆",
    title: "Misi Desa Peguyangan Kaja",
    content: `1. Meningkatkan kualitas pendidikan dan kesehatan masyarakat
    2. Mengembangkan potensi ekonomi lokal melalui UMKM dan industri kreatif
    3. Melestarikan dan mengembangkan seni, budaya, dan adat istiadat Bali
    4. Meningkatkan infrastruktur dan pelayanan publik berbasis teknologi
    5. Membangun kerjasama dengan berbagai pihak untuk kemajuan desa
    6. Mengoptimalkan pengelolaan sumber daya alam secara berkelanjutan
    7. Meningkatkan peran serta masyarakat dalam pembangunan desa`
  };

  const currentContent = activeTab === 'visi' ? visiContent : misiContent;

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        <HeaderCard 
          title="Profil Desa" 
          backUrl="/masyarakat/profil-desa"
        />

        {/* Tab Navigation */}
        <div className="mb-6 flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab('visi')}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === 'visi'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Visi
          </button>
          <button
            onClick={() => setActiveTab('misi')}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === 'misi'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Misi
          </button>
        </div>

        {/* Content Section */}
        <section className="mb-6">
          <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-6 shadow-xl ring-1 ring-red-200">
            {/* Icon and Title */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{currentContent.icon}</div>
              <h3 className="text-lg font-bold text-red-800">{currentContent.title}</h3>
            </div>

            {/* Content */}
            <div className="rounded-2xl bg-gray-50 p-6 shadow-inner">
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {currentContent.content}
              </div>
            </div>
          </div>
        </section>
      </div>

      <BottomNavigation />
    </main>
  );
}
