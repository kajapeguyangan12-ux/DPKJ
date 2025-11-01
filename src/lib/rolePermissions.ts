import { UserRole } from '../app/masyarakat/lib/useCurrentUser';

// Permission structure for CRUD operations
export interface Permission {
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

export interface RolePermissions {
  'e-news': Permission;
  'profil-desa': Permission;
  'regulasi-desa': Permission;
  'keuangan': Permission;
  'layanan-publik': Permission;
  'ikm': Permission;
  'wisata-budaya': Permission;
  'pengaduan': Permission;
  'e-umkm': Permission;
  'kelola-pengguna': Permission;
  'data-desa': Permission;
}

// Administrative access control
export interface AdminAccess {
  canAccessAdminPanel: boolean;
  canAccessMasyarakatPanel: boolean;
}

// Role permissions mapping
export const rolePermissions: Record<UserRole, RolePermissions> = {
  administrator: {
    'e-news': { read: true, create: true, update: true, delete: true },
    'profil-desa': { read: true, create: true, update: true, delete: true },
    'regulasi-desa': { read: true, create: true, update: true, delete: true },
    'keuangan': { read: true, create: true, update: true, delete: true },
    'layanan-publik': { read: true, create: true, update: true, delete: true },
    'ikm': { read: true, create: true, update: true, delete: true },
    'wisata-budaya': { read: true, create: true, update: true, delete: true },
    'pengaduan': { read: true, create: true, update: true, delete: true },
    'e-umkm': { read: true, create: true, update: true, delete: true },
    'kelola-pengguna': { read: true, create: true, update: true, delete: true },
    'data-desa': { read: true, create: true, update: true, delete: true },
  },
  
  admin_desa: {
    'e-news': { read: true, create: true, update: true, delete: true },
    'profil-desa': { read: true, create: true, update: true, delete: true },
    'regulasi-desa': { read: true, create: true, update: true, delete: true },
    'keuangan': { read: true, create: true, update: true, delete: true },
    'layanan-publik': { read: true, create: true, update: true, delete: true },
    'ikm': { read: true, create: true, update: true, delete: true },
    'wisata-budaya': { read: true, create: true, update: true, delete: true },
    'pengaduan': { read: true, create: true, update: true, delete: true },
    'e-umkm': { read: true, create: true, update: true, delete: true },
    'kelola-pengguna': { read: false, create: false, update: false, delete: false },
    'data-desa': { read: false, create: false, update: false, delete: false },
  },
  
  kepala_desa: {
    'e-news': { read: false, create: false, update: false, delete: false },
    'profil-desa': { read: false, create: false, update: false, delete: false },
    'regulasi-desa': { read: false, create: false, update: false, delete: false },
    'keuangan': { read: false, create: false, update: false, delete: false },
    'layanan-publik': { read: true, create: true, update: true, delete: true },
    'ikm': { read: false, create: false, update: false, delete: false },
    'wisata-budaya': { read: false, create: false, update: false, delete: false },
    'pengaduan': { read: false, create: false, update: false, delete: false },
    'e-umkm': { read: false, create: false, update: false, delete: false },
    'kelola-pengguna': { read: false, create: false, update: false, delete: false },
    'data-desa': { read: true, create: true, update: true, delete: true },
  },
  
  kepala_dusun: {
    'e-news': { read: false, create: false, update: false, delete: false },
    'profil-desa': { read: false, create: false, update: false, delete: false },
    'regulasi-desa': { read: false, create: false, update: false, delete: false },
    'keuangan': { read: false, create: false, update: false, delete: false },
    'layanan-publik': { read: true, create: true, update: true, delete: true },
    'ikm': { read: false, create: false, update: false, delete: false },
    'wisata-budaya': { read: false, create: false, update: false, delete: false },
    'pengaduan': { read: true, create: true, update: true, delete: true },
    'e-umkm': { read: false, create: false, update: false, delete: false },
    'kelola-pengguna': { read: false, create: false, update: false, delete: false },
    'data-desa': { read: false, create: false, update: false, delete: false },
  },
  
  warga_dpkj: {
    'e-news': { read: false, create: false, update: false, delete: false },
    'profil-desa': { read: false, create: false, update: false, delete: false },
    'regulasi-desa': { read: false, create: false, update: false, delete: false },
    'keuangan': { read: false, create: false, update: false, delete: false },
    'layanan-publik': { read: false, create: false, update: false, delete: false },
    'ikm': { read: false, create: false, update: false, delete: false },
    'wisata-budaya': { read: false, create: false, update: false, delete: false },
    'pengaduan': { read: false, create: false, update: false, delete: false },
    'e-umkm': { read: false, create: false, update: false, delete: false },
    'kelola-pengguna': { read: false, create: false, update: false, delete: false },
    'data-desa': { read: false, create: false, update: false, delete: false },
  },
  
  warga_luar_dpkj: {
    'e-news': { read: false, create: false, update: false, delete: false },
    'profil-desa': { read: false, create: false, update: false, delete: false },
    'regulasi-desa': { read: false, create: false, update: false, delete: false },
    'keuangan': { read: false, create: false, update: false, delete: false },
    'layanan-publik': { read: false, create: false, update: false, delete: false },
    'ikm': { read: false, create: false, update: false, delete: false },
    'wisata-budaya': { read: false, create: false, update: false, delete: false },
    'pengaduan': { read: false, create: false, update: false, delete: false },
    'e-umkm': { read: false, create: false, update: false, delete: false },
    'kelola-pengguna': { read: false, create: false, update: false, delete: false },
    'data-desa': { read: false, create: false, update: false, delete: false },
  },
  
  unknown: {
    'e-news': { read: false, create: false, update: false, delete: false },
    'profil-desa': { read: false, create: false, update: false, delete: false },
    'regulasi-desa': { read: false, create: false, update: false, delete: false },
    'keuangan': { read: false, create: false, update: false, delete: false },
    'layanan-publik': { read: false, create: false, update: false, delete: false },
    'ikm': { read: false, create: false, update: false, delete: false },
    'wisata-budaya': { read: false, create: false, update: false, delete: false },
    'pengaduan': { read: false, create: false, update: false, delete: false },
    'e-umkm': { read: false, create: false, update: false, delete: false },
    'kelola-pengguna': { read: false, create: false, update: false, delete: false },
    'data-desa': { read: false, create: false, update: false, delete: false },
  },
};

// Admin panel access control
export const adminAccess: Record<UserRole, AdminAccess> = {
  administrator: { canAccessAdminPanel: true, canAccessMasyarakatPanel: true },
  admin_desa: { canAccessAdminPanel: true, canAccessMasyarakatPanel: true },
  kepala_desa: { canAccessAdminPanel: true, canAccessMasyarakatPanel: true },
  kepala_dusun: { canAccessAdminPanel: true, canAccessMasyarakatPanel: true },
  warga_dpkj: { canAccessAdminPanel: false, canAccessMasyarakatPanel: true },
  warga_luar_dpkj: { canAccessAdminPanel: false, canAccessMasyarakatPanel: true },
  unknown: { canAccessAdminPanel: false, canAccessMasyarakatPanel: false },
};

// Masyarakat page access for each role
export const masyarakatPageAccess: Record<UserRole, Record<string, boolean>> = {
  administrator: {
    home: true, profile: true, 'profil-desa': true, 'e-news': true, 'e-umkm': true,
    'wisata-budaya': true, 'layanan-publik': true, pengaduan: true, keuangan: true,
    'data-desa': true, ikm: true, regulasi: true, riwayat: true, notifikasi: true,
  },
  admin_desa: {
    home: true, profile: true, 'profil-desa': true, 'e-news': true, 'e-umkm': true,
    'wisata-budaya': true, 'layanan-publik': true, pengaduan: true, keuangan: true,
    'data-desa': true, ikm: true, regulasi: true, riwayat: true, notifikasi: true,
  },
  kepala_desa: {
    home: true, profile: true, 'profil-desa': true, 'e-news': true, 'e-umkm': true,
    'wisata-budaya': true, 'layanan-publik': true, pengaduan: true, keuangan: true,
    'data-desa': true, ikm: true, regulasi: true, riwayat: true, notifikasi: true,
  },
  kepala_dusun: {
    home: true, profile: true, 'profil-desa': true, 'e-news': true, 'e-umkm': true,
    'wisata-budaya': true, 'layanan-publik': true, pengaduan: true, keuangan: true,
    'data-desa': true, ikm: true, regulasi: true, riwayat: true, notifikasi: true,
  },
  warga_dpkj: {
    home: true, profile: true, 'profil-desa': true, 'e-news': true, 'e-umkm': true,
    'wisata-budaya': true, 'layanan-publik': true, pengaduan: true, keuangan: true,
    'data-desa': true, ikm: true, regulasi: true, riwayat: true, notifikasi: true,
  },
  warga_luar_dpkj: {
    home: false, profile: false, 'profil-desa': true, 'e-news': true, 'e-umkm': true,
    'wisata-budaya': true, 'layanan-publik': false, pengaduan: false, keuangan: false,
    'data-desa': false, ikm: false, regulasi: false, riwayat: false, notifikasi: false,
  },
  unknown: {
    home: false, profile: false, 'profil-desa': false, 'e-news': false, 'e-umkm': false,
    'wisata-budaya': false, 'layanan-publik': false, pengaduan: false, keuangan: false,
    'data-desa': false, ikm: false, regulasi: false, riwayat: false, notifikasi: false,
  },
};

// Role descriptions
export const roleDescriptions: Record<UserRole, { title: string; description: string }> = {
  administrator: {
    title: 'Super Administrator',
    description: 'Akses penuh ke seluruh sistem admin dan masyarakat'
  },
  admin_desa: {
    title: 'Admin Desa',
    description: 'Akses admin kecuali kelola pengguna dan data desa'
  },
  kepala_desa: {
    title: 'Kepala Desa',
    description: 'Akses data desa & layanan publik + halaman masyarakat'
  },
  kepala_dusun: {
    title: 'Kepala Dusun',
    description: 'Akses pengaduan & layanan publik + halaman masyarakat'
  },
  warga_dpkj: {
    title: 'Warga DPKJ',
    description: 'Akses lengkap ke fitur masyarakat'
  },
  warga_luar_dpkj: {
    title: 'Warga Luar DPKJ',
    description: 'Akses terbatas: profil desa, e-news, UMKM, wisata budaya'
  },
  unknown: {
    title: 'Unknown',
    description: 'Role belum ditentukan'
  },
};

// Firebase collections structure
export const FIREBASE_COLLECTIONS = {
  USERS: 'users',
  USER_PROFILES: 'user-profiles',
  USER_SESSIONS: 'user-sessions',
  ADMIN_LOGS: 'admin-logs',
  ROLE_REQUESTS: 'role-requests',
} as const;

// User status types
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

// Extended user interface for Firestore
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  userName?: string;          // Username untuk identifikasi
  idNumber?: string;           // ID yang diperlukan untuk login
  phoneNumber?: string;
  address?: string;
  profileImageUrl?: string;
  createdAt: any;             // Firestore Timestamp
  updatedAt: any;             // Firestore Timestamp
  lastLoginAt?: any;          // Firestore Timestamp
  createdBy?: string;         // Admin yang membuat user (jika dibuat manual)
  notes?: string;             // Catatan admin
}

// Helper functions
export function hasPermission(role: UserRole, feature: keyof RolePermissions, action: keyof Permission): boolean {
  return rolePermissions[role]?.[feature]?.[action] || false;
}

export function canAccessAdminPanel(role: UserRole): boolean {
  return adminAccess[role]?.canAccessAdminPanel || false;
}

export function canAccessMasyarakatPanel(role: UserRole): boolean {
  return adminAccess[role]?.canAccessMasyarakatPanel || false;
}

export function canAccessMasyarakatPage(role: UserRole, page: string): boolean {
  return masyarakatPageAccess[role]?.[page] || false;
}

export function getRoleDescription(role: UserRole): string {
  return roleDescriptions[role]?.description || 'Role tidak dikenal';
}

export function getRoleTitle(role: UserRole): string {
  return roleDescriptions[role]?.title || 'Unknown';
}

export default {
  rolePermissions,
  adminAccess,
  masyarakatPageAccess,
  roleDescriptions,
  FIREBASE_COLLECTIONS,
  hasPermission,
  canAccessAdminPanel,
  canAccessMasyarakatPanel,
  canAccessMasyarakatPage,
  getRoleDescription,
  getRoleTitle,
};