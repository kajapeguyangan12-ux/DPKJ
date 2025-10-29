"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import AdminLayout from "../components/AdminLayout";
import BeritaList from "./components/BeritaList";
import PengumumanList from "./components/PengumumanList";
import AdminHeaderCard, { AdminHeaderSearchBar, AdminHeaderIcons, AdminHeaderAccount } from "../../components/AdminHeaderCard";

export default function AdminENewsPage() {
  const router = useRouter();
  const [tab, setTab] = React.useState<'berita' | 'pengumuman'>('berita');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <AdminHeaderCard title="E-News">
          <AdminHeaderSearchBar />
          <AdminHeaderIcons />
          <AdminHeaderAccount onLogout={handleLogout} />
        </AdminHeaderCard>
        <div className="flex gap-4 mb-8">
          <button
            className={`px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 ${tab === 'berita' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
            onClick={() => setTab('berita')}
          >
            Berita
          </button>
          <button
            className={`px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform hover:scale-105 ${tab === 'pengumuman' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}`}
            onClick={() => setTab('pengumuman')}
          >
            Pengumuman
          </button>
        </div>
        {tab === 'berita' ? <BeritaList /> : <PengumumanList />}
      </div>
    </AdminLayout>
  );
}
