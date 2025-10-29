"use client";
import React, { useState, useEffect, useRef } from "react";
import { db, storage } from "../../../../lib/firebase";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface PengumumanItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt?: string;
}

function PengumumanFormModal({ open, onClose, onSubmit, editingItem }: { open: boolean; onClose: () => void; onSubmit: (data: { title: string; description: string; image: File | null }) => void; editingItem?: PengumumanItem | null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description);
      setPreview(editingItem.imageUrl || null);
      setImage(null);
    } else {
      setTitle("");
      setDescription("");
      setImage(null);
      setPreview(null);
    }
  }, [editingItem, open]);

  useEffect(() => {
    if (!image) {
      if (!editingItem?.imageUrl) {
        setPreview(null);
      }
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl p-10 max-h-[90vh] overflow-y-auto animate-pop">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{editingItem ? 'Edit Pengumuman' : 'Formulir Buat Pengumuman'}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors hover:bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center"
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({ title, description, image });
            setTitle("");
            setDescription("");
            setImage(null);
            setPreview(null);
          }}
          className="space-y-7"
        >
          {/* Judul */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">Judul</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Masukkan Judul Pengumuman"
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-red-500 focus:bg-white transition-colors text-gray-800 text-base"
              required
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">Deskripsi</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Masukkan Deskripsi Pengumuman"
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-red-500 focus:bg-white transition-colors text-gray-800 text-base min-h-[120px] resize-none"
              required
            />
          </div>

          {/* Upload Foto */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">Upload Foto (webp)</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-3 px-5 py-5 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:border-red-500 hover:bg-red-50 transition-colors"
            >
              {preview ? (
                <div className="flex items-center gap-3">
                  <img src={preview} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800">Foto dipilih</p>
                    <p className="text-xs text-gray-500">Klik untuk mengganti</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-gray-400">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-600">Tambah foto</span>
                </div>
              )}
            </button>
            <input
              type="file"
              accept="image/webp"
              ref={fileInputRef}
              onChange={e => {
                const file = e.target.files?.[0] || null;
                setImage(file);
              }}
              className="hidden"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-base"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 text-base"
            >
              {editingItem ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PengumumanList() {
  const [items, setItems] = useState<PengumumanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PengumumanItem | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "e-news_pengumuman"));
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PengumumanItem));
        if (mounted) setItems(docs);
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Hapus Pengumuman ini?")) return;
    try {
      await deleteDoc(doc(db, "e-news_pengumuman", id));
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      alert("Gagal menghapus Pengumuman");
    }
  }

  function handleEdit(item: PengumumanItem) {
    setEditingItem(item);
    setShowModal(true);
  }

  async function handleCreatePengumuman(data: { title: string; description: string; image: File | null }) {
    try {
      let imageUrl = editingItem?.imageUrl || "";
      
      if (data.image) {
        const storageRef = ref(storage, `pengumuman/${Date.now()}_${data.image.name}`);
        await uploadBytes(storageRef, data.image);
        imageUrl = await getDownloadURL(storageRef);
      }
      
      const docData = {
        title: data.title,
        description: data.description,
        imageUrl,
        createdAt: editingItem?.createdAt || new Date().toISOString(),
      };

      if (editingItem) {
        // Update existing
        const docRef = doc(db, "e-news_pengumuman", editingItem.id);
        const { updateDoc } = await import("firebase/firestore");
        await updateDoc(docRef, docData);
        setItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? { ...item, ...docData } : item))
        );
        alert('Pengumuman berhasil diperbarui!');
      } else {
        // Create new
        await addDoc(collection(db, "e-news_pengumuman"), docData);
        alert('Pengumuman berhasil disimpan!');
        // Reload items
        const snap = await getDocs(collection(db, "e-news_pengumuman"));
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PengumumanItem));
        setItems(docs);
      }

      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan saat menyimpan pengumuman');
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Pengumuman</h2>
        <button
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
        >
          <span>Buat Pengumuman</span>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
      <PengumumanFormModal open={showModal} onClose={() => { setShowModal(false); setEditingItem(null); }} onSubmit={handleCreatePengumuman} editingItem={editingItem} />
      {loading ? (
        <div className="text-gray-500 text-center py-8">Memuat data...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 text-center py-8">Belum ada Pengumuman.</div>
      ) : (
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.id} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg p-6 flex gap-6 items-center transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="Foto" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-400 font-medium">Foto</span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-500 mt-1">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : "Tanggal Upload"}</div>
                <div className="text-sm text-gray-700 mt-2 line-clamp-2">{item.description}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleEdit(item)}
                  className="px-5 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors font-medium hover:scale-105 transform"
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center gap-2 transition-all font-medium shadow-sm hover:scale-105 transform">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6v14h8V6"/><path d="M10 10v6"/><path d="M14 10v6"/></svg>
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
