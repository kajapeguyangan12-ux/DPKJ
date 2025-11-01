# Wisata & Budaya Implementation Guide

## Overview
Sistem Wisata & Budaya untuk mengelola informasi destinasi wisata dan warisan budaya Desa Peguyangan Kaja. Admin dapat menambah, mengedit, dan menghapus data, sedangkan masyarakat dapat melihat dan mencari informasi.

## Database Structure

### Firestore Collections

#### 1. Collection: `wisata`
Menyimpan informasi destinasi wisata
```typescript
{
  id: string (auto-generated),
  judul: string,
  kategori: "Alam" | "Budaya" | "Kuliner" | "Religi",
  alamat: string,
  lokasi: string (GPS coordinates),
  deskripsi: string,
  fotoUrl: string (optional),
  rating: number (optional, 0-5),
  jarak: string (optional, e.g., "2.5 km"),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### 2. Collection: `budaya`
Menyimpan informasi warisan budaya
```typescript
{
  id: string (auto-generated),
  judul: string,
  kategori: "Tari" | "Upacara" | "Kerajinan" | "Musik" | "Tradisi",
  deskripsi: string,
  sejarah: string (optional),
  fotoUrl: string (optional),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Firebase Storage
- Path: `/wisata/{timestamp}_{filename}` - Foto wisata
- Path: `/budaya/{timestamp}_{filename}` - Foto budaya

## File Structure

```
src/
├── lib/
│   └── wisataBudayaService.ts          # Service functions untuk Firestore & Storage
├── app/
│   ├── admin/
│   │   └── wisata-budaya/
│   │       └── page.tsx                 # Admin panel untuk kelola data
│   └── masyarakat/
│       └── wisata-budaya/
│           ├── page.tsx                 # Landing page dengan 2 pilihan
│           ├── wisata/
│           │   ├── page.tsx             # List wisata untuk masyarakat
│           │   └── detail/
│           │       └── [id]/
│           │           └── page.tsx     # Detail wisata (existing)
│           └── budaya/
│               ├── page.tsx             # List budaya untuk masyarakat
│               └── detail/
│                   └── [id]/
│                       └── page.tsx     # Detail budaya (existing)
```

## Features

### Admin Panel (`/admin/wisata-budaya`)

#### Tab Navigation
- **Wisata Tab**: Kelola destinasi wisata
- **Budaya Tab**: Kelola warisan budaya

#### Core Functionality
1. **View List**: Grid layout dengan foto, kategori, dan informasi singkat
2. **Search**: Pencarian real-time berdasarkan judul, kategori, alamat
3. **Add New**:
   - Upload foto
   - Form dengan validasi
   - Kategori dropdown
   - Field khusus per tipe (alamat, GPS untuk wisata; sejarah untuk budaya)
4. **Edit**: Update data termasuk ganti foto
5. **Delete**: Hapus data dengan konfirmasi, termasuk foto di storage

#### Wisata Form Fields
- ✅ Judul (required)
- ✅ Kategori (required): Alam, Budaya, Kuliner, Religi
- ✅ Alamat (required)
- ✅ Lokasi GPS (optional)
- ✅ Jarak (optional)
- ✅ Rating (optional, 0-5)
- ✅ Deskripsi (required)
- ✅ Foto (optional)

#### Budaya Form Fields
- ✅ Judul (required)
- ✅ Kategori (required): Tari, Upacara, Kerajinan, Musik, Tradisi
- ✅ Deskripsi (required)
- ✅ Sejarah (optional)
- ✅ Foto (optional)

### Masyarakat Pages

#### Landing Page (`/masyarakat/wisata-budaya`)
- 2 kartu navigasi: Wisata dan Budaya
- Info section dengan ilustrasi

#### Wisata Page (`/masyarakat/wisata-budaya/wisata`)
- **Search Bar**: Cari berdasarkan judul atau alamat
- **Filter Tabs**: All, Alam, Budaya, Kuliner, Religi
- **List View**: 
  - Foto wisata (atau placeholder)
  - Rating dan jarak (jika ada)
  - Judul dan kategori
  - Alamat dan lokasi GPS
  - Tombol "Rekreasi" dan "Detail"
- **Loading State**: Spinner saat fetch data
- **Empty State**: Pesan jika tidak ada data

#### Budaya Page (`/masyarakat/wisata-budaya/budaya`)
- **Search Bar**: Cari berdasarkan judul
- **Filter Tabs**: All, Tari, Upacara, Kerajinan, Musik, Tradisi
- **List View**: 
  - Foto budaya (atau placeholder)
  - Judul dan kategori
  - Deskripsi singkat (3 baris)
  - Tombol "Pelajari" dan "Detail"
- **Loading State**: Spinner saat fetch data
- **Empty State**: Pesan jika tidak ada data

## Service Functions (`wisataBudayaService.ts`)

### Wisata Functions
```typescript
getAllWisata(): Promise<WisataItem[]>
getWisataById(id: string): Promise<WisataItem | null>
createWisata(data: WisataItem, foto?: File): Promise<string>
updateWisata(id: string, data: Partial<WisataItem>, foto?: File): Promise<void>
deleteWisata(id: string): Promise<void>
```

### Budaya Functions
```typescript
getAllBudaya(): Promise<BudayaItem[]>
getBudayaById(id: string): Promise<BudayaItem | null>
createBudaya(data: BudayaItem, foto?: File): Promise<string>
updateBudaya(id: string, data: Partial<BudayaItem>, foto?: File): Promise<void>
deleteBudaya(id: string): Promise<void>
```

## UI/UX Features

### Admin Panel Design
- **Modern Card Layout**: Grid responsif untuk desktop
- **Tab System**: Switch antara Wisata dan Budaya
- **Modal Forms**: 
  - Gradient header (red)
  - Photo preview
  - Form validation
  - Loading states
- **Delete Confirmation**: Modal konfirmasi dengan warning icon
- **Empty State**: Ilustrasi dan pesan friendly
- **Search Integration**: Real-time filtering

### Masyarakat Design
- **Mobile-First**: Optimized untuk smartphone
- **Red Theme**: Konsisten dengan branding desa
- **Smooth Animations**: Hover effects, scale transitions
- **Filter Pills**: Horizontal scroll untuk banyak kategori
- **Image Fallback**: Placeholder icon jika foto tidak ada
- **Bottom Navigation**: Fixed navigation bar

## Setup Instructions

### 1. Firestore Security Rules
Tambahkan di `firestore.rules`:
```javascript
match /wisata/{wisataId} {
  allow read: if true;
  allow write: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in 
    ['administrator', 'admin_desa', 'kepala_desa'];
}

match /budaya/{budayaId} {
  allow read: if true;
  allow write: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in 
    ['administrator', 'admin_desa', 'kepala_desa'];
}
```

### 2. Firebase Storage Rules
```javascript
match /wisata/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null;
  allow delete: if request.auth != null;
}

match /budaya/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null;
  allow delete: if request.auth != null;
}
```

### 3. Navigation Links
Already configured in:
- `/admin/home/page.tsx` - Admin dashboard card
- `/admin/components/AdminLayout.tsx` - Sidebar menu

## Testing Checklist

### Admin Panel
- [ ] Login sebagai admin
- [ ] Buka `/admin/wisata-budaya`
- [ ] Tab Wisata:
  - [ ] Tambah wisata baru dengan foto
  - [ ] Tambah wisata tanpa foto
  - [ ] Edit wisata (update foto dan data)
  - [ ] Search wisata
  - [ ] Delete wisata
- [ ] Tab Budaya:
  - [ ] Tambah budaya baru dengan foto
  - [ ] Tambah budaya tanpa foto
  - [ ] Edit budaya (update foto dan data)
  - [ ] Search budaya
  - [ ] Delete budaya

### Masyarakat Pages
- [ ] Buka `/masyarakat/wisata-budaya`
- [ ] Klik kartu "Wisata"
  - [ ] Lihat list wisata
  - [ ] Test search functionality
  - [ ] Test filter tabs (All, Alam, Budaya, Kuliner, Religi)
  - [ ] Klik "Detail" untuk lihat detail
- [ ] Klik kartu "Budaya"
  - [ ] Lihat list budaya
  - [ ] Test search functionality
  - [ ] Test filter tabs (All, Tari, Upacara, Kerajinan, Musik, Tradisi)
  - [ ] Klik "Detail" untuk lihat detail

### Data Integration
- [ ] Data yang ditambah di admin muncul di masyarakat pages
- [ ] Foto upload dan tampil dengan benar
- [ ] Delete di admin menghilangkan data dari masyarakat pages
- [ ] Update di admin langsung reflect di masyarakat pages

## Troubleshooting

### Foto tidak upload
- Cek Firebase Storage rules
- Cek koneksi internet
- Cek size foto (max biasanya 5MB)
- Cek format foto (jpg, png, gif)

### Data tidak muncul
- Cek Firestore rules untuk read permission
- Cek browser console untuk error
- Cek apakah collection name benar (`wisata`, `budaya`)

### Permission denied
- Cek role user di Firestore
- Cek authentication status
- Cek Firestore security rules

## Future Enhancements

### Potential Features
1. **Maps Integration**: Tampilkan lokasi di Google Maps
2. **Rating System**: User bisa kasih rating
3. **Comments**: User bisa kasih komentar
4. **Favorites**: User bisa save favorites
5. **Share**: Share ke social media
6. **Gallery**: Multiple photos per item
7. **Events Calendar**: Untuk budaya/upacara dengan jadwal
8. **Virtual Tour**: 360° photos
9. **Translation**: Multi-language support
10. **Analytics**: Track popular destinations

### Performance Optimization
- Implement pagination untuk list panjang
- Add image compression saat upload
- Cache data dengan React Query
- Lazy load images
- Add search debouncing

## Notes
- Sistem ini real-time: perubahan di admin langsung terlihat di masyarakat pages
- Foto disimpan di Firebase Storage dengan auto-generated filenames
- Delete cascade: menghapus data juga menghapus foto terkait
- Responsive design untuk semua screen sizes
- Error handling untuk network issues
- Loading states untuk better UX

## Contact & Support
Untuk pertanyaan atau issue, hubungi tim developer SiGede DPKJ.
