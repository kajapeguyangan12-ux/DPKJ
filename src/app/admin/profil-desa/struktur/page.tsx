"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../../lib/firebase";
import AdminLayout from "../../components/AdminLayout";
import AdminHeaderCard, { AdminHeaderSearchBar, AdminHeaderAccount } from "../../../components/AdminHeaderCard";
import {
  addStrukturPemerintahaan,
  updateStrukturPemerintahaan,
  deleteStrukturPemerintahaan,
  uploadImageToStorage,
  subscribeToStrukturPemerintahaan,
  type StrukturPemerintahaan,
} from "../../../../lib/profilDesaService";

interface Category {
  id: string;
  name: string;
  icon: string;
  label: string;
}

interface StructureType {
  id: string;
  label: string;
  collection: string;
}

const STRUCTURE_TYPES: StructureType[] = [
  { id: "struktur_pemerintahan", label: "Struktur Pemerintah Desa", collection: "struktur-pemerintahaan" },
  { id: "lembaga_pemberdayaan", label: "Lembaga Pemberdayaan Masyarakat", collection: "lembaga-pemberdayaan" },
];

const CATEGORIES: Category[] = [
  { id: "tambah_anggota", name: "Tambah Anggota", icon: "👥", label: "Tambah Anggota" },
  { id: "hapus_data", name: "Hapus Data", icon: "🗑️", label: "Hapus Data" },
  { id: "ubah_gambar", name: "Ubah Gambar", icon: "🖼️", label: "Ubah Gambar" },
  { id: "ubah_anggota", name: "Ubah Anggota", icon: "✏️", label: "Ubah Anggota" },
];

export default function StrukturPemerintahaanPage() {
  const router = useRouter();
  const [strukturData, setStrukturData] = useState<StrukturPemerintahaan[]>([]);
  const [loading, setLoading] = useState(true);
  const [structureType, setStructureType] = useState<string>("struktur_pemerintahan");
  const [activeCategory, setActiveCategory] = useState<string>("tambah_anggota");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    jabatan: "",
    deskripsi: "",
  });

  useEffect(() => {
    const unsubscribe = subscribeToStrukturPemerintahaan((data) => {
      setStrukturData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (item: StrukturPemerintahaan) => {
    setFormData({
      nama: item.nama,
      jabatan: item.jabatan,
      deskripsi: item.deskripsi || "",
    });
    setEditingId(item.id);
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let fotoUrl = "";

      if (editingId) {
        const existing = strukturData.find((item) => item.id === editingId);
        fotoUrl = existing?.foto || "";
      }

      if (selectedFile) {
        fotoUrl = await uploadImageToStorage(
          selectedFile,
          `struktur-${Date.now()}`
        );
      }

      const data = {
        nama: formData.nama,
        jabatan: formData.jabatan,
        deskripsi: formData.deskripsi,
        foto: fotoUrl,
      };

      if (editingId) {
        await updateStrukturPemerintahaan(editingId, data);
      } else {
        await addStrukturPemerintahaan(data);
      }

      setShowModal(false);
      setSelectedFile(null);
      setFormData({ nama: "", jabatan: "", deskripsi: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving struktur data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    setDeleting(true);
    try {
      await deleteStrukturPemerintahaan(deletingId);
      setShowDeleteConfirm(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Error deleting struktur data:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data struktur pemerintahaan...</p>
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
      <div className="min-h-screen bg-gray-50">
        <AdminHeaderCard title="Kelola Struktur Pemerintahaan">
          <AdminHeaderSearchBar />
          <AdminHeaderAccount onLogout={handleLogout} />
        </AdminHeaderCard>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="mb-6">
            <Link
              href="/admin/profil-desa"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
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
              Kembali ke Profil Desa
            </Link>
          </div>

          {/* Dropdown Selector */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-8">
              <label htmlFor="category-select" className="text-lg font-semibold text-gray-700">
                Pilih Kategori
              </label>
              <div className="relative flex-1 max-w-md">
                <select
                  id="category-select"
                  value={structureType}
                  onChange={(e) => {
                    setStructureType(e.target.value);
                    setActiveCategory("tambah_anggota");
                  }}
                  className="w-full px-6 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-semibold appearance-none cursor-pointer focus:outline-none focus:border-blue-600 transition-colors"
                >
                  {STRUCTURE_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 font-semibold flex flex-col items-center gap-3 ${
                    activeCategory === category.id
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 text-gray-700"
                  }`}
                >
                  <span className="text-4xl">{category.icon}</span>
                  <span className="text-sm text-center">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subsection Based on Active Category */}
          {activeCategory === "tambah_anggota" && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Tambah Anggota</h2>
              <div className="bg-white rounded-2xl shadow-md p-8">
                <button
                  onClick={() => {
                    setFormData({ nama: "", jabatan: "", deskripsi: "" });
                    setSelectedFile(null);
                    setEditingId(null);
                    setShowModal(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Anggota Baru
                </button>
              </div>
            </div>
          )}

          {activeCategory === "hapus_data" && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hapus Data</h2>
              <div className="bg-white rounded-2xl shadow-md p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {strukturData && strukturData.length > 0 ? (
                    strukturData.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{item.nama}</p>
                          <p className="text-sm text-gray-600">{item.jabatan}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">Tidak ada data untuk dihapus</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeCategory === "ubah_gambar" && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ubah Gambar</h2>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl p-12 text-gray-600 hover:border-blue-400 transition-colors">
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-lg font-semibold mb-2">
                    Drag atau klik untuk pilih gambar
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeCategory === "ubah_anggota" && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Ubah Anggota</h2>
                <button
                  onClick={() => {
                    setFormData({ nama: "", jabatan: "", deskripsi: "" });
                    setSelectedFile(null);
                    setEditingId(null);
                    setShowModal(true);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 font-semibold"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Anggota
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {strukturData && strukturData.length > 0 ? (
                  strukturData.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                        {item.foto ? (
                          <img
                            src={item.foto}
                            alt={item.nama}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <svg
                              className="w-20 h-20 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {item.nama}
                        </h3>
                        <p className="text-blue-600 font-semibold mb-3">
                          {item.jabatan}
                        </p>
                        {item.deskripsi && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {item.deskripsi}
                          </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium text-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium text-sm"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 8.646 4 4 0 010-8.646zM9 20H4a4 4 0 00-4 4v0h20v0a4 4 0 00-4-4h-5z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg mb-6">
                        Belum ada anggota struktur pemerintahaan.
                      </p>
                      <button
                        onClick={() => {
                          setFormData({ nama: "", jabatan: "", deskripsi: "" });
                          setSelectedFile(null);
                          setEditingId(null);
                          setShowModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2 font-medium"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Tambah Anggota
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Form Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            ></div>
            <div className="bg-white rounded-3xl w-full max-w-2xl relative z-60 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {editingId ? "Edit Struktur Pemerintahaan" : "Tambah Struktur Pemerintahaan"}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nama */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                      placeholder="Masukkan nama lengkap"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors text-base"
                      required
                    />
                  </div>

                  {/* Jabatan */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Jabatan
                    </label>
                    <select
                      value={formData.jabatan}
                      onChange={(e) =>
                        setFormData({ ...formData, jabatan: e.target.value })
                      }
                      className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors text-base"
                      required
                    >
                      <option value="">Pilih Jabatan</option>
                      <option value="Kepala Desa">Kepala Desa</option>
                      <option value="Wakil Kepala Desa">Wakil Kepala Desa</option>
                      <option value="Sekretaris Desa">Sekretaris Desa</option>
                      <option value="Bendahara Desa">Bendahara Desa</option>
                      <option value="Kaur Tata Usaha">Kaur Tata Usaha</option>
                      <option value="Kaur Perencanaan">Kaur Perencanaan</option>
                      <option value="Kaur Pembangunan">Kaur Pembangunan</option>
                      <option value="Kaur Keuangan">Kaur Keuangan</option>
                      <option value="Kaur Pemberdayaan Masyarakat">Kaur Pemberdayaan Masyarakat</option>
                      <option value="Kepala Dusun">Kepala Dusun</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Deskripsi (Opsional)
                    </label>
                    <textarea
                      value={formData.deskripsi}
                      onChange={(e) =>
                        setFormData({ ...formData, deskripsi: e.target.value })
                      }
                      placeholder="Masukkan deskripsi singkat"
                      className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors text-base"
                      rows={3}
                    />
                  </div>

                  {/* Upload Foto */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Upload Foto
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-2xl p-4 text-gray-600">
                        <span className="text-sm">
                          {selectedFile ? selectedFile.name : "Pilih atau drag foto di sini"}
                        </span>
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Button Group */}
                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-base"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition-all duration-300 transform hover:scale-105 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Menyimpan...
                        </div>
                      ) : editingId ? (
                        "Simpan Perubahan"
                      ) : (
                        "Tambah"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(false)}
            ></div>
            <div className="bg-white rounded-2xl w-full max-w-md relative z-60 shadow-2xl overflow-hidden">
              <div className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4v2m0 4v2M7.08 6.47a9 9 0 1 1 9.84 0"
                      />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Apakah Anda Yakin Menghapus Data Ini?
                </h3>
                <p className="text-gray-600 mb-8">
                  Data struktur pemerintahaan akan dihapus secara permanen dan tidak dapat dipulihkan.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold transition-colors disabled:opacity-50"
                  >
                    Tidak
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Menghapus...
                      </>
                    ) : (
                      "Ya"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
