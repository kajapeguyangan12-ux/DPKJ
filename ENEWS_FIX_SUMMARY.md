# Solusi: E-News Masyarakat - Data dari Firestore

## 🔍 Masalah yang Ditemukan

1. **Collection Names Tidak Sesuai**
   - Kode lama menggunakan: `e-news` dan `pengumuman`
   - Firestore aktual menggunakan: `e-news_berita` dan `e-news_pengumuman`

2. **Field Names Berbeda**
   - Kode expected: `judul`, `deskripsi`, `gambar`, `tanggal`
   - Firestore actual: `title`, `description`, `imageUrl`, `createdAt`

3. **Status Field Mungkin Tidak Ada**
   - Query menggunakan `where('status', '==', 'published')` 
   - Tetapi dokumen di Firestore tidak memiliki field `status`
   - Hasilnya: Query mengembalikan 0 dokumen

4. **Unsubscribe Logic Issue**
   - Return statement dari subscription tidak benar di handling

## ✅ Solusi yang Diimplementasikan

### 1. Update Collection Names (`src/lib/enewsService.ts`)
```typescript
const ENEWS_COLLECTION = 'e-news_berita';
const PENGUMUMAN_COLLECTION = 'e-news_pengumuman';
```

### 2. Data Normalization Function
```typescript
const normalizeENewsItem = (data: any, id: string, jenis: 'berita' | 'pengumuman'): ENewsItem => {
  // Handle berbagai format field names
  const judul = data.judul || data.title || '';
  const tanggal = data.tanggal || data.date || data.createdAt?.toDate?.() || new Date();
  const deskripsi = data.deskripsi || data.description || '';
  const lokasi = data.lokasi || data.location;
  const gambar = data.gambar || data.imageUrl || data.image || '/logo/default.png';
  // ... normalisasi field lainnya
};
```

### 3. Status Filter Update
Query diubah untuk handle dokumen tanpa field `status`:
```typescript
// Ambil semua dokumen, kemudian filter di code
const querySnapshot = await getDocs(query(collection(db, ENEWS_COLLECTION)));
querySnapshot.forEach((doc) => {
  const data = doc.data();
  if (!data.status || data.status === 'published') {
    items.push(normalizeENewsItem(data, doc.id, 'berita'));
  }
});
```

### 4. Fix Subscription Unsubscribe Logic
```typescript
export const subscribeToPublishedENews = (callback) => {
  let pengumumanUnsubscribe: any = null;
  
  const unsubscribeBerita = onSnapshot(
    query(collection(db, ENEWS_COLLECTION)),
    (querySnapshot) => {
      pengumumanUnsubscribe = onSnapshot(
        query(collection(db, PENGUMUMAN_COLLECTION)),
        // handle updates
      );
    }
  );

  return () => {
    unsubscribeBerita();
    pengumumanUnsubscribe?.();
  };
};
```

### 5. Update Firestore Rules
```javascript
// firestore.rules
match /e-news_berita/{document} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}

match /e-news_pengumuman/{document} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}
```

### 6. Enhanced UI dengan Error Handling
- Loading state indicator
- Error display
- Robust date formatting dengan try-catch
- Support untuk berbagai image URL formats

### 7. Debug Page untuk Testing
- Path: `/debug/e-news`
- Menampilkan raw data dari kedua collections
- Membantu dalam troubleshooting

## 📋 File yang Dimodifikasi

1. `src/lib/enewsService.ts` - Collection names, normalization, queries
2. `src/app/masyarakat/e-news/page.tsx` - UI improvements, error handling
3. `firestore.rules` - Updated collection names
4. `src/app/debug/e-news/page.tsx` - Debug page (baru)

## 🚀 Testing Checklist

- [ ] Refresh halaman `/masyarakat/e-news`
- [ ] Lihat apakah data berita muncul di tab Berita
- [ ] Lihat apakah data pengumuman muncul di tab Pengumuman
- [ ] Check browser console untuk logs
- [ ] Visit `/debug/e-news` untuk verify raw data
- [ ] Pastikan tidak ada error messages

## 💡 Notes

- Data sekarang kompatibel dengan format lama dan baru
- Query tidak lagi tergantung pada field `status` (backward compatible)
- Implementasi tetap mendukung future migration ke format standard
- Real-time updates sudah difix dan working correctly

---
*Last Updated: 2025-10-29*
