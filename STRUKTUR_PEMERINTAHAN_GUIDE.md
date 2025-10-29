# 📖 Panduan Struktur Pemerintahan Simplified

## 🎯 Deskripsi Fitur

Sistem **Struktur Pemerintahan Simplified** adalah versi sederhana dan mudah dikelola dari fitur struktur pemerintahan. Sistem ini mengikuti pola yang sama dengan fitur **Visi & Misi** untuk konsistensi dan kemudahan penggunaan.

### ✨ Keunggulan:
- **Singkron Real-time**: Data di admin page langsung muncul di public page
- **Simple & Clean**: Interface sederhana yang mudah dipahami
- **2 Jenis Struktur**: Struktur Desa dan Struktur BPD
- **Upload Foto**: Setiap struktur bisa punya foto
- **CRUD Lengkap**: Tambah, edit, hapus anggota struktur

---

## 📁 File-File Terkait

### Backend / Service
- **`src/lib/profilDesaService.ts`**
  - Interface: `StrukturOfficer` (jabatan, nama)
  - Interface: `StrukturPemerintahanSimplified` (type, foto, officers[], timestamps)
  - Functions:
    - `getStrukturPemerintahanSimplified(type)` - Fetch data
    - `saveStrukturPemerintahanSimplified(type, data)` - Save/update
    - `subscribeToStrukturPemerintahanSimplified(type, callback)` - Real-time listener

### Admin Pages
- **`src/app/admin/profil-desa/struktur-simplified/page.tsx`**
  - Create, read, update, delete struktur pemerintahan
  - Upload foto untuk setiap tipe struktur
  - Modal-based UI (Add, Edit, Delete, Upload)

### Public Pages
- **`src/app/masyarakat/profil-desa/struktur/page.tsx`**
  - Display struktur pemerintahan dengan real-time sync
  - Dropdown selector untuk memilih Struktur Desa atau BPD
  - Menampilkan foto dan list anggota

### Database Collections
- **Firestore Collection**: `struktur-pemerintahan-simplified`
- **Documents**: `desa` dan `bpd` (singleton)

---

## 📊 Struktur Data

### Document Structure (Firestore)

```
Collection: struktur-pemerintahan-simplified
├── Document: desa
│   ├── type: "desa"
│   ├── foto: "https://storage.googleapis.com/..."
│   ├── officers: [
│   │   { jabatan: "Kepala Desa", nama: "Nama Kepala" },
│   │   { jabatan: "Sekretaris", nama: "Nama Sekretaris" },
│   │   ...
│   ├── createdAt: Timestamp
│   └── updatedAt: Timestamp
│
└── Document: bpd
    ├── type: "bpd"
    ├── foto: "https://storage.googleapis.com/..."
    ├── officers: [
    │   { jabatan: "Ketua BPD", nama: "Nama Ketua" },
    │   ...
    ├── createdAt: Timestamp
    └── updatedAt: Timestamp
```

### TypeScript Interfaces

```typescript
export interface StrukturOfficer {
  jabatan: string;
  nama: string;
}

export interface StrukturPemerintahanSimplified {
  id: string;
  type: 'desa' | 'bpd';
  foto: string;
  officers: StrukturOfficer[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
```

---

## 🚀 Cara Menggunakan

### Admin Page - Mengelola Struktur

#### URL: `/admin/profil-desa/struktur-simplified`

#### 1. Pilih Jenis Struktur
- Click tombol "Struktur Desa" atau "Struktur BPD" di atas

#### 2. Upload Foto Struktur
- Click tombol "Ubah Foto"
- Pilih file gambar
- Click "Upload"
- Foto akan langsung tampil di public page

#### 3. Tambah Anggota Struktur
- Click tombol "+ Tambah"
- Isi field:
  - **Jabatan**: Contoh "Kepala Desa", "Sekretaris Desa", "Kaur Keuangan"
  - **Nama**: Nama lengkap anggota
- Click "Simpan"
- Anggota akan langsung muncul di list dan di public page

#### 4. Edit Anggota
- Click tombol "Edit" pada anggota yang ingin diubah
- Ubah data (jabatan/nama)
- Click "Simpan"

#### 5. Hapus Anggota
- Click tombol "Hapus" pada anggota
- Confirm hapus
- Anggota akan dihapus dari list dan public page

### Public Page - Melihat Struktur

#### URL: `/masyarakat/profil-desa/struktur`

#### 1. Pilih Struktur
- Gunakan dropdown selector di atas
- Pilih "Struktur Pemerintahan Desa" atau "Badan Permusyawaratan Desa"

#### 2. Lihat Foto
- Foto struktur akan ditampilkan (jika sudah di-upload dari admin)

#### 3. Lihat Daftar Anggota
- Anggota struktur ditampilkan dalam bentuk list kartu
- Setiap kartu menampilkan:
  - 👤 Icon
  - Jabatan (bold)
  - Nama (subtitle)

---

## 🔄 Flow Data

### Add Anggota:
```
Admin Input (jabatan, nama)
    ↓
Click Simpan
    ↓
Save ke Firestore (struktur-pemerintahan-simplified/desa)
    ↓
onSnapshot listener trigger
    ↓
Admin page update list
    ↓
Public page update list (real-time)
```

### Update Foto:
```
Admin Select File
    ↓
Click Upload
    ↓
Upload ke Firebase Storage
    ↓
Get Download URL
    ↓
Save URL ke Firestore
    ↓
Public page display foto (real-time)
```

---

## 📝 Catatan

- **Real-time Sync**: Setiap perubahan di admin page akan langsung muncul di public page
- **Multiple Types**: Sistem mendukung Struktur Desa dan BPD secara terpisah
- **Foto Optional**: Jika foto belum di-upload, akan menampilkan placeholder (🏛️)
- **Simpel & Scalable**: Mudah menambah atau mengurangi anggota

---

## 🐛 Troubleshooting

### Foto tidak muncul di public
- Pastikan sudah klik "Upload" di admin page
- Check Firebase Storage permissions
- Refresh halaman public

### Data tidak singkron
- Check koneksi internet
- Verify Firestore permissions
- Reload halaman

### Tidak bisa upload foto
- Check file size (max sesuai Firebase Storage limit)
- Verify Firebase Storage rules allow upload
- Check browser console untuk error detail

---

## 🔐 Firestore Rules Needed

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Struktur Pemerintahan Simplified - Anyone can read, only admin can write
    match /struktur-pemerintahan-simplified/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## ✅ Summary

| Fitur | Status | Keterangan |
|-------|--------|-----------|
| Create Struktur | ✅ | Tambah anggota baru |
| Read Struktur | ✅ | Lihat data di public |
| Update Struktur | ✅ | Edit anggota & foto |
| Delete Struktur | ✅ | Hapus anggota |
| Real-time Sync | ✅ | onSnapshot listener |
| Upload Foto | ✅ | Firebase Storage |
| Dual Types | ✅ | Desa & BPD |
| Mobile Responsive | ✅ | Max-width 500px |

---

**Created**: 2024
**Pattern**: Following Visi & Misi simplified pattern
**Build Status**: ✅ Successful (0 errors)
