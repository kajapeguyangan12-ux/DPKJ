# RBAC (Role-Based Access Control) Documentation

## Overview
Sistem manajemen pengguna dengan kontrol akses berbasis role yang komprehensif untuk aplikasi DPKJ. Sistem ini menggunakan Firebase untuk autentikasi dan Firestore untuk penyimpanan data.

## User Roles

### 1. Administrator (Super Admin)
- **Akses**: Penuh ke seluruh sistem admin dan masyarakat
- **Permissions**: CRUD untuk semua fitur
- **Admin Panel**: ✅ Penuh
- **Masyarakat Panel**: ✅ Penuh

### 2. Admin Desa
- **Akses**: Admin kecuali kelola pengguna dan data desa
- **Permissions**: CRUD untuk hampir semua fitur kecuali user management dan data desa
- **Admin Panel**: ✅ Terbatas
- **Masyarakat Panel**: ✅ Penuh

### 3. Kepala Desa
- **Akses**: Data desa & layanan publik (admin) + halaman masyarakat
- **Permissions**: CRUD untuk data desa dan layanan publik
- **Admin Panel**: ✅ Terbatas (data desa, layanan publik)
- **Masyarakat Panel**: ✅ Penuh

### 4. Kepala Dusun
- **Akses**: Pengaduan & layanan publik (admin) + halaman masyarakat
- **Permissions**: CRUD untuk pengaduan dan layanan publik
- **Admin Panel**: ✅ Terbatas (pengaduan, layanan publik)
- **Masyarakat Panel**: ✅ Penuh

### 5. Warga DPKJ
- **Akses**: Penuh ke fitur masyarakat
- **Permissions**: Akses lengkap halaman masyarakat
- **Admin Panel**: ❌ Tidak ada
- **Masyarakat Panel**: ✅ Penuh

### 6. Warga Luar DPKJ
- **Akses**: Terbatas - profil desa, e-news, UMKM, wisata budaya
- **Permissions**: Hanya halaman publik
- **Admin Panel**: ❌ Tidak ada
- **Masyarakat Panel**: ✅ Terbatas

## Firebase Collections Structure

### 1. `users` Collection
```typescript
interface FirestoreUser {
  uid: string;              // Firebase Auth UID
  email: string;            // Email login
  displayName: string;      // Nama lengkap
  role: UserRole;          // Role pengguna
  status: UserStatus;      // Status: active | inactive | suspended | pending
  idNumber?: string;       // Nomor ID/NIK untuk login
  phoneNumber?: string;    // Nomor telepon
  address?: string;        // Alamat lengkap
  profileImageUrl?: string; // URL foto profil
  createdAt: Timestamp;    // Waktu dibuat
  updatedAt: Timestamp;    // Waktu diupdate
  lastLoginAt?: Timestamp; // Login terakhir
  createdBy?: string;      // Admin yang membuat (jika manual)
  notes?: string;          // Catatan admin
}
```

### 2. `user-profiles` Collection (Optional Extended Data)
```typescript
interface UserProfile {
  uid: string;
  personalInfo: {
    birthDate?: Date;
    birthPlace?: string;
    gender?: 'L' | 'P';
    maritalStatus?: string;
  };
  preferences: {
    notifications: boolean;
    language: string;
    theme: 'light' | 'dark';
  };
}
```

### 3. `user-sessions` Collection
```typescript
interface UserSession {
  uid: string;
  sessionId: string;
  createdAt: Timestamp;
  lastActivity: Timestamp;
  deviceInfo?: string;
  ipAddress?: string;
}
```

### 4. `admin-logs` Collection
```typescript
interface AdminLog {
  adminId: string;         // UID admin yang melakukan aksi
  action: string;          // CREATE_USER | UPDATE_USER | DELETE_USER | etc.
  description: string;     // Deskripsi aktivitas
  metadata: any;           // Data tambahan (target user, changes, etc.)
  timestamp: Timestamp;    // Waktu aktivitas
}
```

### 5. `role-requests` Collection (Future Feature)
```typescript
interface RoleRequest {
  userId: string;
  requestedRole: UserRole;
  currentRole: UserRole;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Timestamp;
  processedAt?: Timestamp;
  processedBy?: string;
}
```

## Authentication Flow

### 1. Login Process
1. User memasukkan **ID Number** dan **Password**
2. System mencari user berdasarkan `idNumber` di collection `users`
3. Jika ditemukan, login menggunakan `email` dan `password` ke Firebase Auth
4. Update `lastLoginAt` di Firestore
5. Set user data dan role di context/state management

### 2. Auto Role Assignment
- User baru yang registrasi mandiri (non-admin) otomatis mendapat role `warga_dpkj`
- Admin dapat mengubah role user melalui admin panel

### 3. Role Validation
- Setiap request API/page access dicek rolenya
- Middleware menvalidasi permission berdasarkan role
- Unauthorized access di-redirect ke halaman yang sesuai

## Implementation Files

### Core Files
1. **`src/lib/rolePermissions.ts`**
   - Role definitions dan permission mappings
   - Helper functions untuk permission checking
   - Firebase collections constants

2. **`src/lib/userManagementService.ts`**
   - Service untuk CRUD operations users
   - Firebase integration
   - Admin activity logging

3. **`src/app/masyarakat/lib/useCurrentUser.ts`**
   - React hook untuk current user state
   - Role type definitions
   - Authentication state management

### Admin Panel Files
1. **`src/app/admin/kelola-pengguna/page.tsx`**
   - Main page untuk user management
   - Role selection interface

2. **`src/app/admin/kelola-pengguna/components/UserListNew.tsx`**
   - List user berdasarkan role
   - User cards dengan actions

3. **`src/app/admin/kelola-pengguna/components/UserRegistrationForm.tsx`**
   - Form untuk membuat user baru
   - Role assignment dan validation

## Permission Helper Functions

### Usage Examples
```typescript
import { 
  hasPermission, 
  canAccessAdminPanel, 
  canAccessMasyarakatPanel,
  canAccessMasyarakatPage 
} from '@/lib/rolePermissions';

// Check specific permission
const canCreateNews = hasPermission(userRole, 'e-news', 'create');

// Check panel access
const canSeeAdmin = canAccessAdminPanel(userRole);

// Check specific page access
const canSeePengaduan = canAccessMasyarakatPage(userRole, 'pengaduan');
```

### Middleware Integration
```typescript
// Example middleware for page protection
function requireRole(allowedRoles: UserRole[]) {
  return (req, res, next) => {
    const userRole = getUserRoleFromSession(req);
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}
```

## Admin Registration Process

### 1. Super Admin Creates Admin Users
- Only `administrator` role can create other admin users
- New admin users get appropriate roles assigned
- Email invitation sent with temporary password

### 2. Self Registration (Masyarakat)
- Users can register themselves via `/masyarakat/daftar`
- Automatically assigned `warga_dpkj` role
- Can be changed by admin if needed

### 3. ID-Based Login System
- Users login using ID Number instead of email
- System maps ID Number to email internally
- More user-friendly for non-technical users

## Security Considerations

### 1. Role Validation
- Always validate role on server-side
- Never trust client-side role information
- Use middleware for consistent checking

### 2. Permission Granularity
- CRUD permissions for each feature
- Page-level access control
- API endpoint protection

### 3. Audit Trail
- All admin actions logged
- User creation/modification tracked
- Suspicious activity monitoring

### 4. Password Policy
- Minimum 6 characters
- Email validation required
- Secure password reset flow

## Future Enhancements

### 1. Advanced Features
- Role request system (users can request role upgrades)
- Bulk user import from Excel/CSV
- User session management
- Advanced audit reporting

### 2. UI Improvements
- User profile management
- Role permission visualization
- Advanced search and filtering
- Bulk operations

### 3. Integration
- SMS/WhatsApp notifications
- Social media login integration
- Two-factor authentication
- Advanced reporting dashboard

## Migration Guide

### From Old System
1. Export existing users data
2. Map old roles to new role system
3. Create Firebase collections
4. Import users using batch creation
5. Update authentication flow
6. Test permission system

### Deployment Checklist
- [ ] Firebase project configured
- [ ] Environment variables set
- [ ] Firestore security rules updated
- [ ] Admin user created
- [ ] Role permissions tested
- [ ] Authentication flow verified
- [ ] Backup strategy implemented

## Troubleshooting

### Common Issues
1. **User can't login**: Check if idNumber exists in Firestore
2. **Permission denied**: Verify role assignment and permission mappings
3. **Firebase errors**: Check API keys and project configuration
4. **Role not updating**: Clear cache and re-authenticate

### Debug Tools
```typescript
// Debug current user permissions
console.log('User role:', user.role);
console.log('Can access admin:', canAccessAdminPanel(user.role));
console.log('News permissions:', rolePermissions[user.role]['e-news']);
```

## Contact & Support
- Developer: GitHub Copilot Assistant
- Documentation: Updated December 2024
- Version: 1.0.0