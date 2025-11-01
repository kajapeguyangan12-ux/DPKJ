import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface LayananPublik {
  id?: string;
  jenisLayanan: string;
  judulSurat: string;
  namaLengkap: string;
  nik: string;
  noKK: string;
  alamat: string;
  noTelepon?: string;
  email?: string;
  keperluan?: string;
  tujuan?: string;
  tanggalPermohonan?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  agama?: string;
  pekerjaan?: string;
  kewarganegaraan?: string;
  statusPerkawinan?: string;
  namaAyah?: string;
  namaIbu?: string;
  namaPassangan?: string;
  tanggalKematian?: string;
  sebabKematian?: string;
  tempatKematian?: string;
  saksiSatu?: string;
  saksiDua?: string;
  dokumenPendukung?: string[];
  catatanTambahan?: string;
  status: 'pending' | 'diproses' | 'diterima' | 'ditolak' | 'selesai';
  alasanTolak?: string;
  catatanAdmin?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  processedBy?: string;
  processedAt?: Timestamp;
  userId: string;
}

export interface NotifikasiLayanan {
  id?: string;
  userId: string;
  layananId: string;
  jenisLayanan: string;
  judul: string;
  pesan: string;
  status: 'pending' | 'diproses' | 'diterima' | 'ditolak' | 'selesai';
  isRead: boolean;
  createdAt: Timestamp;
}

const COLLECTION_LAYANAN = "layanan-publik";
const COLLECTION_NOTIFIKASI = "notifikasi-layanan";

// Tambah permohonan layanan baru
export const addLayananPublik = async (data: Omit<LayananPublik, "id" | "createdAt" | "updatedAt" | "status">) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_LAYANAN), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Buat notifikasi untuk user
    await addNotifikasiLayanan({
      userId: data.userId,
      layananId: docRef.id,
      jenisLayanan: data.jenisLayanan,
      judul: `Permohonan ${data.jenisLayanan}`,
      pesan: `Permohonan ${data.jenisLayanan} Anda telah diterima dan sedang diproses.`,
      status: 'pending',
      isRead: false
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding layanan publik:", error);
    throw error;
  }
};

// Update status layanan
export const updateStatusLayanan = async (
  id: string, 
  status: LayananPublik['status'], 
  adminData: { 
    processedBy: string; 
    catatanAdmin?: string; 
    alasanTolak?: string; 
  }
) => {
  try {
    const docRef = doc(db, COLLECTION_LAYANAN, id);
    
    const updateData: any = {
      status,
      processedBy: adminData.processedBy,
      processedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (adminData.catatanAdmin) {
      updateData.catatanAdmin = adminData.catatanAdmin;
    }

    if (adminData.alasanTolak && status === 'ditolak') {
      updateData.alasanTolak = adminData.alasanTolak;
    }

    await updateDoc(docRef, updateData);

    // Ambil data layanan untuk notifikasi
    const layananData = await getLayananById(id);
    if (layananData) {
      // Buat notifikasi berdasarkan status
      let pesan = '';
      let judul = '';
      
      switch (status) {
        case 'diproses':
          judul = `${layananData.jenisLayanan} - Sedang Diproses`;
          pesan = `Permohonan ${layananData.jenisLayanan} Anda sedang diproses oleh petugas.`;
          break;
        case 'diterima':
          judul = `${layananData.jenisLayanan} - Diterima`;
          pesan = `Selamat! Permohonan ${layananData.jenisLayanan} Anda telah diterima.`;
          break;
        case 'ditolak':
          judul = `${layananData.jenisLayanan} - Ditolak`;
          pesan = `Maaf, permohonan ${layananData.jenisLayanan} Anda ditolak. ${adminData.alasanTolak ? 'Alasan: ' + adminData.alasanTolak : ''}`;
          break;
        case 'selesai':
          judul = `${layananData.jenisLayanan} - Selesai`;
          pesan = `Permohonan ${layananData.jenisLayanan} Anda telah selesai diproses. Silakan ambil dokumen di kantor desa.`;
          break;
      }

      await addNotifikasiLayanan({
        userId: layananData.userId,
        layananId: id,
        jenisLayanan: layananData.jenisLayanan,
        judul,
        pesan,
        status,
        isRead: false
      });
    }

    return true;
  } catch (error) {
    console.error("Error updating status layanan:", error);
    throw error;
  }
};

// Get semua layanan (untuk admin)
export const getAllLayananPublik = async (): Promise<LayananPublik[]> => {
  try {
    const q = query(collection(db, COLLECTION_LAYANAN), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LayananPublik[];
  } catch (error) {
    console.error("Error getting layanan publik:", error);
    throw error;
  }
};

// Get layanan by jenis untuk admin
export const getLayananByJenis = async (jenisLayanan: string): Promise<LayananPublik[]> => {
  try {
    // First try the optimized query with composite index
    try {
      const q = query(
        collection(db, COLLECTION_LAYANAN), 
        where("jenisLayanan", "==", jenisLayanan),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LayananPublik[];
    } catch (indexError) {
      console.warn("Composite index not available for layanan by jenis, falling back to simple query:", indexError);
      
      // Fallback: Use simple query without orderBy
      const q = query(
        collection(db, COLLECTION_LAYANAN), 
        where("jenisLayanan", "==", jenisLayanan)
      );
      const querySnapshot = await getDocs(q);
      
      const layananData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LayananPublik[];
      
      // Sort manually in JavaScript
      return layananData.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime; // desc order
      });
    }
  } catch (error) {
    console.error("Error getting layanan by jenis:", error);
    return []; // Return empty array instead of throwing
  }
};

// Get layanan by user (untuk masyarakat)
export const getLayananByUser = async (userId: string): Promise<LayananPublik[]> => {
  try {
    // First try the optimized query with composite index
    try {
      const q = query(
        collection(db, COLLECTION_LAYANAN), 
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LayananPublik[];
    } catch (indexError) {
      console.warn("Composite index not available, falling back to simple query:", indexError);
      
      // Fallback: Use simple query without orderBy
      const q = query(
        collection(db, COLLECTION_LAYANAN), 
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      
      const layananData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LayananPublik[];
      
      // Sort manually in JavaScript
      return layananData.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime; // desc order
      });
    }
  } catch (error) {
    console.error("Error getting layanan by user:", error);
    return []; // Return empty array instead of throwing
  }
};

// Get single layanan by ID
export const getLayananById = async (id: string): Promise<LayananPublik | null> => {
  try {
    const docRef = doc(db, COLLECTION_LAYANAN, id);
    const docSnap = await getDocs(query(collection(db, COLLECTION_LAYANAN), where("__name__", "==", id)));
    
    if (!docSnap.empty) {
      const doc = docSnap.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as LayananPublik;
    }
    return null;
  } catch (error) {
    console.error("Error getting layanan by ID:", error);
    throw error;
  }
};

// Tambah notifikasi
export const addNotifikasiLayanan = async (data: Omit<NotifikasiLayanan, "id" | "createdAt">) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NOTIFIKASI), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding notifikasi:", error);
    throw error;
  }
};

// Get notifikasi by user
export const getNotifikasiByUser = async (userId: string): Promise<NotifikasiLayanan[]> => {
  try {
    // First try the optimized query with composite index
    try {
      const q = query(
        collection(db, COLLECTION_NOTIFIKASI), 
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotifikasiLayanan[];
    } catch (indexError) {
      console.warn("Composite index not available for notifikasi, falling back to simple query:", indexError);
      
      // Fallback: Use simple query without orderBy
      const q = query(
        collection(db, COLLECTION_NOTIFIKASI), 
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      
      const notifikasiData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotifikasiLayanan[];
      
      // Sort manually in JavaScript
      return notifikasiData.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime; // desc order
      });
    }
  } catch (error) {
    console.error("Error getting notifikasi:", error);
    return []; // Return empty array instead of throwing
  }
};

// Mark notifikasi as read
export const markNotifikasiAsRead = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NOTIFIKASI, id);
    await updateDoc(docRef, {
      isRead: true
    });
    return true;
  } catch (error) {
    console.error("Error marking notifikasi as read:", error);
    throw error;
  }
};

// Subscribe to layanan real-time (untuk admin)
export const subscribeToLayanan = (callback: (layanan: LayananPublik[]) => void) => {
  const q = query(collection(db, COLLECTION_LAYANAN), orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const layanan = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as LayananPublik[];
    
    callback(layanan);
  });
};

// Subscribe to notifikasi real-time (untuk masyarakat)
export const subscribeToNotifikasi = (userId: string, callback: (notifikasi: NotifikasiLayanan[]) => void) => {
  // Try with composite index first, fallback to simple query if needed
  let q;
  
  try {
    // Primary query with composite index
    q = query(
      collection(db, COLLECTION_NOTIFIKASI), 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
  } catch (indexError) {
    console.warn("Using simple query for notifikasi subscription:", indexError);
    // Fallback to simple query
    q = query(
      collection(db, COLLECTION_NOTIFIKASI), 
      where("userId", "==", userId)
    );
  }
  
  return onSnapshot(q, (snapshot) => {
    let notifikasi = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as NotifikasiLayanan[];
    
    // Sort manually if we used the simple query
    if (!q.toString().includes('orderBy')) {
      notifikasi = notifikasi.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime; // desc order
      });
    }
    
    callback(notifikasi);
  }, (error) => {
    console.error("Error in notifikasi subscription:", error);
    // If the subscription fails, try with simple query
    const fallbackQ = query(
      collection(db, COLLECTION_NOTIFIKASI), 
      where("userId", "==", userId)
    );
    
    return onSnapshot(fallbackQ, (snapshot) => {
      const notifikasi = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotifikasiLayanan[];
      
      // Sort manually
      const sortedNotifikasi = notifikasi.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime; // desc order
      });
      
      callback(sortedNotifikasi);
    });
  });
};

// Get statistik layanan untuk admin dashboard
export const getLayananStats = async () => {
  try {
    const allLayanan = await getAllLayananPublik();
    
    const stats = {
      total: allLayanan.length,
      pending: allLayanan.filter(l => l.status === 'pending').length,
      diproses: allLayanan.filter(l => l.status === 'diproses').length,
      diterima: allLayanan.filter(l => l.status === 'diterima').length,
      ditolak: allLayanan.filter(l => l.status === 'ditolak').length,
      selesai: allLayanan.filter(l => l.status === 'selesai').length,
      byJenis: {} as Record<string, number>
    };

    // Statistik per jenis layanan
    allLayanan.forEach(layanan => {
      if (stats.byJenis[layanan.jenisLayanan]) {
        stats.byJenis[layanan.jenisLayanan]++;
      } else {
        stats.byJenis[layanan.jenisLayanan] = 1;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error getting layanan stats:", error);
    throw error;
  }
};

// Delete layanan (untuk admin)
export const deleteLayanan = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_LAYANAN, id));
    return true;
  } catch (error) {
    console.error("Error deleting layanan:", error);
    throw error;
  }
};

// Alias untuk getUserSubmissions (untuk riwayat)
export const getUserSubmissions = async (userId: string) => {
  return await getLayananByUser(userId);
};

export default {
  addLayananPublik,
  updateStatusLayanan,
  getAllLayananPublik,
  getLayananByJenis,
  getLayananByUser,
  getUserSubmissions,
  getLayananById,
  addNotifikasiLayanan,
  getNotifikasiByUser,
  markNotifikasiAsRead,
  subscribeToLayanan,
  subscribeToNotifikasi,
  getLayananStats,
  deleteLayanan
};