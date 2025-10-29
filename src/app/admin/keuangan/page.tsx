"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import AdminLayout from "../components/AdminLayout";
import AdminHeaderCard, {
  AdminHeaderSearchBar,
  AdminHeaderAccount,
} from "../../components/AdminHeaderCard";

export default function KeuanganPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: "pendapatan",
      name: "Pendapatan",
      description: "Kelola pendapatan desa",
      icon: "🏦",
      color: "from-blue-500 to-blue-600",
      lightColor: "bg-blue-50 border-blue-200",
    },
    {
      id: "belanja",
      name: "Belanja",
      description: "Kelola belanja desa",
      icon: "🛒",
      color: "from-green-500 to-green-600",
      lightColor: "bg-green-50 border-green-200",
    },
    {
      id: "pembiayaan",
      name: "Pembiayaan",
      description: "Kelola pembiayaan desa",
      icon: "💳",
      color: "from-orange-500 to-orange-600",
      lightColor: "bg-orange-50 border-orange-200",
    },
  ];

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  if (selectedCategory) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gray-100">
          <AdminHeaderCard title="Keuangan">
            <AdminHeaderSearchBar />
            <AdminHeaderAccount />
          </AdminHeaderCard>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Navigation */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium mb-6"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali
            </button>

            {/* Info Box */}
            <div className="bg-gray-300 rounded-lg p-6 mb-8">
              <p className="text-gray-700 text-sm">
                Lakukan perubahan pada data yang ingin di ubah. Perubahan akan terupdate secara langsung pada sistem
              </p>
            </div>

            {/* Title */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-gray-300">
              <p className="text-gray-600 font-semibold">Total Data {currentCategory?.name} Desa :</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg p-6 mb-8 border border-gray-300 flex gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value={new Date().getFullYear()}>Pilih Tahun ▼</option>
                {[2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Data Fields */}
            <div className="bg-white rounded-lg p-6 mb-8 border border-gray-300 space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Judul</label>
                <input
                  type="text"
                  placeholder="Masukkan judul..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Tanggal</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors">
                  Batal
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Simpan
                </button>
              </div>
            </div>

            {/* Add Button */}
            <div className="text-center">
              <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold">
                Tambah Data {currentCategory?.name}
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
      <div className="min-h-screen bg-gray-100">
        <AdminHeaderCard title="Keuangan">
          <AdminHeaderSearchBar />
          <AdminHeaderAccount onLogout={handleLogout} />
        </AdminHeaderCard>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Navigation */}
          <button
            onClick={() => setSelectedCategory(null)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Pilih Kategori Keuangan</h2>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="bg-white rounded-lg p-8 text-center border-2 border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
