# Laporan Masyarakat - Update Guide

## 📋 Perubahan yang Dilakukan

### 1. **Struktur Laporan**
Dibuat 2 halaman laporan terpisah untuk masyarakat:

#### A. Laporan Pengaduan (`/masyarakat/laporan/pengaduan`)
- **Tujuan**: Melaporkan masalah/keluhan
- **Kategori**: Infrastruktur, Keamanan, Lingkungan, Pelayanan, Lainnya
- **Status**: Menunggu, Diproses, Disetujui, Selesai, Ditolak
- **Theme**: Red/Pink gradient
- **Data Source**: Collection `laporan-masyarakat`

#### B. Laporan Aspirasi (`/masyarakat/laporan/aspirasi`)
- **Tujuan**: Menyampaikan ide/saran pembangunan
- **Kategori**: Pembangunan, Pendidikan, Kesehatan, Ekonomi, Sosial, Lainnya
- **Status**: Menunggu, Ditinjau, Diterima, Ditolak
- **Theme**: Blue/Indigo gradient
- **Data Source**: Collection `aspirasi-masyarakat`

### 2. **UI/UX Improvements**
✅ **Dihapus button floating hijau** yang duplikat
- Sebelumnya: Ada 2 button "Buat Laporan" (merah di atas + hijau floating)
- Sekarang: Hanya 1 button merah di bagian atas yang lebih prominent

✅ **Fixed Login Issue**
- Masalah: User sudah login tapi diminta login lagi
- Solusi: 
  - Menambahkan AuthGuard wrapper pada kedua halaman
  - Menyimpan `userId` ke localStorage saat login
  - AuthGuard redirect ke `/masyarakat/login` jika belum login

### 3. **Fitur yang Tersedia**

#### 🔍 Search & Filter
- Search bar untuk mencari laporan
- Filter berdasarkan kategori
- Sort: Terbaru, Terlama, Status

#### 📊 Display Cards
- Modern card design dengan gradient
- Status badges dengan emoji icons
- Tanggal dan lokasi/kategori information
- Hover effects dan smooth transitions
- Link ke detail laporan

#### 📱 Responsive Design
- Mobile-first approach
- Max width 28rem (md) untuk optimal viewing
- Bottom navigation tetap visible
- Loading skeleton saat fetch data
- Empty state yang informatif

### 4. **Technical Implementation**

#### Files Modified:
```
✅ src/app/masyarakat/laporan/pengaduan/page.tsx (NEW)
✅ src/app/masyarakat/laporan/aspirasi/page.tsx (NEW)
✅ src/contexts/AuthContext.tsx (UPDATED - login flow)
```

#### Auth Protection:
```tsx
<AuthGuard requireAdmin={false} redirectTo="/masyarakat/login">
  {/* Page content */}
</AuthGuard>
```

#### Data Fetching:
```typescript
// Pengaduan
const data = await getLaporanByUser(userId);

// Aspirasi  
const q = query(
  collection(db, 'aspirasi-masyarakat'),
  where('userId', '==', userId),
  orderBy('tanggalAspirasi', 'desc')
);
```

### 5. **Status Colors & Icons**

#### Pengaduan:
- 🟡 Menunggu: Yellow
- 🔵 Diproses: Blue
- 🟢 Disetujui/Selesai: Green
- 🔴 Ditolak: Red

#### Aspirasi:
- 🟡 Menunggu: Yellow
- 👀 Ditinjau: Blue
- ✅ Diterima: Green
- ❌ Ditolak: Red

### 6. **Next Steps (To Do)**

#### Form Pembuatan Laporan:
- [ ] Create `/masyarakat/laporan/pengaduan/buat` form
- [ ] Create `/masyarakat/laporan/aspirasi/buat` form
- [ ] Upload foto untuk laporan pengaduan
- [ ] Validation & error handling

#### Detail Pages:
- [ ] Create `/masyarakat/laporan/pengaduan/[id]` detail view
- [ ] Create `/masyarakat/laporan/aspirasi/[id]` detail view
- [ ] Show admin response/notes
- [ ] Timeline status changes

#### Admin Panel:
- [ ] Admin panel untuk mengelola aspirasi
- [ ] Update status aspirasi
- [ ] Add admin notes/response

### 7. **Testing Checklist**

- [x] User dapat melihat list laporan pengaduan
- [x] User dapat melihat list aspirasi
- [x] Search berfungsi dengan baik
- [x] Filter kategori bekerja
- [x] Sort bekerja (Terbaru, Terlama, Status)
- [x] AuthGuard redirect ke login jika belum auth
- [x] Loading state ditampilkan saat fetch
- [x] Empty state ditampilkan jika tidak ada data
- [ ] Button "Buat Laporan Baru" ke form (pending form creation)
- [ ] Link ke detail page (pending detail page creation)

### 8. **Known Issues & Limitations**

✅ **RESOLVED**:
- ~~Duplicate "Buat Laporan" buttons~~ → Removed floating green button
- ~~Login required message despite being logged in~~ → Added AuthGuard + userId localStorage

⚠️ **PENDING**:
- Form creation pages not yet implemented
- Detail view pages not yet implemented
- Admin panel for aspirasi not yet implemented
- Real-time updates not implemented (need manual refresh)

---

## 🚀 Quick Usage

### Accessing Pages:
```
Pengaduan: /masyarakat/laporan/pengaduan
Aspirasi:  /masyarakat/laporan/aspirasi
```

### User Flow:
1. User login sebagai masyarakat
2. Navigasi ke halaman laporan (pengaduan/aspirasi)
3. View existing reports
4. Click "Buat Laporan Baru" untuk membuat laporan baru (form pending)
5. Click laporan card untuk view detail (detail page pending)

---

**Last Updated**: November 1, 2025
**Status**: ✅ UI Complete, ⚠️ Forms & Details Pending
