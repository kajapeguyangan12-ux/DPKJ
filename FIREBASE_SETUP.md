# Firebase Setup Guide untuk SiPeka Peguyangan

## ⚠️ PENTING: Langkah-Langkah WAJIB Diikuti

## 1. Deploy Firestore Rules (LANGKAH PERTAMA)

### Step 1: Copy Firestore Rules
1. Buka file `firestore.rules` di root project
2. Copy seluruh isinya

### Step 2: Deploy ke Firebase Console
1. Buka [Firebase Console](https://console.firebase.google.com)
2. Pilih project Anda
3. Di sidebar, klik **Firestore Database**
4. Buka tab **Rules**
5. **Hapus** semua rules yang ada
6. **Paste** isi firestore.rules
7. Klik **Publish**

**PASTIKAN PUBLISH BERHASIL!** (harus ada notifikasi "Rules Published")

---

## 2. Membuat Admin User (LANGKAH KEDUA)

### Step 1: Buat User di Authentication

1. Di sidebar, klik **Authentication**
2. Klik tab **Users** (atau Sign-in method → Email/Password)
3. Klik **Add user** atau **Create user**
4. Isi form:
   - **Email:** `admin@peguyangan.local` (atau email lain)
   - **Password:** `Admin@123456` (password minimal 6 karakter)
5. Klik **Add user**
6. **COPY USER UID** yang muncul di list (string panjang seperti: `abc123def456...`)

### Step 2: Buat Admin Document di Firestore

1. Buka **Firestore Database**
2. Klik **Create collection** (atau **Start collection** jika baru)
3. **Collection name:** `admins`
4. Klik **Next**
5. **Document ID:** Paste UID yang sudah dicopy
6. Klik **Auto ID** jika tidak ingin copy manual, atau paste UID-nya
7. Klik **Save** atau **Next**

**Di halaman form tambah field:**

Field 1:
- **Field name:** `role`
- **Type:** `string`
- **Value:** `admin`

Klik **Save**

#### (Optional) Tambah field tambahan:
- `name` (string): "Admin Peguyangan"
- `email` (string): "admin@peguyangan.local"
- `createdAt` (timestamp): current date

**Contoh struktur admin document:**
```
Collection: admins
Document ID: <USER_UID>
Fields:
  - role: "admin" (string)
  - name: "Admin Peguyangan" (string)
  - email: "admin@peguyangan.local" (string)
  - createdAt: 2024-10-28 (timestamp)
```

---

## 3. Setup Firebase Storage

### Step 1: Aktifkan Storage

1. Di sidebar, klik **Storage**
2. Klik **Start**
3. Pilih region: **asia-southeast1** (Indonesia)
4. Klik **Done**

### Step 2: Update Storage Rules

1. Di tab **Rules** (Storage)
2. Ganti semua dengan kode ini:

```plaintext
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profil-desa/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

3. Klik **Publish**

---

## 4. Testing Aplikasi

### Pre-requisite:
- ✅ Firestore Rules sudah di-publish
- ✅ User admin sudah dibuat
- ✅ Admin document sudah ada dengan role: "admin"
- ✅ Storage sudah diaktifkan

### Test Step by Step:

#### 1. Start Aplikasi
```bash
npm run dev
```

#### 2. Login ke Admin Panel
- Buka: `http://localhost:3000/admin/login`
- Email: `admin@peguyangan.local`
- Password: `Admin@123456`
- Klik **Login**

Jika berhasil, akan redirect ke `/admin/home`

#### 3. Test Buat Sejarah
- Go to: `http://localhost:3000/admin/profil-desa/sejarah`
- Klik **Tambah Sejarah** atau **Edit Sejarah** (jika ada)
- Isi form:
  - Deskripsi: "Test deskripsi sejarah"
  - Asal Usul: "Test asal usul"
  - Tahun Berdiri: "2020"
  - Hari Jadi: "28 Oktober"
  - Tokoh Pendiri: "Bapak XYZ"
  - Perkembangan: "Test perkembangan"
  - Foto: (optional) upload gambar
- Klik **Simpan**

**JIKA BERHASIL:** Data akan tersimpan dan muncul di halaman

#### 4. Test Edit
- Dari halaman sejarah, klik **Edit Sejarah**
- Ubah salah satu field
- Klik **Simpan Perubahan**

#### 5. Test Delete
- Klik **Hapus**
- Klik **Ya** di confirmation dialog
- Data akan terhapus

#### 6. Test Public Read (tanpa login)
- Buka: `http://localhost:3000/masyarakat/profil-desa/sejarah`
- Harus bisa lihat data yang sudah diinput (READ akses publik)

---

## 5. Troubleshooting

### ❌ Error: "Missing or insufficient permissions"

**Kemungkinan 1: Rules belum di-publish**
- Cek di Firebase Console → Firestore → Rules
- Pastikan rules sudah terupdate (bukan rules lama)
- Publish lagi jika perlu

**Kemungkinan 2: User tidak ada di admins collection**
- Buka Firebase Console → Firestore
- Cek collection `admins` ada atau tidak
- Cek document dengan ID = User UID ada atau tidak
- Jika tidak ada, buat sesuai Langkah 2

**Kemungkinan 3: Field role salah atau tidak ada**
- Buka Firebase Console → Firestore → admins collection
- Buka document user
- Cek field `role` ada dan valuenya adalah `admin` (bukan `admin_desa` atau string lain)
- Jika tidak ada, tambah field manual

**Solusi Cepat:**
1. Logout dari aplikasi
2. Tunggu 5-10 detik
3. Login lagi
4. Coba create data lagi

### ❌ Error: "Permission denied"

Ini berbeda dengan "Missing or insufficient permissions"

**Solusi:**
- Pastikan User UID di database admin PERSIS SAMA dengan User UID di Authentication
- Jangan ada spasi atau karakter yang berbeda

### ❌ Upload foto gagal

**Penyebab:**
- Storage belum diaktifkan
- Storage rules belum di-update

**Solusi:**
- Ikuti Langkah 3 (Setup Firebase Storage)
- Publish storage rules

### ❌ Login gagal

**Penyebab:**
- Email/password salah
- User belum dibuat

**Solusi:**
- Buka Firebase Console → Authentication
- Lihat user yang sudah ada
- Gunakan email yang terdaftar
- Pastikan password benar (jangan ada spasi)

---

## 6. Daftar Collection yang Akan Digunakan

| Collection | Purpose | Public Read | Admin Write |
|-----------|---------|-------------|------------|
| `admins` | Data admin users | No (only self) | Only self |
| `users` | Regular users | No (only self) | Only self |
| `e-news` | Berita | Yes | Admin |
| `pengumuman` | Pengumuman | Yes | Admin |
| `profil-desa` | Profil Desa | Yes | Admin |
| `wilayah` | Wilayah Desa | Yes | Admin |
| `sejarah` | Sejarah Desa | Yes | Admin |
| `visi-misi` | Visi & Misi | Yes | Admin |

---

## 7. Quick Reference

### Test Admin Credentials:
```
Email: admin@peguyangan.local
Password: Admin@123456
```

### Firestore Rules File:
- Location: `firestore.rules` (root project)

### Storage Rules Location:
- Firebase Console → Storage → Rules tab

### Admin User Setup Location:
- Firebase Console → Firestore → admins collection

---

## 8. CHECKLIST Sebelum Testing

Pastikan ini sudah selesai:

- [ ] Firestore Database sudah dibuat
- [ ] Firestore Rules sudah di-publish
- [ ] Firebase Authentication sudah aktif
- [ ] User admin sudah dibuat di Authentication
- [ ] User UID sudah dicopy dengan benar
- [ ] Admin collection sudah dibuat di Firestore
- [ ] Admin document sudah dibuat dengan UID sebagai ID
- [ ] Field `role: "admin"` sudah ditambah
- [ ] Firebase Storage sudah aktif
- [ ] Storage rules sudah di-publish
- [ ] npm run dev sudah jalan
- [ ] Bisa login ke `/admin/login`

Jika semua checklist ✅, aplikasi siap testing!

---

## 9. Tips Debugging

Jika masih error:

1. **Buka Browser DevTools** (F12)
2. **Tab Console** - lihat error message yang lebih detail
3. **Tab Network** - cek request ke Firestore
4. **Cek Firebase Emulator** (opsional, untuk advanced)

---

Untuk bantuan lebih lanjut, cek file `firestore.rules` di root project atau lihat dokumentasi Firebase official.

