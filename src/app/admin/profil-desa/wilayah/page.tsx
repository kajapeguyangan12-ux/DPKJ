"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../../lib/firebase";
import AdminLayout from "../../components/AdminLayout";
import AdminHeaderCard, { AdminHeaderSearchBar, AdminHeaderAccount } from "../../../components/AdminHeaderCard";
import { 
  getWilayahContent, 
  saveWilayahContent, 
  uploadImageToStorage,
  subscribeToWilayahContent,
  type WilayahContent, 
  type WilayahDusunEntry 
} from "../../../../lib/profilDesaService";

export default function WilayahDesaAdminPage() {
  const router = useRouter();
  const [wilayahData, setWilayahData] = useState<WilayahContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    namaDusun: "",
    luasDusun: "",
    garisKeliling: "",
  });


  useEffect(() => {
    const loadWilayahData = async () => {
      try {
        const data = await getWilayahContent();
        setWilayahData(data);
      } catch (error) {
        console.error('Error loading wilayah data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWilayahData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToWilayahContent((data) => {
      setWilayahData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleEdit = () => {
    if (wilayahData) {
      setIsEditMode(true);
      setFormData({
        description: wilayahData.deskripsi || "",
        namaDusun: "",
        luasDusun: "",
        garisKeliling: "",
      });
      setShowModal(true);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setFormData({
      description: "",
      namaDusun: "",
      luasDusun: "",
      garisKeliling: "",
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedFile(null);
    setFormData({
      description: "",
      namaDusun: "",
      luasDusun: "",
      garisKeliling: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let fotoUrl = wilayahData?.fotoUrl || '';
      
      // Upload foto jika ada file yang dipilih
      if (selectedFile) {
        const fileName = `wilayah-${Date.now()}`;
        fotoUrl = await uploadImageToStorage(selectedFile, fileName);
      }

      let updatedDusunData = wilayahData?.dusunData || [];

      // Jika mode edit, update deskripsi saja, jangan tambah data dusun baru
      if (isEditMode) {
        // Jika ada data dusun baru yang diisi, tambahkan ke existing data
        if (formData.namaDusun.trim()) {
          const newDusunEntry: WilayahDusunEntry = {
            namaDusun: formData.namaDusun,
            luasDusun: formData.luasDusun,
            garisKeliling: formData.garisKeliling,
          };
          updatedDusunData = [...updatedDusunData, newDusunEntry];
        }
      } else {
        // Mode tambah - gabungkan data dusun yang sudah ada dengan yang baru
        if (formData.namaDusun.trim()) {
          const newDusunEntry: WilayahDusunEntry = {
            namaDusun: formData.namaDusun,
            luasDusun: formData.luasDusun,
            garisKeliling: formData.garisKeliling,
          };
          updatedDusunData = [...updatedDusunData, newDusunEntry];
        }
      }

      // Simpan data ke Firestore
      const wilayahContent: Omit<WilayahContent, 'id' | 'createdAt' | 'updatedAt'> = {
        deskripsi: formData.description || wilayahData?.deskripsi || '',
        fotoUrl: fotoUrl,
        dusunData: updatedDusunData,
      };

      await saveWilayahContent(wilayahContent);
      
      // Reset form
      handleCloseModal();

      alert(`Data wilayah berhasil ${isEditMode ? 'diperbarui' : 'disimpan'}!`);
    } catch (error) {
      console.error('Error saving wilayah data:', error);
      alert(`Gagal ${isEditMode ? 'memperbarui' : 'menyimpan'} data wilayah`);
    } finally {
      setUploading(false);
    }
  };

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
        <AdminHeaderCard title="Wilayah Desa">
          <AdminHeaderSearchBar />
          <AdminHeaderAccount onLogout={handleLogout} />
        </AdminHeaderCard>
        
        {/* Tombol Kembali */}
        <div className="mb-6">
          <Link
            href="/admin/profil-desa"
            className="group inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 font-semibold hover:from-red-100 hover:to-red-200 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105"
            title="Kembali ke halaman pemilihan Profil Desa"
          >
            <svg 
              width="20" 
              height="20" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24"
              className="text-red-600 group-hover:text-red-700 transition-colors"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="group-hover:text-red-800 transition-colors">Kembali ke Pemilihan</span>
          </Link>
        </div>
        
        <div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat data wilayah...</p>
            </div>
          ) : wilayahData ? (
            <div className="flex items-center bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg mb-6 transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-l-2xl flex items-center justify-center text-gray-600 font-semibold overflow-hidden">
                {wilayahData.fotoUrl ? (
                  <img 
                    src={wilayahData.fotoUrl} 
                    alt="Foto Wilayah" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Foto"
                )}
              </div>
              <div className="flex-1 px-6 py-4">
                <div className="font-semibold text-lg text-gray-800 mb-3">
                  {wilayahData.deskripsi || "Deskripsi Wilayah Secara Singkat"}
                </div>
                {wilayahData.dusunData && wilayahData.dusunData.length > 0 && (
                  <div className="mb-3 text-sm text-gray-600">
                    <p><strong>Data Dusun:</strong></p>
                    {wilayahData.dusunData.map((dusun, index) => (
                      <div key={index} className="ml-2">
                        • {dusun.namaDusun} - {dusun.luasDusun} m² - Keliling: {dusun.garisKeliling} km
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-sm">
                    Detail
                  </button>
                  <button 
                    onClick={handleEdit}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold flex items-center gap-1 hover:bg-gray-300 transition-colors transform hover:scale-105"
                  >
                    Edit
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">Belum ada data wilayah</p>
              <p className="text-gray-500">Klik tombol &quot;Buat&quot; untuk menambah data wilayah</p>
            </div>
          )}
          <div className="flex justify-end mt-8">
            <button 
              onClick={handleAdd}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Buat
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Tambah/Edit Wilayah */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-60 p-10 max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isEditMode ? 'Edit Data Wilayah Desa' : 'Formulir Tambah Wilayah'}
              </h2>
              <p className="text-gray-600 mb-8">
                {isEditMode 
                  ? 'Perbarui data wilayah desa. Foto otomatis dikonversi ke format WebP untuk performa optimal.'
                  : 'Data akan tersimpan di Firebase Firestore. Foto otomatis dikonversi ke format WebP untuk performa optimal.'
                }
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Deskripsi */}
                <div>
                  <label className="text-base font-semibold text-gray-700 block mb-3">Deskripsi Wilayah Desa</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Masukkan Deskripsi"
                    className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:bg-white transition-colors text-base"
                    rows={4}
                    required
                  />
                </div>

                {/* Upload Foto */}
                <div>
                  <label className="text-base font-semibold text-gray-700 block mb-3">Upload Foto</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="flex-1 px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 text-gray-800 focus:outline-none focus:border-red-500 transition-colors text-base"
                    />
                    <button
                      type="button"
                      className="p-4 rounded-2xl bg-gray-200 hover:bg-gray-300 transition-colors"
                      title="Foto akan otomatis dikonversi ke format WebP"
                    >
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-600">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                    </button>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ File dipilih: {selectedFile.name} (akan dikonversi ke WebP)
                    </p>
                  )}
                </div>

                {/* Data Dusun yang Ada */}
                {isEditMode && wilayahData?.dusunData && wilayahData.dusunData.length > 0 && (
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                    <label className="text-base font-semibold text-blue-800 block mb-4">Data Dusun Saat Ini</label>
                    <div className="space-y-3">
                      {wilayahData.dusunData.map((dusun, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl border border-blue-200 flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{dusun.namaDusun}</div>
                            <div className="text-sm text-gray-600">
                              Luas: {dusun.luasDusun} m² • Keliling: {dusun.garisKeliling} km
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus data dusun "${dusun.namaDusun}"?`)) {
                                const updatedData = wilayahData.dusunData.filter((_, i) => i !== index);
                                setWilayahData({
                                  ...wilayahData,
                                  dusunData: updatedData
                                });
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title={`Hapus ${dusun.namaDusun}`}
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Isi Tabel Luas Wilayah */}
                <div className="bg-gray-100 rounded-2xl p-6">
                  <label className="text-base font-semibold text-gray-700 block mb-5 text-center">
                    {isEditMode ? 'Tambah Data Dusun Baru (Opsional)' : 'Isi Tabel Luas Wilayah'}
                  </label>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="namaDusun"
                      value={formData.namaDusun}
                      onChange={handleInputChange}
                      placeholder="Nama Dusun"
                      className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-base"
                    />
                    <input
                      type="number"
                      name="luasDusun"
                      value={formData.luasDusun}
                      onChange={handleInputChange}
                      placeholder="Luas Dusun (m2)"
                      className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-base"
                    />
                    <input
                      type="number"
                      name="garisKeliling"
                      value={formData.garisKeliling}
                      onChange={handleInputChange}
                      placeholder="Garis Keliling (Km)"
                      className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 transition-colors text-base"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={uploading}
                    className="flex-1 px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-base disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 text-base disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {isEditMode ? 'Memperbarui...' : 'Menyimpan...'}
                      </>
                    ) : (
                      <span>{isEditMode ? 'Simpan Perubahan' : 'Simpan'}</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
