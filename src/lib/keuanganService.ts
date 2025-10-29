import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export interface KeuanganData {
  id: string;
  judul: string;
  tanggal: string;
  keterangan: string;
  jenis: "pemasukan" | "pengeluaran";
  jumlah: number;
  kategori: "gaji" | "bantuan" | "infrastruktur" | "operasional" | "lainnya";
  bukti?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface APBData {
  id: string;
  judul: string;
  kategori: "pendapatan" | "belanja" | "pembiayaan";
  pendapatan: {
    formulir: string;
    realisasi: string;
    kurang: string;
  };
  belanja: {
    formulir: string;
    realisasi: string;
    kurang: string;
  };
  pembiayaan: {
    formulir: string;
    realisasi: string;
    kurang: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface KeuanganStats {
  totalPemasukan: number;
  totalPengeluaran: number;
  saldo: number;
  totalTransaksi: number;
}

// Get all keuangan data from Firestore
export const getKeuangan = async (): Promise<KeuanganData[]> => {
  try {
    const q = query(collection(db, "keuangan"), orderBy("tanggal", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as KeuanganData[];
  } catch (error) {
    console.error("Error getting keuangan data:", error);
    return [];
  }
};

// Real-time subscription to keuangan data
export const subscribeToKeuangan = (callback: (data: KeuanganData[]) => void): (() => void) => {
  const q = query(collection(db, "keuangan"), orderBy("tanggal", "desc"));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as KeuanganData[];
    
    callback(data);
  });

  return unsubscribe;
};

// Add new keuangan entry
export const addKeuangan = async (data: Omit<KeuanganData, "id" | "createdAt" | "updatedAt">): Promise<void> => {
  try {
    await addDoc(collection(db, "keuangan"), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding keuangan:", error);
    throw error;
  }
};

// Update keuangan entry
export const updateKeuangan = async (id: string, data: Partial<KeuanganData>): Promise<void> => {
  try {
    const keuanganRef = doc(db, "keuangan", id);
    await updateDoc(keuanganRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating keuangan:", error);
    throw error;
  }
};

// Delete keuangan entry
export const deleteKeuangan = async (id: string): Promise<void> => {
  try {
    const keuanganRef = doc(db, "keuangan", id);
    await deleteDoc(keuanganRef);
  } catch (error) {
    console.error("Error deleting keuangan:", error);
    throw error;
  }
};

// Get statistics
export const getKeuanganStats = async (): Promise<KeuanganStats> => {
  try {
    const data = await getKeuangan();
    
    const totalPemasukan = data
      .filter((item) => item.jenis === "pemasukan")
      .reduce((sum, item) => sum + item.jumlah, 0);
    
    const totalPengeluaran = data
      .filter((item) => item.jenis === "pengeluaran")
      .reduce((sum, item) => sum + item.jumlah, 0);
    
    const saldo = totalPemasukan - totalPengeluaran;
    const totalTransaksi = data.length;

    return {
      totalPemasukan,
      totalPengeluaran,
      saldo,
      totalTransaksi,
    };
  } catch (error) {
    console.error("Error getting keuangan stats:", error);
    return {
      totalPemasukan: 0,
      totalPengeluaran: 0,
      saldo: 0,
      totalTransaksi: 0,
    };
  }
};

// ===== APB FUNCTIONS =====

// Get all APB data from Firestore
export const getAPB = async (): Promise<APBData[]> => {
  try {
    const q = query(collection(db, "apb"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as APBData[];
  } catch (error) {
    console.error("Error getting APB data:", error);
    return [];
  }
};

// Real-time subscription to APB data
export const subscribeToAPB = (callback: (data: APBData[]) => void): (() => void) => {
  const q = query(collection(db, "apb"), orderBy("createdAt", "desc"));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as APBData[];
    
    callback(data);
  });

  return unsubscribe;
};

// Add new APB entry
export const addAPB = async (data: Omit<APBData, "id" | "createdAt" | "updatedAt">): Promise<void> => {
  try {
    await addDoc(collection(db, "apb"), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding APB:", error);
    throw error;
  }
};

// Update APB entry
export const updateAPB = async (id: string, data: Partial<APBData>): Promise<void> => {
  try {
    const apbRef = doc(db, "apb", id);
    await updateDoc(apbRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating APB:", error);
    throw error;
  }
};

// Delete APB entry
export const deleteAPB = async (id: string): Promise<void> => {
  try {
    const apbRef = doc(db, "apb", id);
    await deleteDoc(apbRef);
  } catch (error) {
    console.error("Error deleting APB:", error);
    throw error;
  }
};
