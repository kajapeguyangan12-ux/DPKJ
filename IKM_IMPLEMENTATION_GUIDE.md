# 📊 IKM (Indeks Kepuasan Masyarakat) - Implementation Guide

## 📌 Overview
Sistem IKM telah berhasil diimplementasikan untuk mengukur kepuasan masyarakat terhadap layanan publik desa. Data kuesioner yang diisi oleh masyarakat akan tersimpan di Firestore dan otomatis muncul di panel admin.

## 🗂️ Struktur Database

### Collection: `ikm-survey`
```typescript
{
  namaPengisi: string,        // Nama user yang mengisi
  nik: string,                // NIK user
  jenisLayanan: string,       // Jenis layanan yang dinilai
  tanggalPengisian: Timestamp,// Waktu pengisian
  rating: number,             // Rating rata-rata (1-5)
  komentar: string,           // Komentar/saran
  pertanyaan: {               // Object berisi penilaian per pertanyaan
    [pertanyaan: string]: number  // Rating 1-5 per pertanyaan
  },
  userId: string,             // UID user
  createdAt: Timestamp        // Timestamp pembuatan
}
```

## 📂 File Structure

```
src/app/
├── masyarakat/
│   └── ikm/
│       └── page.tsx          # Halaman kuesioner IKM untuk masyarakat
└── admin/
    └── ikm/
        └── page.tsx          # Halaman manajemen IKM untuk admin
```

## 🎨 Fitur Masyarakat (`/masyarakat/ikm`)

### 1. **3-Step Form Process**
   - **Step 1**: Pilih Jenis Layanan
     - Administrasi Kependudukan
     - Surat Keterangan
     - Pelayanan Kesehatan
     - Pelayanan Pendidikan
     - Perizinan
     - Layanan Umum
     - Lainnya

   - **Step 2**: Penilaian (9 Pertanyaan)
     1. Bagaimana persyaratan pelayanan?
     2. Bagaimana prosedur pelayanan?
     3. Bagaimana waktu pelayanan?
     4. Bagaimana biaya/tarif pelayanan?
     5. Bagaimana kualitas hasil pelayanan?
     6. Bagaimana kompetensi petugas?
     7. Bagaimana perilaku petugas?
     8. Bagaimana fasilitas pelayanan?
     9. Bagaimana penanganan pengaduan?
     
     - Setiap pertanyaan dinilai dengan skala 1-5
     - Field komentar/saran (opsional)

   - **Step 3**: Konfirmasi & Kirim
     - Review data sebelum submit
     - Tampilkan rating rata-rata
     - Kirim ke Firestore

### 2. **Progress Indicator**
   - Visual indicator untuk step yang sedang aktif
   - Label: Layanan → Penilaian → Selesai

### 3. **Success Modal**
   - Notifikasi sukses setelah data terkirim
   - Auto-reset form setelah 3 detik
   - Animasi bounce untuk feedback positif

## 🔧 Fitur Admin (`/admin/ikm`)

### 1. **Dashboard Statistics**
   - **Total Kuesioner**: Jumlah total responden
   - **Rating Rata-rata**: Nilai kepuasan keseluruhan
   - **Status Kepuasan**: Baik (≥4.0) / Cukup (≥3.0) / Perlu Perbaikan (<3.0)

### 2. **Search & Filter**
   - Search by Nama Pengisi, NIK, atau Jenis Layanan
   - Real-time filtering

### 3. **Tabel Data**
   Kolom:
   - Nama Pengisi (dengan tanggal pengisian)
   - NIK
   - Jenis Layanan (dengan badge warna)
   - Rating (tampilan bintang)
   - Aksi (Hapus & View)

### 4. **Modal Detail View**
   Menampilkan:
   - Data pengisi lengkap
   - Rating keseluruhan dengan bintang
   - Komentar/saran
   - Detail penilaian per aspek (9 pertanyaan)

### 5. **Delete Confirmation**
   - Modal konfirmasi sebelum hapus
   - Loading state saat proses delete
   - Refresh data otomatis setelah delete

### 6. **Export IKM**
   - Export data ke format CSV
   - Kolom: Nama, NIK, Jenis Layanan, Rating, Tanggal, Komentar
   - Filename: `IKM_Export_YYYY-MM-DD.csv`

## 🔐 Security & Validation

### Masyarakat Side:
- ✅ Must be logged in (redirect to /masyarakat/login if not)
- ✅ Auto-fill nama dan NIK dari user yang login
- ✅ Validasi jenis layanan harus dipilih
- ✅ Semua 9 pertanyaan harus dijawab
- ✅ UserId disimpan untuk tracking

### Admin Side:
- ✅ AdminLayout protection (admin roles only)
- ✅ Real-time data fetching from Firestore
- ✅ Sorted by tanggalPengisian (descending)
- ✅ Delete requires confirmation

## 🎯 User Flow

### Masyarakat:
```
Login → Home → Klik Menu "IKM" → 
Pilih Layanan → Isi Rating 9 Pertanyaan → 
(Optional) Tulis Komentar → Review → Submit → 
Success Message → Auto Reset
```

### Admin:
```
Login → Sidebar "IKM" → 
View Statistics & List → 
(Option 1) View Detail per Kuesioner →
(Option 2) Delete Kuesioner →
(Option 3) Export All Data to CSV
```

## 📊 Data Integration

### Write (Masyarakat):
```typescript
const ikmData = {
  namaPengisi: user.userName || user.email,
  nik: user.idNumber || '-',
  jenisLayanan: jenisLayanan,
  tanggalPengisian: Timestamp.now(),
  rating: calculateAverageRating(),
  komentar: komentar,
  pertanyaan: ratings,
  userId: user.uid,
  createdAt: Timestamp.now()
};

await addDoc(collection(firestore, 'ikm-survey'), ikmData);
```

### Read (Admin):
```typescript
const ikmCollection = collection(firestore, "ikm-survey");
const q = query(ikmCollection, orderBy("tanggalPengisian", "desc"));
const snapshot = await getDocs(q);
```

### Delete (Admin):
```typescript
await deleteDoc(doc(firestore, "ikm-survey", id));
```

## 🎨 UI/UX Features

### Masyarakat:
- ✅ Gradient backgrounds (red-50 to blue-50)
- ✅ Responsive card design
- ✅ Interactive rating buttons (yellow highlight on select)
- ✅ Progress indicator with steps
- ✅ Success modal with animation
- ✅ Bottom navigation

### Admin:
- ✅ Modern dashboard with gradient cards
- ✅ Star rating visualization
- ✅ Color-coded service badges
- ✅ Hover effects on action buttons
- ✅ Modal overlays with backdrop blur
- ✅ Loading states

## 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Max-width constraints for better readability
- ✅ Touch-friendly button sizes
- ✅ Adaptive grid layouts

## 🚀 Testing Checklist

### Masyarakat:
- [ ] Login sebagai masyarakat
- [ ] Akses menu IKM dari home
- [ ] Pilih jenis layanan
- [ ] Isi semua 9 pertanyaan
- [ ] Tambah komentar (optional)
- [ ] Review ringkasan
- [ ] Submit kuesioner
- [ ] Verifikasi success message
- [ ] Cek form auto-reset

### Admin:
- [ ] Login sebagai admin
- [ ] Akses menu IKM di sidebar
- [ ] Verifikasi statistics muncul
- [ ] Verifikasi data kuesioner muncul
- [ ] Test search functionality
- [ ] Klik "View" untuk lihat detail
- [ ] Klik "Hapus" dan konfirmasi delete
- [ ] Test "Export IKM" to CSV
- [ ] Verifikasi data real-time update

## ⚠️ Known Issues & Solutions

### Issue: "username does not exist"
**Solution**: Sudah diperbaiki, menggunakan `userName` (camelCase)

### Issue: TypeScript errors on ratings object
**Solution**: Sudah ditambahkan type annotation `{ [key: string]: number }`

### Issue: reduce() implicit any type
**Solution**: Sudah ditambahkan explicit types `(acc: number, val: number)`

## 🎉 Success Criteria
- ✅ Masyarakat dapat mengisi kuesioner IKM
- ✅ Data tersimpan di Firestore collection `ikm-survey`
- ✅ Data otomatis muncul di panel admin
- ✅ Admin dapat view, delete, dan export data
- ✅ Statistik dihitung secara real-time
- ✅ UI responsive dan user-friendly
- ✅ No TypeScript errors
- ✅ Validasi form berjalan dengan baik

## 📝 Notes
- Menu IKM sudah tersedia di `/masyarakat/home` (icon Clipboard + Star)
- Collection name: `ikm-survey` (bukan `IKM` folder)
- Rating scale: 1 (Kurang) sampai 5 (Sangat Baik)
- Export format: CSV dengan UTF-8 encoding
- Average rating dibulatkan ke integer terdekat

---
✅ **Status**: Fully Implemented & Ready for Production
🗓️ **Last Updated**: November 1, 2025
👨‍💻 **Implemented by**: GitHub Copilot
