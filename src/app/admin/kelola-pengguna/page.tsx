"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { RoleCardType } from './components/RoleCard';
import UserManagementList from './components/UserManagementList';
import AdminLayout from '../components/AdminLayout';
import AdminHeaderCard, { AdminHeaderSearchBar, AdminHeaderAccount } from "../../components/AdminHeaderCard";
import { UserRole } from '../../../lib/rolePermissions';

const roleCards: RoleCardType[] = [
  { id: 'admin', title: 'User Administrator', description: 'Akses penuh ke sistem', icon: '👨‍💻' },
  { id: 'kepala_desa', title: 'User Kepala Desa', description: 'Manajemen desa & publik', icon: '👔' },
  { id: 'kepala_dusun', title: 'User Kepala Dusun', description: 'Koordinasi wilayah dusun', icon: '🏘️' },
  { id: 'admin_desa', title: 'User Admin Desa', description: 'Pengelolaan konten desa', icon: '📋' },
  { id: 'warga_dpkj', title: 'User Warga DPKJ', description: 'Perwakilan masyarakat', icon: '👨‍🤝‍👨' },
  { id: 'warga_luar', title: 'User Warga Luar DPKJ', description: 'Akses terbatas', icon: '👤' },
];

export default function KelolaPenggunaPage() {
  const router = useRouter();
  const [listRole, setListRole] = useState<RoleCardType | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <AdminHeaderCard title="Kelola Pengguna">
          <AdminHeaderSearchBar />
          <AdminHeaderAccount onLogout={handleLogout} />
        </AdminHeaderCard>

        {/* Role Selection View */}
        {!listRole && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pilih Role Pengguna</h2>
              <p className="text-gray-600">Kelola pengguna berdasarkan role dan permission mereka</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {roleCards.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setListRole(role)}
                  className="group text-left p-6 rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-lg transform transition-all duration-300 cursor-pointer hover:border-gray-300 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md flex-shrink-0">
                      <div className="text-4xl">{role.icon}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">{role.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User Management View */}
        {listRole && (
          <div>
            <div className="mb-8">
              <button 
                onClick={() => setListRole(null)} 
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 font-medium transition-colors mb-6"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali ke Daftar Role
              </button>
            </div>

            <UserManagementList 
              roleId={listRole.id as UserRole} 
              roleLabel={listRole.title}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
