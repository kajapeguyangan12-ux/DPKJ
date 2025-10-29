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
  setDoc,
  getDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from './firebase';

export interface ProfilDesaData {
  id: string;
  wilayah: {
    namaDesa: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    kodePos: string;
    luasWilayah: string;
    batasUtara: string;
    batasSelatan: string;
    batasTimur: string;
    batasBarat: string;
    koordinat: {
      latitude: string;
      longitude: string;
    };
    jumlahDusun: string;
    jumlahRW: string;
    jumlahRT: string;
    deskripsi?: string;
    fotoUrl?: string;
    dusunData?: Array<{
      namaDusun: string;
      luasDusun: string;
      garisKeliling: string;
    }>;
  };
  sejarah: {
    asalUsul: string;
    tahunBerdiri: string;
    hariJadi: string;
    tokohPendiri: string;
    perkembangan: string;
  };
  visiMisi: {
    visi: string;
    misi: string[];
  };
  struktur: {
    kepalaDesa: string;
    sekretaris: string;
    bendahara: string;
    kaur: {
      pemerintahan: string;
      pembangunan: string;
      pemberdayaan: string;
      keuangan: string;
      umum: string;
    };
    kadus: string[];
  };
  lembaga: {
    bpd: {
      ketua: string;
      wakil: string;
      anggota: string[];
    };
    lpmd: {
      ketua: string;
      sekretaris: string;
      bendahara: string;
      anggota: string[];
    };
    pkk: {
      ketua: string;
      wakil: string;
      sekretaris: string;
      bendahara: string;
      anggota: string[];
    };
    karangTaruna: {
      ketua: string;
      wakil: string;
      sekretaris: string;
      bendahara: string;
      anggota: string[];
    };
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const PROFIL_DESA_COLLECTION = 'profil-desa';
const WILAYAH_COLLECTION = 'wilayah';
const SEJARAH_COLLECTION = 'sejarah';
const VISI_MISI_COLLECTION = 'visi-misi';
const STRUKTUR_COLLECTION = 'struktur-pemerintahaan';

export interface WilayahDusunEntry {
  namaDusun: string;
  luasDusun: string;
  garisKeliling: string;
}

export interface WilayahContent {
  id: string;
  deskripsi: string;
  fotoUrl: string;
  dusunData: WilayahDusunEntry[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface SejarahContent {
  id: string;
  deskripsi: string;
  asalUsul: string;
  tahunBerdiri: string;
  hariJadi: string;
  tokohPendiri: string;
  perkembangan: string;
  fotoUrl: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface VisiMisiContent {
  id: string;
  visi: string;
  misi: string;
  fotoUrl: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface StrukturPemerintahaan {
  id: string;
  nama: string;
  jabatan: string;
  foto: string;
  deskripsi?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface StrukturPemerintahaanCollection {
  items: StrukturPemerintahaan[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Get profil desa data
export const getProfilDesa = async (): Promise<ProfilDesaData | null> => {
  try {
    const docRef = doc(db, PROFIL_DESA_COLLECTION, 'main');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as ProfilDesaData;
    }
    return null;
  } catch (error) {
    console.error('Error getting profil desa:', error);
    throw error;
  }
};

// Create or update profil desa
export const saveProfilDesa = async (data: Omit<ProfilDesaData, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = doc(db, PROFIL_DESA_COLLECTION, 'main');
    await setDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    }, { merge: true });
    return 'main';
  } catch (error) {
    console.error('Error saving profil desa:', error);
    throw error;
  }
};

// Subscribe to profil desa changes
export const subscribeToProfilDesa = (callback: (data: ProfilDesaData | null) => void) => {
  const docRef = doc(db, PROFIL_DESA_COLLECTION, 'main');

  return onSnapshot(
    docRef,
    (doc) => {
      if (doc.exists()) {
        callback({
          id: doc.id,
          ...doc.data()
        } as ProfilDesaData);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to profil desa:', error);
      callback(null);
    }
  );
};

// Upload image to Firebase Storage
export const uploadImageToStorage = async (file: File, fileName: string): Promise<string> => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `profil-desa/${fileName}`);

    // Convert to WebP first
    const webpBlob = await convertToWebP(file);
    const webpFile = new File([webpBlob], fileName.replace(/\.[^/.]+$/, '.webp'), { type: 'image/webp' });

    const snapshot = await uploadBytes(storageRef, webpFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Helper function to convert image to WebP
const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.createElement('img') as HTMLImageElement;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert image to WebP'));
        }
      }, 'image/webp', 0.8);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

const normaliseDusunData = (value: unknown): WilayahDusunEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    if (typeof item !== 'object' || item === null) {
      return {
        namaDusun: '',
        luasDusun: '',
        garisKeliling: '',
      };
    }

    const entry = item as Record<string, unknown>;

    return {
      namaDusun: typeof entry.namaDusun === 'string' ? entry.namaDusun : '',
      luasDusun: typeof entry.luasDusun === 'string' ? entry.luasDusun : '',
      garisKeliling: typeof entry.garisKeliling === 'string' ? entry.garisKeliling : '',
    };
  });
};

export const getWilayahContent = async (): Promise<WilayahContent | null> => {
  try {
    const docRef = doc(db, WILAYAH_COLLECTION, 'main');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();

    return {
      id: docSnap.id,
      deskripsi: typeof data.deskripsi === 'string' ? data.deskripsi : '',
      fotoUrl: typeof data.fotoUrl === 'string' ? data.fotoUrl : '',
      dusunData: normaliseDusunData(data.dusunData),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error('Error getting wilayah content:', error);
    throw error;
  }
};

export const saveWilayahContent = async (content: Omit<WilayahContent, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = doc(db, WILAYAH_COLLECTION, 'main');
    const snapshot = await getDoc(docRef);
    const now = Timestamp.now();

    const payload: Record<string, unknown> = {
      deskripsi: content.deskripsi,
      fotoUrl: content.fotoUrl,
      dusunData: content.dusunData ?? [],
      updatedAt: now,
    };

    if (!snapshot.exists()) {
      payload.createdAt = now;
    }

    await setDoc(docRef, payload, { merge: true });
    return 'main';
  } catch (error) {
    console.error('Error saving wilayah content:', error);
    throw error;
  }
};

export const subscribeToWilayahContent = (callback: (data: WilayahContent | null) => void) => {
  const docRef = doc(db, WILAYAH_COLLECTION, 'main');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          id: docSnap.id,
          deskripsi: typeof data.deskripsi === 'string' ? data.deskripsi : '',
          fotoUrl: typeof data.fotoUrl === 'string' ? data.fotoUrl : '',
          dusunData: normaliseDusunData(data.dusunData),
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to wilayah content:', error);
      callback(null);
    }
  );
};

// Sejarah Desa Functions
export const getSejarahContent = async (): Promise<SejarahContent | null> => {
  try {
    const docRef = doc(db, SEJARAH_COLLECTION, 'main');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();

    return {
      id: docSnap.id,
      deskripsi: typeof data.deskripsi === 'string' ? data.deskripsi : '',
      asalUsul: typeof data.asalUsul === 'string' ? data.asalUsul : '',
      tahunBerdiri: typeof data.tahunBerdiri === 'string' ? data.tahunBerdiri : '',
      hariJadi: typeof data.hariJadi === 'string' ? data.hariJadi : '',
      tokohPendiri: typeof data.tokohPendiri === 'string' ? data.tokohPendiri : '',
      perkembangan: typeof data.perkembangan === 'string' ? data.perkembangan : '',
      fotoUrl: typeof data.fotoUrl === 'string' ? data.fotoUrl : '',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error('Error getting sejarah content:', error);
    throw error;
  }
};

export const saveSejarahContent = async (content: Omit<SejarahContent, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = doc(db, SEJARAH_COLLECTION, 'main');
    const snapshot = await getDoc(docRef);
    const now = Timestamp.now();

    const payload: Record<string, unknown> = {
      deskripsi: content.deskripsi,
      asalUsul: content.asalUsul,
      tahunBerdiri: content.tahunBerdiri,
      hariJadi: content.hariJadi,
      tokohPendiri: content.tokohPendiri,
      perkembangan: content.perkembangan,
      fotoUrl: content.fotoUrl,
      updatedAt: now,
    };

    if (!snapshot.exists()) {
      payload.createdAt = now;
    }

    await setDoc(docRef, payload, { merge: true });
    return 'main';
  } catch (error) {
    console.error('Error saving sejarah content:', error);
    throw error;
  }
};

export const subscribeToSejarahContent = (callback: (data: SejarahContent | null) => void) => {
  const docRef = doc(db, SEJARAH_COLLECTION, 'main');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          id: docSnap.id,
          deskripsi: typeof data.deskripsi === 'string' ? data.deskripsi : '',
          asalUsul: typeof data.asalUsul === 'string' ? data.asalUsul : '',
          tahunBerdiri: typeof data.tahunBerdiri === 'string' ? data.tahunBerdiri : '',
          hariJadi: typeof data.hariJadi === 'string' ? data.hariJadi : '',
          tokohPendiri: typeof data.tokohPendiri === 'string' ? data.tokohPendiri : '',
          perkembangan: typeof data.perkembangan === 'string' ? data.perkembangan : '',
          fotoUrl: typeof data.fotoUrl === 'string' ? data.fotoUrl : '',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to sejarah content:', error);
      callback(null);
    }
  );
};

export const deleteSejarahContent = async () => {
  try {
    const docRef = doc(db, SEJARAH_COLLECTION, 'main');
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting sejarah content:', error);
    throw error;
  }
};

// Visi & Misi Desa Functions
export const getVisiMisiContent = async (): Promise<VisiMisiContent | null> => {
  try {
    const docRef = doc(db, VISI_MISI_COLLECTION, 'main');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();

    return {
      id: docSnap.id,
      visi: typeof data.visi === 'string' ? data.visi : '',
      misi: typeof data.misi === 'string' ? data.misi : '',
      fotoUrl: typeof data.fotoUrl === 'string' ? data.fotoUrl : '',
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    console.error('Error getting visi misi content:', error);
    throw error;
  }
};

export const saveVisiMisiContent = async (content: Omit<VisiMisiContent, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = doc(db, VISI_MISI_COLLECTION, 'main');
    const snapshot = await getDoc(docRef);
    const now = Timestamp.now();

    const payload: Record<string, unknown> = {
      visi: content.visi,
      misi: content.misi,
      fotoUrl: content.fotoUrl,
      updatedAt: now,
    };

    if (!snapshot.exists()) {
      payload.createdAt = now;
    }

    await setDoc(docRef, payload, { merge: true });
    return 'main';
  } catch (error) {
    console.error('Error saving visi misi content:', error);
    throw error;
  }
};

export const subscribeToVisiMisiContent = (callback: (data: VisiMisiContent | null) => void) => {
  const docRef = doc(db, VISI_MISI_COLLECTION, 'main');

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          id: docSnap.id,
          visi: typeof data.visi === 'string' ? data.visi : '',
          misi: typeof data.misi === 'string' ? data.misi : '',
          fotoUrl: typeof data.fotoUrl === 'string' ? data.fotoUrl : '',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error subscribing to visi misi content:', error);
      callback(null);
    }
  );
};

export const deleteVisiMisiContent = async () => {
  try {
    const docRef = doc(db, VISI_MISI_COLLECTION, 'main');
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting visi misi content:', error);
    throw error;
  }
};

// Struktur Pemerintahaan Functions
export const getStrukturPemerintahaan = async (): Promise<StrukturPemerintahaan[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, STRUKTUR_COLLECTION));
    const items: StrukturPemerintahaan[] = [];
    
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        nama: doc.data().nama || '',
        jabatan: doc.data().jabatan || '',
        foto: doc.data().foto || '',
        deskripsi: doc.data().deskripsi || '',
        createdAt: doc.data().createdAt,
        updatedAt: doc.data().updatedAt,
      });
    });

    return items;
  } catch (error) {
    console.error('Error getting struktur pemerintahaan:', error);
    throw error;
  }
};

export const addStrukturPemerintahaan = async (data: Omit<StrukturPemerintahaan, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, STRUKTUR_COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding struktur pemerintahaan:', error);
    throw error;
  }
};

export const updateStrukturPemerintahaan = async (id: string, data: Omit<StrukturPemerintahaan, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = doc(db, STRUKTUR_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating struktur pemerintahaan:', error);
    throw error;
  }
};

export const deleteStrukturPemerintahaan = async (id: string) => {
  try {
    const docRef = doc(db, STRUKTUR_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting struktur pemerintahaan:', error);
    throw error;
  }
};

export const subscribeToStrukturPemerintahaan = (callback: (data: StrukturPemerintahaan[]) => void) => {
  const collectionRef = collection(db, STRUKTUR_COLLECTION);
  const q = query(collectionRef, orderBy('updatedAt', 'desc'));

  return onSnapshot(
    q,
    (querySnapshot) => {
      const items: StrukturPemerintahaan[] = [];
      
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          nama: doc.data().nama || '',
          jabatan: doc.data().jabatan || '',
          foto: doc.data().foto || '',
          deskripsi: doc.data().deskripsi || '',
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt,
        });
      });

      callback(items);
    },
    (error) => {
      console.error('Error subscribing to struktur pemerintahaan:', error);
      callback([]);
    }
  );
};
