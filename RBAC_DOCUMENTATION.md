# Sistem Role-Based User Management

## Struktur yang Telah Dibuat

### 1. File Utilities untuk Permissions (`src/lib/rolePermissions.ts`)

Mendefinisikan 6 role dengan permission berbeda untuk setiap module:

**Role yang tersedia:**
- `admin` - Administrator (Akses penuh ke semua)
- `kepala_desa` - Kepala Desa (Manajemen desa & publik)
- `kepala_dusun` - Kepala Dusun (Koordinasi wilayah dusun)
- `admin_desa` - Admin Desa (Pengelolaan konten desa)
- `warga_dpkj` - Warga DPKJ (Perwakilan masyarakat)
- `warga_luar` - Warga Luar DPKJ (Akses terbatas)

### 2. Permission Details

Setiap role memiliki permission berbeda untuk module:
- E-News
- Profil Desa
- Regulasi Desa
- Keuangan
- Layanan Publik
- IKM
- Wisata & Budaya
- Pengaduan
- E-UMKM
- Kelola Pengguna
- Data Desa

Permission terdiri dari 4 action:
- `read` - Lihat data
- `create` - Buat data baru
- `update` - Ubah data
- `delete` - Hapus data

### 3. User Service (`src/lib/userService.ts`)

Menyediakan fungsi CRUD untuk user management:

**Interface User:**
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Fungsi yang tersedia:**
- `getAllUsers()` - Ambil semua user
- `getUsersByRole(role)` - Ambil user berdasarkan role
- `getUser(userId)` - Ambil single user
- `createUser(data)` - Buat user baru
- `updateUser(userId, data)` - Update user
- `deleteUser(userId)` - Hapus user
- `userExists(email)` - Cek user ada atau tidak

### 4. Firestore Collections Schema

**Collection: `users`**
```
users/
  ├── userId1
  │   ├── username: string
  │   ├── email: string
  │   ├── fullName: string
  │   ├── role: 'admin' | 'kepala_desa' | ... (UserRole)
  │   ├── isActive: boolean
  │   ├── createdAt: Timestamp
  │   └── updatedAt: Timestamp
  └── userId2
      └── ...
```

### 5. UI Components

**UserManagementList (`src/app/admin/kelola-pengguna/components/UserManagementList.tsx`)**
- Form modal untuk tambah/edit user
- List user berdasarkan role
- Action buttons: Edit, Hapus
- Status badge (Aktif/Nonaktif)

### 6. Updated Pages

**Kelola Pengguna Page (`src/app/admin/kelola-pengguna/page.tsx`)**
- Tampilkan 6 role card
- Klik role untuk lihat user management
- Integrated dengan Firestore

## Permission Matrix

### Admin (akses_penuh)
```
E-News:           ✓ Read, Create, Update, Delete
Profil Desa:      ✓ Read, Create, Update, Delete
Regulasi Desa:    ✓ Read, Create, Update, Delete
Keuangan:         ✓ Read, Create, Update, Delete
Layanan Publik:   ✓ Read, Create, Update, Delete
IKM:              ✓ Read, Create, Update, Delete
Wisata & Budaya:  ✓ Read, Create, Update, Delete
Pengaduan:        ✓ Read, Create, Update, Delete
E-UMKM:           ✓ Read, Create, Update, Delete
Kelola Pengguna:  ✓ Read, Create, Update, Delete
Data Desa:        ✓ Read, Create, Update, Delete
```

### Kepala Desa (manajemen_desa)
```
E-News:           ✓ Read, Create, Update
Profil Desa:      ✓ Read, Update
Regulasi Desa:    ✓ Read, Create, Update
Keuangan:         ✓ Read, Create, Update
Layanan Publik:   ✓ Read, Create, Update
IKM:              ✓ Read, Create, Update
Wisata & Budaya:  ✓ Read, Create, Update
Pengaduan:        ✓ Read, Update
E-UMKM:           ✓ Read
Kelola Pengguna:  ✗ No Access
Data Desa:        ✓ Read, Create, Update
```

### Kepala Dusun (koordinasi_dusun)
```
E-News:           ✓ Read, Create
Profil Desa:      ✓ Read
Regulasi Desa:    ✓ Read
Keuangan:         ✓ Read
Layanan Publik:   ✓ Read, Create
IKM:              ✓ Read, Create
Wisata & Budaya:  ✓ Read, Create
Pengaduan:        ✓ Read
E-UMKM:           ✓ Read
Kelola Pengguna:  ✗ No Access
Data Desa:        ✓ Read
```

### Admin Desa (pengelolaan_konten)
```
E-News:           ✓ Read, Create, Update
Profil Desa:      ✓ Read, Create, Update
Regulasi Desa:    ✓ Read, Create, Update
Keuangan:         ✓ Read
Layanan Publik:   ✓ Read, Create, Update
IKM:              ✓ Read, Create, Update
Wisata & Budaya:  ✓ Read, Create, Update
Pengaduan:        ✓ Read
E-UMKM:           ✓ Read
Kelola Pengguna:  ✗ No Access
Data Desa:        ✓ Read, Create, Update
```

### Warga DPKJ (perwakilan_masyarakat)
```
E-News:           ✓ Read
Profil Desa:      ✓ Read
Regulasi Desa:    ✓ Read
Keuangan:         ✓ Read
Layanan Publik:   ✓ Read, Create
IKM:              ✓ Read
Wisata & Budaya:  ✓ Read
Pengaduan:        ✓ Read, Create
E-UMKM:           ✓ Read, Create, Update
Kelola Pengguna:  ✗ No Access
Data Desa:        ✓ Read
```

### Warga Luar DPKJ (akses_terbatas)
```
E-News:           ✓ Read
Profil Desa:      ✓ Read
Regulasi Desa:    ✓ Read
Keuangan:         ✗ No Access
Layanan Publik:   ✓ Read, Create
IKM:              ✓ Read
Wisata & Budaya:  ✓ Read
Pengaduan:        ✓ Read, Create
E-UMKM:           ✓ Read
Kelola Pengguna:  ✗ No Access
Data Desa:        ✗ No Access
```

## Cara Menggunakan

### 1. Membuat User Baru
```typescript
import { createUser } from '@/lib/userService';

await createUser({
  username: 'kepala_desa1',
  email: 'kepala@desa.com',
  fullName: 'Budi Santoso',
  role: 'kepala_desa',
});
```

### 2. Mengecek Permission
```typescript
import { hasPermission } from '@/lib/rolePermissions';

const canEdit = hasPermission('kepala_desa', 'e-news', 'update');
if (canEdit) {
  // Tampilkan button Edit
}
```

### 3. Mendapatkan Modul yang Accessible
```typescript
import { getAccessibleModules } from '@/lib/rolePermissions';

const modules = getAccessibleModules('warga_dpkj');
// Hasilnya: ['e-news', 'profil-desa', ...]
```

## Integrasi Selanjutnya

Untuk melengkapi sistem RBAC:

1. **Auth Context** - Simpan user role saat login
2. **Route Protection** - Validasi akses halaman berdasarkan role
3. **Menu Filtering** - Tampilkan menu hanya untuk modul yang accessible
4. **API Protection** - Validasi permission di API routes
5. **Audit Logging** - Catat semua aksi user

## Firestore Rules

Recommended Firestore security rules:
```
match /users/{userId} {
  allow read: if request.auth.uid != null;
  allow write: if request.auth.uid != null && 
               get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```
