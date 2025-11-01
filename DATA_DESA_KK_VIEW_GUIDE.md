# Panduan Tampilan Kartu KK - Data Desa

## Fitur yang Ditambahkan

### 1. Toggle View Mode
- **Kartu KK**: Menampilkan data dalam bentuk kartu per keluarga
- **Tabel**: Menampilkan data dalam bentuk tabel tradisional
- Toggle button tersedia di bagian atas halaman

### 2. Statistik yang Ditampilkan
- **Total Penduduk**: Jumlah total warga (menampilkan 0 jika kosong)
- **Laki-laki**: Jumlah warga laki-laki
- **Perempuan**: Jumlah warga perempuan  
- **Kepala Keluarga**: Jumlah kepala keluarga
- **Total KK**: Jumlah Kartu Keluarga (baru ditambahkan)

### 3. Tampilan Kartu KK
Setiap kartu KK menampilkan:
- **Header KK**: No KK, alamat, total anggota keluarga
- **Statistik per KK**: Jumlah laki-laki, perempuan, anak-anak
- **Detail Kepala Keluarga**: Nama, umur, pekerjaan
- **Daftar Anggota**: Dapat diperluas/diperkecil untuk melihat semua anggota

### 4. Fitur Form
- **Form otomatis kosong**: Semua field form dikosongkan setelah submit berhasil
- **Reset form**: Fungsi `resetForm()` dipanggil setelah data disimpan
- **Validasi**: Form akan direset baik untuk tambah data baru maupun edit data

### 5. Upload Excel KK
- **Parser KK khusus**: Mendukung format Excel Kartu Keluarga Indonesia
- **Batch processing**: Upload multiple families sekaligus
- **Auto-grouping**: Data otomatis dikelompokkan berdasarkan No KK

## Struktur File

```
src/app/admin/data-desa/
├── page.tsx                    # Halaman utama dengan toggle view mode
├── components/
│   ├── UploadExcel.tsx        # Component upload Excel dengan parser KK
│   └── KKCard.tsx             # Component kartu untuk menampilkan data keluarga
```

## Cara Penggunaan

### 1. Menggunakan Toggle View Mode
1. Di bagian atas halaman, klik tombol "Kartu KK" atau "Tabel"
2. **Kartu KK**: Data akan ditampilkan per keluarga dalam bentuk kartu
3. **Tabel**: Data akan ditampilkan dalam tabel tradisional

### 2. Upload Excel Format KK
1. Klik tombol "Upload Excel"
2. Pilih file Excel dengan format Kartu Keluarga
3. File akan diparse otomatis dengan format khusus KK Indonesia
4. Data akan tersimpan dan dikelompokkan berdasarkan No KK

### 3. Melihat Detail Keluarga (Mode Kartu)
1. Setiap kartu menampilkan ringkasan keluarga
2. Klik "Lihat Detail" untuk melihat semua anggota keluarga
3. Informasi detail setiap anggota akan ditampilkan

## Teknologi yang Digunakan

- **React useState**: Untuk state management view mode dan form data
- **TypeScript interfaces**: Type safety untuk data KK dan keluarga
- **Tailwind CSS**: Styling responsive untuk kartu dan komponen
- **Firebase Firestore**: Penyimpanan data dengan batch operations
- **xlsx (SheetJS)**: Parsing file Excel dengan custom parser

## Keunggulan Fitur

1. **Fleksibilitas Tampilan**: User dapat memilih antara view kartu atau tabel
2. **Statistik Real-time**: Menampilkan statistik yang update otomatis
3. **Grouping by KK**: Data otomatis dikelompokkan per keluarga
4. **Form Management**: Form selalu kosong untuk input data baru
5. **Excel Integration**: Support upload langsung dari format KK Excel
6. **Responsive Design**: Tampilan optimal di berbagai ukuran layar

## Update Terbaru

- ✅ Toggle view mode antara kartu dan tabel
- ✅ Statistik Total KK ditambahkan
- ✅ Form auto-reset setelah submit
- ✅ Interface DataDesa yang konsisten
- ✅ KKCard component yang compatible
- ✅ Grouping logic untuk data keluarga

Semua fitur telah terintegrasi dan siap digunakan untuk manajemen data desa berbasis Kartu Keluarga.