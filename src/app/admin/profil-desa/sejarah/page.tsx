"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../../lib/firebase";
import AdminLayout from "../../components/AdminLayout";
import AdminHeaderCard, { AdminHeaderSearchBar, AdminHeaderAccount } from "../../../components/AdminHeaderCard";
import { 
  getSejarahContent, 
  saveSejarahContent, 
  uploadImageToStorage,
  subscribeToSejarahContent,
  type SejarahContent 
} from "../../../../lib/profilDesaService";

export default function SejarahDesaAdminPage() {
  const router = useRouter();
  const [sejarahData, setSejarahData] = useState<SejarahContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    deskripsi: "",
    asalUsul: "",
    tahunBerdiri: "",
    hariJadi: "",
    tokohPendiri: "",
    perkembangan: "",
  });

  useEffect(() => {
    const loadSejarahData = async () => {
      try {
        const data = await getSejarahContent();
        setSejarahData(data);
      } catch (error) {
        console.error('Error loading sejarah data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSejarahData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToSejarahContent((data) => {
      setSejarahData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = () => {
    if (sejarahData) {
      setFormData({
        deskripsi: sejarahData.deskripsi,
        asalUsul: sejarahData.asalUsul,
        tahunBerdiri: sejarahData.tahunBerdiri,
        hariJadi: sejarahData.hariJadi,
        tokohPendiri: sejarahData.tokohPendiri,
        perkembangan: sejarahData.perkembangan,
      });
      setIsEditMode(true);
      setShowModal(true);
    }
  };

  const handleAdd = () => {
    setFormData({
      deskripsi: "",
      asalUsul: "",
      tahunBerdiri: "",
      hariJadi: "",
      tokohPendiri: "",
      perkembangan: "",
    });
    setSelectedFile(null);
    setIsEditMode(false);
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
      let fotoUrl = sejarahData?.fotoUrl || "";

      if (selectedFile) {
        fotoUrl = await uploadImageToStorage(selectedFile, "sejarah");
      }

      // Save with all required fields, use empty strings for missing data
      await saveSejarahContent({
        deskripsi: formData.deskripsi,
        asalUsul: formData.asalUsul || "",
        tahunBerdiri: formData.tahunBerdiri || "",
        hariJadi: formData.hariJadi || "",
        tokohPendiri: formData.tokohPendiri || "",
        perkembangan: formData.perkembangan || "",
        fotoUrl,
      });

      setShowModal(false);
      setSelectedFile(null);
      
      // Reset form
      setFormData({
        deskripsi: "",
        asalUsul: "",
        tahunBerdiri: "",
        hariJadi: "",
        tokohPendiri: "",
        perkembangan: "",
      });
    } catch (error) {
      console.error("Error saving sejarah data:", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Delete by saving empty data or clearing the document
      await saveSejarahContent({
        deskripsi: "",
        asalUsul: "",
        tahunBerdiri: "",
        hariJadi: "",
        tokohPendiri: "",
        perkembangan: "",
        fotoUrl: "",
      });
      
      setShowDeleteConfirm(false);
      setSejarahData(null);
    } catch (error) {
      console.error("Error deleting sejarah data:", error);
      alert("Terjadi kesalahan saat menghapus data.");
    } finally {
      setDeleting(false);
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data sejarah desa...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <AdminHeaderCard title="Kelola Sejarah Desa">
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

          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Sejarah Desa
                </h2>
                <div className="flex gap-3">
                  {sejarahData && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Hapus
                    </button>
                  )}
                  <button
                    onClick={sejarahData ? handleEdit : handleAdd}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {sejarahData ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      )}
                    </svg>
                    {sejarahData ? "Edit Sejarah" : "Tambah Sejarah"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {sejarahData ? (
                <div className="space-y-6">
                  {sejarahData.fotoUrl && (
                    <div className="text-center">
                      <img
                        src={sejarahData.fotoUrl}
                        alt="Sejarah Desa"
                        className="mx-auto max-w-full h-64 object-cover rounded-lg shadow"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Deskripsi
                      </h3>
                      <p className="text-gray-600">{sejarahData.deskripsi}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Asal Usul
                      </h3>
                      <p className="text-gray-600">{sejarahData.asalUsul}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Tahun Berdiri
                      </h3>
                      <p className="text-gray-600">{sejarahData.tahunBerdiri}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Hari Jadi
                      </h3>
                      <p className="text-gray-600">{sejarahData.hariJadi}</p>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Tokoh Pendiri
                      </h3>
                      <p className="text-gray-600">{sejarahData.tokohPendiri}</p>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Perkembangan
                      </h3>
                      <p className="text-gray-600">{sejarahData.perkembangan}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">
                    Belum ada data sejarah desa.
                  </p>
                  <button
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center mx-auto"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Tambah Sejarah Desa
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
            <div className="bg-white rounded-lg w-full max-w-2xl relative z-60 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {isEditMode ? "Edit Sejarah Desa" : "Buat Sejarah Desa"}
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Deskripsi Sejarah Desa */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-3">
                      Deskripsi Sejarah Desa
                    </label>
                    <textarea
                      value={formData.deskripsi}
                      onChange={(e) =>
                        setFormData({ ...formData, deskripsi: e.target.value })
                      }
                      placeholder="Masukkan Deskripsi Sejarah Desa"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-700 placeholder-gray-500"
                      rows={4}
                      required
                    />
                  </div>

                  {/* Asal Usul */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-3">
                      Asal Usul
                    </label>
                    <textarea
                      value={formData.asalUsul}
                      onChange={(e) =>
                        setFormData({ ...formData, asalUsul: e.target.value })
                      }
                      placeholder="Masukkan Asal Usul Desa"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-700 placeholder-gray-500"
                      rows={3}
                    />
                  </div>

                  {/* Tahun Berdiri */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-3">
                      Tahun Berdiri
                    </label>
                    <input
                      type="text"
                      value={formData.tahunBerdiri}
                      onChange={(e) =>
                        setFormData({ ...formData, tahunBerdiri: e.target.value })
                      }
                      placeholder="Masukkan Tahun Berdiri"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-700 placeholder-gray-500"
                    />
                  </div>

                  {/* Hari Jadi */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-3">
                      Hari Jadi
                    </label>
                    <input
                      type="text"
                      value={formData.hariJadi}
                      onChange={(e) =>
                        setFormData({ ...formData, hariJadi: e.target.value })
                      }
                      placeholder="Masukkan Hari Jadi (Tanggal)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-700 placeholder-gray-500"
                    />
                  </div>

                  {/* Tokoh Pendiri */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-3">
                      Tokoh Pendiri
                    </label>
                    <input
                      type="text"
                      value={formData.tokohPendiri}
                      onChange={(e) =>
                        setFormData({ ...formData, tokohPendiri: e.target.value })
                      }
                      placeholder="Masukkan Nama Tokoh Pendiri"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-700 placeholder-gray-500"
                    />
                  </div>

                  {/* Perkembangan */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-3">
                      Perkembangan
                    </label>
                    <textarea
                      value={formData.perkembangan}
                      onChange={(e) =>
                        setFormData({ ...formData, perkembangan: e.target.value })
                      }
                      placeholder="Masukkan Perkembangan Desa"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100 text-gray-700 placeholder-gray-500"
                      rows={3}
                    />
                  </div>

                  {/* Upload Foto */}
                  <div>
                    <label className="block text-base font-medium text-gray-800 mb-3">
                      Upload Foto
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg p-3 text-gray-500">
                        <span>{selectedFile ? selectedFile.name : "Tambah foto"}</span>
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
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {uploading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Menyimpan...
                        </div>
                      ) : (
                        isEditMode ? "Simpan Perubahan" : "Simpan"
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
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}></div>
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
                
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Apakah Anda Yakin Menghapus Data Ini?
                </h3>
                <p className="text-gray-600 mb-8">
                  Data sejarah desa akan dihapus secara permanen dan tidak dapat dipulihkan.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold transition-colors disabled:opacity-50"
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