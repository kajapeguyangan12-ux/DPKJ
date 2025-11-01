# Firestore Index Configuration

## Overview
Sistem telah dikonfigurasi dengan fallback query untuk menangani masalah composite index yang belum tersedia. Namun, untuk performa optimal, disarankan untuk membuat composite index.

## Required Composite Indexes

### 1. Layanan Publik Collection (`layanan-publik`)

#### Index untuk Query berdasarkan User
```
Collection: layanan-publik
Fields indexed:
- userId (Ascending)
- createdAt (Descending)
```

#### Index untuk Query berdasarkan Jenis Layanan
```
Collection: layanan-publik
Fields indexed:
- jenisLayanan (Ascending)
- createdAt (Descending)
```

### 2. Notifikasi Collection (`notifikasi-layanan`)

#### Index untuk Query berdasarkan User
```
Collection: notifikasi-layanan
Fields indexed:
- userId (Ascending)
- createdAt (Descending)
```

## Cara Membuat Index

### Method 1: Otomatis melalui Error URL
Ketika error muncul, Firebase menyediakan URL langsung untuk membuat index:
```
https://console.firebase.google.com/v1/r/project/dpkj-ffc01/firestore/indexes?create_composite=...
```

### Method 2: Manual melalui Firebase Console
1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project `dpkj-ffc01`
3. Pergi ke Firestore Database → Indexes
4. Klik "Create Index"
5. Pilih collection dan field sesuai konfigurasi di atas

### Method 3: Menggunakan Firebase CLI
```bash
# Install Firebase CLI jika belum ada
npm install -g firebase-tools

# Login ke Firebase
firebase login

# Deploy firestore rules dan indexes
firebase deploy --only firestore:indexes
```

## Fallback Strategy

Sistem telah dikonfigurasi dengan strategi fallback:

1. **Primary Query**: Menggunakan composite index (where + orderBy)
2. **Fallback Query**: Menggunakan simple query (where saja) 
3. **Client-side Sorting**: Data disort di JavaScript jika composite index tidak tersedia

## Code Implementation

### Service Layer (`layananPublikService.ts`)
```typescript
// Contoh implementasi fallback
try {
  // Try optimized query first
  const q = query(
    collection(db, COLLECTION_LAYANAN), 
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const result = await getDocs(q);
  return processResults(result);
} catch (indexError) {
  // Fallback to simple query
  const simpleQ = query(
    collection(db, COLLECTION_LAYANAN), 
    where("userId", "==", userId)
  );
  const result = await getDocs(simpleQ);
  return sortManually(processResults(result));
}
```

## Benefits of Creating Indexes

### Performance
- **Faster Queries**: Composite index memberikan performa query yang optimal
- **Lower Latency**: Pengurangan waktu response untuk data loading
- **Better Scalability**: Handling data dalam jumlah besar lebih efisien

### User Experience
- **Faster Loading**: Data riwayat dan notifikasi load lebih cepat
- **Smooth Navigation**: Transisi antar halaman lebih smooth
- **Real-time Updates**: Subscription real-time lebih responsif

## Current Status

✅ **Fallback Implementation**: Sistem dapat berjalan tanpa composite index
⚠️ **Performance**: Performa akan lebih baik dengan composite index
🔄 **Auto-Recovery**: Sistem otomatis beralih ke simple query jika terjadi error

## Recommendations

1. **Immediate**: Sistem sudah bisa digunakan dengan fallback query
2. **Short-term**: Buat composite index melalui URL yang disediakan Firebase
3. **Long-term**: Setup Firebase CLI untuk automated index management

## Error Handling

Semua function telah dilengkapi dengan:
- ✅ Try-catch untuk composite index
- ✅ Fallback ke simple query
- ✅ Client-side sorting
- ✅ Empty array return untuk prevent crash
- ✅ Console warning untuk debugging

## Testing

Untuk test apakah system bekerja:
1. Buka halaman `/masyarakat/riwayat`
2. Buka halaman `/masyarakat/notifikasi`
3. Check browser console untuk warning messages
4. Verify data loading (meski dengan fallback query)

---

**Note**: Index creation adalah one-time setup. Setelah dibuat, semua query akan menggunakan optimized path secara otomatis.