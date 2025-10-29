// Role-based permission definitions
export type UserRole = 
  | 'admin' 
  | 'kepala_desa' 
  | 'kepala_dusun' 
  | 'admin_desa' 
  | 'warga_dpkj' 
  | 'warga_luar';

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

export const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
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
  kepala_desa: {
    'e-news': { read: true, create: true, update: true, delete: false },
    'profil-desa': { read: true, create: false, update: true, delete: false },
    'regulasi-desa': { read: true, create: true, update: true, delete: false },
    'keuangan': { read: true, create: true, update: true, delete: false },
    'layanan-publik': { read: true, create: true, update: true, delete: false },
    'ikm': { read: true, create: true, update: true, delete: false },
    'wisata-budaya': { read: true, create: true, update: true, delete: false },
    'pengaduan': { read: true, create: false, update: true, delete: false },
    'e-umkm': { read: true, create: false, update: false, delete: false },
    'kelola-pengguna': { read: true, create: false, update: false, delete: false },
    'data-desa': { read: true, create: true, update: true, delete: false },
  },
  kepala_dusun: {
    'e-news': { read: true, create: true, update: false, delete: false },
    'profil-desa': { read: true, create: false, update: false, delete: false },
    'regulasi-desa': { read: true, create: false, update: false, delete: false },
    'keuangan': { read: true, create: false, update: false, delete: false },
    'layanan-publik': { read: true, create: true, update: false, delete: false },
    'ikm': { read: true, create: true, update: false, delete: false },
    'wisata-budaya': { read: true, create: true, update: false, delete: false },
    'pengaduan': { read: true, create: false, update: false, delete: false },
    'e-umkm': { read: true, create: false, update: false, delete: false },
    'kelola-pengguna': { read: false, create: false, update: false, delete: false },
    'data-desa': { read: true, create: false, update: false, delete: false },
  },
  admin_desa: {
    'e-news': { read: true, create: true, update: true, delete: false },
    'profil-desa': { read: true, create: true, update: true, delete: false },
    'regulasi-desa': { read: true, create: true, update: true, delete: false },
    'keuangan': { read: true, create: false, update: false, delete: false },
    'layanan-publik': { read: true, create: true, update: true, delete: false },
    'ikm': { read: true, create: true, update: true, delete: false },
    'wisata-budaya': { read: true, create: true, update: true, delete: false },
    'pengaduan': { read: true, create: false, update: false, delete: false },
    'e-umkm': { read: true, create: false, update: false, delete: false },
    'kelola-pengguna': { read: false, create: false, update: false, delete: false },
    'data-desa': { read: true, create: true, update: true, delete: false },
  },
  warga_dpkj: {
    'e-news': { read: true, create: false, update: false, delete: false },
    'profil-desa': { read: true, create: false, update: false, delete: false },
    'regulasi-desa': { read: true, create: false, update: false, delete: false },
    'keuangan': { read: true, create: false, update: false, delete: false },
    'layanan-publik': { read: true, create: true, update: false, delete: false },
    'ikm': { read: true, create: false, update: false, delete: false },
    'wisata-budaya': { read: true, create: false, update: false, delete: false },
    'pengaduan': { read: true, create: true, update: false, delete: false },
    'e-umkm': { read: true, create: true, update: true, delete: false },
    'kelola-pengguna': { read: false, create: false, update: false, delete: false },
    'data-desa': { read: true, create: false, update: false, delete: false },
  },
  warga_luar: {
    'e-news': { read: true, create: false, update: false, delete: false },
    'profil-desa': { read: true, create: false, update: false, delete: false },
    'regulasi-desa': { read: true, create: false, update: false, delete: false },
    'keuangan': { read: false, create: false, update: false, delete: false },
    'layanan-publik': { read: true, create: true, update: false, delete: false },
    'ikm': { read: true, create: false, update: false, delete: false },
    'wisata-budaya': { read: true, create: false, update: false, delete: false },
    'pengaduan': { read: true, create: true, update: false, delete: false },
    'e-umkm': { read: true, create: false, update: false, delete: false },
    'kelola-pengguna': { read: false, create: false, update: false, delete: false },
    'data-desa': { read: false, create: false, update: false, delete: false },
  },
};

export function hasPermission(
  role: UserRole, 
  module: keyof RolePermissions, 
  action: keyof Permission
): boolean {
  const modulePerms = rolePermissions[role]?.[module];
  if (!modulePerms) return false;
  return modulePerms[action] === true;
}

export function getAccessibleModules(role: UserRole): string[] {
  const perms = rolePermissions[role];
  return Object.entries(perms)
    .filter(([, perm]) => perm.read)
    .map(([module]) => module);
}

export const roleDescriptions: Record<UserRole, { title: string; description: string }> = {
  admin: {
    title: 'User Administrator',
    description: 'Akses penuh ke sistem',
  },
  kepala_desa: {
    title: 'User Kepala Desa',
    description: 'Manajemen desa & publik',
  },
  kepala_dusun: {
    title: 'User Kepala Dusun',
    description: 'Koordinasi wilayah dusun',
  },
  admin_desa: {
    title: 'User Admin Desa',
    description: 'Pengelolaan konten desa',
  },
  warga_dpkj: {
    title: 'User Warga DPKJ',
    description: 'Perwakilan masyarakat',
  },
  warga_luar: {
    title: 'User Warga Luar DPKJ',
    description: 'Akses terbatas',
  },
};
