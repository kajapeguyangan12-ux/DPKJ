# Form Layanan Publik - Standard Government Format

## 📋 Struktur Form yang Telah Dibuat

### 1. **Jenis Surat** (Bagian Identifikasi)
- **Input Jenis Surat**: Otomatis terisi berdasarkan pilihan layanan
- **Kepala Dukun**: Input manual untuk kepala dukun
- **Tanggal Surat**: Input date picker untuk tanggal surat

### 2. **Data Pribadi** (Bagian Identitas)
- **NIK**: 16 digit NIK sesuai KTP (Required)
- **No KK**: 16 digit No Kartu Keluarga (Required)
- **Nama**: Nama lengkap sesuai KTP (Required)
- **Alamat**: Alamat lengkap (Required)
- **Email**: Email pemohon (Optional)
- **No Handphone**: Nomor telepon aktif (Required)

### 3. **Deskripsi** (Bagian Keperluan)
- **Textarea**: Area untuk menjelaskan keperluan atau deskripsi permohonan

### 4. **Upload Dokumen** (Bagian Pendukung)
- **Foto/Scan KK**: Upload dokumen Kartu Keluarga
- **Foto/Scan KTP**: Upload dokumen KTP
- Support format: Image (.jpg, .png, .gif) dan PDF

## ✅ Fitur yang Telah Diimplementasi

### Form Validation
- Validasi required fields (NIK, No KK, Nama, Alamat, No Handphone)
- Format validation untuk NIK (16 digit)
- Email format validation

### Integration
- Terintegrasi dengan `layananPublikService.ts`
- Data tersimpan ke Firestore collection `layanan-publik`
- Notification system untuk admin
- Real-time status tracking

### UI/UX Features
- Modern gradient design
- Mobile-responsive layout
- Loading states dan feedback
- Drag & drop file upload
- Clean card-based sections
- Consistent dengan design system desa

### Data Structure (Firestore)
```typescript
{
  jenisLayanan: string,        // Jenis surat/layanan
  judulSurat: string,          // Judul surat
  namaLengkap: string,         // Nama lengkap
  nik: string,                 // NIK 16 digit
  noKK: string,                // No Kartu Keluarga
  alamat: string,              // Alamat lengkap
  noTelepon: string,           // No Handphone
  email?: string,              // Email (optional)
  keperluan: string,           // Deskripsi keperluan
  catatanTambahan: string,     // Info tambahan (Kepala Dukun, Tanggal)
  status: 'pending',           // Initial status
  userId: string,              // ID pengguna
  createdAt: Timestamp,        // Waktu pembuatan
  updatedAt: Timestamp         // Waktu update
}
```

## 🔄 Workflow Terintegrasi

1. **Masyarakat**: Mengisi form → Submit permohonan
2. **System**: Simpan data ke Firestore → Kirim notifikasi ke admin
3. **Admin**: Terima notifikasi → Review permohonan → Approve/Reject/Process
4. **Masyarakat**: Dapat notifikasi status → Lihat di riwayat

## 🎯 Sesuai Standard Pemerintah

Form ini telah disesuaikan dengan format standar dokumen pemerintahan yang mencakup:
- Identitas lengkap pemohon
- Dokumen pendukung yang diperlukan
- Struktur data yang terorganisir
- Validasi yang memadai
- Audit trail yang jelas

## 📱 Akses Form

Form dapat diakses melalui:
- `/masyarakat/layanan-publik` → Pilih jenis layanan → Form otomatis terbuka
- Form responsif untuk mobile dan desktop
- Integrasi dengan bottom navigation

## 🔐 Security Features

- Input sanitization
- File type validation
- Required field validation
- User session management (temporary user ID)