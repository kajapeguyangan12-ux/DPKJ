# 🖼️ Update Fitur Galeri untuk Wisata & Budaya

## ✨ Fitur Baru yang Ditambahkan

### 1. **Upload Multiple Images (Galeri)**
- ✅ Support upload banyak foto sekaligus
- ✅ Preview gambar sebelum upload
- ✅ Hapus foto dari galeri (existing & baru)
- ✅ Tampilan grid untuk preview galeri

### 2. **Auto Convert ke WebP**
- ✅ Semua gambar otomatis dikonversi ke format WebP
- ✅ Kualitas 90% untuk hasil optimal
- ✅ Ukuran file lebih kecil, loading lebih cepat

### 3. **Organized Firebase Storage**
```
firebase-storage/
├── wisata/
│   ├── {docId}/
│   │   ├── {timestamp}.webp          # Foto utama
│   │   └── galeri/
│   │       ├── {timestamp1}.webp
│   │       ├── {timestamp2}.webp
│   │       └── ...
│   └── ...
└── budaya/
    ├── {docId}/
    │   ├── {timestamp}.webp          # Foto utama
    │   └── galeri/
    │       ├── {timestamp1}.webp
    │       └── ...
    └── ...
```

## 📝 Perubahan pada Service Layer

### File: `src/lib/wisataBudayaService.ts`

#### Interface Update:
```typescript
export interface WisataItem {
  // ... existing fields
  galeri?: string[]; // ✅ BARU: Array URL galeri
}

export interface BudayaItem {
  // ... existing fields
  galeri?: string[]; // ✅ BARU: Array URL galeri
}
```

#### Helper Functions Baru:
1. **`convertToWebP(file: File): Promise<Blob>`**
   - Convert image file ke WebP format
   - Menggunakan Canvas API
   - Quality 90%

2. **`uploadImageToStorage(file, folder, subfolder): Promise<string>`**
   - Upload single image ke Firebase Storage
   - Auto convert ke WebP
   - Return download URL

3. **`uploadGalleryImages(files, folder, itemId): Promise<string[]>`**
   - Upload multiple images sekaligus
   - Semua masuk ke subfolder `galeri`
   - Return array of URLs

4. **`deleteImageFromStorage(url: string): Promise<void>`**
   - Delete image dari Firebase Storage
   - Handle error jika file tidak ada

#### Function Updates:

**Create Functions:**
```typescript
// Sebelum:
createWisata(data, foto?)

// Sesudah:
createWisata(data, foto?, galeriFiles?)
```

**Update Functions:**
```typescript
// Sebelum:
updateWisata(id, data, foto?)

// Sesudah:
updateWisata(id, data, foto?, galeriFiles?, deleteGaleriUrls?)
```

**Delete Functions:**
- Sekarang menghapus foto utama + semua galeri
- Loop through galeri array untuk delete semua

## 🎨 Perubahan pada Admin Panel

### File: `src/app/admin/wisata-budaya/page.tsx`

#### State Baru:
```typescript
const [galeriFiles, setGaleriFiles] = useState<File[]>([]);
const [galeriPreviews, setGaleriPreviews] = useState<string[]>([]);
const [existingGaleri, setExistingGaleri] = useState<string[]>([]);
const [galeriToDelete, setGaleriToDelete] = useState<string[]>([]);
```

#### Handler Functions Baru:
1. **`handleGaleriChange`** - Handle upload multiple files
2. **`removeGaleriPreview`** - Remove preview baru (belum diupload)
3. **`removeExistingGaleri`** - Mark existing galeri untuk dihapus

#### UI Improvements:

**Form Section:**
```tsx
{/* Upload Galeri (Multiple) */}
<input 
  type="file" 
  accept="image/*" 
  multiple 
  onChange={handleGaleriChange}
/>

{/* Galeri Previews - Grid 3 kolom */}
- Existing galeri (bisa dihapus dengan button X)
- New previews (border hijau + badge "Baru")
- Hover effect untuk delete button
```

**Preview Section:**
```tsx
{/* Galeri Preview - Grid 3 kolom */}
- Existing: tampilan normal
- Baru: border hijau + badge "Baru"
```

## 📱 Perubahan pada Detail Pages

### Wisata Detail: `src/app/masyarakat/wisata-budaya/wisata/detail/[id]/page.tsx`
### Budaya Detail: `src/app/masyarakat/wisata-budaya/budaya/detail/[id]/page.tsx`

#### Interface Update:
```typescript
type WisataDetail = {
  // ... existing
  galeri?: string[]; // ✅ BARU
}

type BudayaDetail = {
  // ... existing
  galeri?: string[]; // ✅ BARU
}
```

#### Gallery Tab Enhancement:
```tsx
{activeTab === "gallery" && (
  <>
    {/* Foto Utama dengan badge "Foto Utama" */}
    <img src={fotoUrl} />
    
    {/* Galeri Grid 2 kolom */}
    {galeri.map((url, index) => (
      <img src={url} alt={`Foto ${index + 1}`} />
    ))}
    
    {/* Empty state jika tidak ada foto */}
  </>
)}
```

## 🚀 Cara Penggunaan

### 1. Upload Galeri di Admin Panel

1. Buka panel admin Wisata/Budaya
2. Klik "Tambah Wisata" atau "Tambah Budaya"
3. Isi form seperti biasa
4. Upload foto utama (opsional)
5. Klik "Upload Galeri (Multiple)" untuk upload banyak foto
6. Preview akan muncul di grid
7. Bisa hapus preview dengan click X
8. Submit form
9. **Semua foto otomatis convert ke WebP!**

### 2. Edit Galeri

1. Click Edit pada item
2. Existing galeri akan muncul
3. Bisa hapus foto existing dengan click X (akan dihapus saat Submit)
4. Bisa tambah foto baru
5. Preview existing & baru akan tampil berbeda
6. Submit untuk save

### 3. Lihat Galeri di Detail Page

1. Buka detail wisata/budaya
2. Click tab "Galeri"
3. Foto utama muncul dengan badge "Foto Utama"
4. Foto galeri lainnya dalam grid 2 kolom
5. Hover effect untuk interaksi

## 📊 Storage Structure Example

```
wisata/
├── abc123/                          # Document ID
│   ├── 1699123456000.webp          # Main photo
│   └── galeri/
│       ├── abc123/
│       │   ├── galeri/
│       │   │   ├── 1699123457000.webp
│       │   │   ├── 1699123458000.webp
│       │   │   └── 1699123459000.webp
```

## ✅ Checklist Testing

- [x] Service layer: convertToWebP works
- [x] Service layer: uploadImageToStorage works
- [x] Service layer: uploadGalleryImages works
- [x] Service layer: deleteImageFromStorage works
- [x] Admin: Upload single photo utama
- [x] Admin: Upload multiple galeri
- [x] Admin: Preview galeri baru
- [x] Admin: Hapus preview galeri baru
- [x] Admin: Hapus existing galeri
- [x] Admin: Submit dengan galeri
- [x] Admin: Edit dengan galeri
- [x] Detail Page: Tampil foto utama
- [x] Detail Page: Tampil galeri grid
- [x] Detail Page: Empty state jika tidak ada foto

## 🎯 Benefits

1. **Performa Lebih Baik**
   - WebP 30% lebih kecil dari JPEG
   - Loading page lebih cepat
   - Hemat bandwidth

2. **User Experience**
   - Multiple upload sekaligus
   - Preview sebelum upload
   - Organized storage

3. **Maintainability**
   - Struktur folder yang rapi
   - Easy to delete (cascade delete)
   - Scalable untuk banyak foto

## 🔧 Technical Details

### WebP Conversion
```typescript
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.toBlob(blob => {
  // Upload blob
}, 'image/webp', 0.9); // 90% quality
```

### File Naming Convention
```typescript
const fileName = `${timestamp}.webp`;
// Example: 1699123456789.webp
```

### Path Structure
```typescript
// Main photo
`${folder}/${docId}/${timestamp}.webp`

// Gallery
`${folder}/${docId}/galeri/${timestamp}.webp`
```

## 📌 Notes

- ⚠️ Browser support: WebP supported di semua modern browsers
- ⚠️ Fallback: Jika browser lama, image tetap bisa di-load (fallback to original)
- ⚠️ Max file size: Tidak ada limit saat ini (bisa ditambahkan validasi)
- ⚠️ Image optimization: Quality 90% balance antara size & quality

---

**Status**: ✅ Completed & Tested
**Last Updated**: 2025-11-01
**Version**: 1.0.0
