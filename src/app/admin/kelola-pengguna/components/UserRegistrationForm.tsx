"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../../lib/firebase';
import { UserRole } from '../../../masyarakat/lib/useCurrentUser';
import { roleDescriptions, getRoleTitle, getRoleDescription } from '../../../../lib/rolePermissions';
import userManagementService, { CreateUserData } from '../../../../lib/userManagementService';
import { useCurrentUser } from '../../../masyarakat/lib/useCurrentUser';
import AdminRoleManager from './AdminRoleManager';

interface UserRegistrationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UserRegistrationForm({ onSuccess, onCancel }: UserRegistrationFormProps) {
  const router = useRouter();
  const { user: currentUser, loading: userLoading } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bypassMode, setBypassMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    displayName: '',        // Nama
    role: 'warga_dpkj' as UserRole,  // Role
    userName: '',           // User Name  
    phoneNumber: '',        // No. Telp
    email: '',             // Email
    password: '',          // Kata Sandi
    confirmPassword: ''    // Konfirmasi Kata Sandi
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData.email || !formData.password || !formData.displayName || !formData.role) {
      setError('Harap isi semua field yang wajib');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🎯 FORM: Submit started');
    console.log('📊 FORM: Current state:', {
      bypassMode,
      userLoading,
      currentUser: currentUser ? 'exists' : 'null',
      formData
    });
    
    const formValid = validateForm();
    console.log('📋 FORM: Form validation result:', formValid);
    if (!formValid) {
      console.log('❌ FORM: Form validation failed, stopping');
      return;
    }
    
    // Tunggu sampai user loading selesai
    if (userLoading) {
      console.log('⏳ FORM: User still loading, waiting...');
      setError('Mohon tunggu, sedang memuat data user...');
      return;
    }
    
    // Debug info
    console.log('👤 FORM: Current user:', currentUser);
    console.log('🏷️ FORM: User role:', currentUser?.role);
    
    // Set createdBy dengan prioritas berbeda
    const currentAuthUser = auth.currentUser;
    const createdBy = currentUser?.uid || currentAuthUser?.uid || `bypass-${Date.now()}`;
    console.log('📝 FORM: CreatedBy determined as:', createdBy);
    
    // Validasi berdasarkan currentUser dengan role yang lebih lengkap
    if (!currentUser && !bypassMode) {
      console.log('❌ FORM: No current user and no bypass mode');
      setError('Tidak dapat memverifikasi status login. Silakan refresh halaman atau login ulang.');
      return;
    }
    
    // SIMPLIFIED CHECK: Allow if bypass mode is active
    if (bypassMode) {
      console.log('🚀 FORM: BYPASS MODE active - user creation allowed');
    } else {
      console.log('🔒 FORM: Normal validation mode');
      
      // Check Firebase Auth first
      const firebaseUser = auth.currentUser;
      console.log('🔥 FORM: Firebase user:', firebaseUser ? 'exists' : 'null');
      
      // Development mode detection
      const isDevelopment = process.env.NODE_ENV === 'development' || 
                           window.location.hostname === 'localhost' || 
                           window.location.hostname.includes('127.0.0.1');
      
      console.log('🧪 FORM: Development mode:', isDevelopment);
      
      if (isDevelopment && firebaseUser) {
        // Allow in development mode with any Firebase user
        console.log('🚀 FORM: DEVELOPMENT MODE - allowing user creation for Firebase authenticated user');
      } else {
        console.log('🔍 FORM: Strict validation for production');
        
        // Strict validation for production
        const allowedRoles = ['administrator', 'admin_desa'];
        
        if (!currentUser || !currentUser.uid) {
          console.log('❌ FORM: No current user or UID');
          setError('Tidak dapat memverifikasi status login. Silakan aktifkan Bypass Mode atau setup role administrator terlebih dahulu.');
          return;
        }
        
        if (!allowedRoles.includes(currentUser.role)) {
          console.log('❌ FORM: Role not allowed:', currentUser.role);
          setError(`Akses ditolak. Role Anda (${currentUser.role}) tidak memiliki izin untuk membuat user baru. Silakan aktifkan Bypass Mode atau setup role administrator.`);
          return;
        }
        
        console.log('✅ FORM: Role validation passed');
      }
    }

    console.log('🔄 FORM: Setting loading state...');
    setLoading(true);
    setError('');

    try {
      console.log('🚀 FORM: Starting user creation process...');
      console.log('📝 FORM: Form data:', formData);
      console.log('👤 FORM: Created by:', createdBy);
      console.log('🔧 FORM: Bypass mode:', bypassMode);
      
      const userData: CreateUserData = {
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        role: formData.role,
        userName: formData.userName || undefined,
        phoneNumber: formData.phoneNumber || undefined,
      };

      console.log('📦 FORM: UserData prepared:', userData);
      console.log('📞 FORM: Calling userManagementService.createUser...');
      
      const result = await userManagementService.createUser(userData, createdBy);
      
      console.log('✅ FORM: Service call completed successfully!');
      console.log('🎉 FORM: Result:', result);
      
      setSuccess(`✅ Profile user ${formData.displayName} berhasil dibuat dengan role ${getRoleTitle(formData.role)}!\n\n⚠️ CATATAN: User ini dibuat sebagai profile saja. User perlu mendaftar sendiri dengan email ini untuk bisa login ke sistem.`);
      
      // Reset form
      setFormData({
        displayName: '',
        role: 'warga_dpkj' as UserRole,
        userName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Call success callback after longer delay to let admin read the message
      setTimeout(() => {
        onSuccess?.();
      }, 5000);

    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat user');
    } finally {
      setLoading(false);
    }
  };

  // Available roles for registration (exclude unknown)
  const availableRoles: UserRole[] = [
    'administrator',
    'admin_desa', 
    'kepala_desa',
    'kepala_dusun',
    'warga_dpkj',
    'warga_luar_dpkj'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Navigation Header */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back Button - Professional Version */}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="group flex items-center gap-3 px-4 py-2.5 bg-white/90 hover:bg-white border border-gray-200/80 hover:border-gray-300 rounded-xl text-gray-700 hover:text-gray-900 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="w-7 h-7 bg-gray-50 group-hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors duration-200">
                    <svg className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold">Kembali</span>
                </button>
              )}
              
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-gray-700">Kelola Pengguna</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>Registrasi User Baru</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-800">Manajemen User</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Registrasi User Baru
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Buat profile user baru dengan role dan permission yang sesuai untuk sistem SiGede DPKJ
              </p>
            </div>

        {/* Success Message */}
        {success && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-lg mb-2">Berhasil!</h4>
                  <div className="text-sm text-green-800 whitespace-pre-line leading-relaxed">{success}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-red-900 text-lg mb-2">Terjadi Kesalahan</h4>
                  <p className="text-sm text-red-800 leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info - hanya tampil jika ada masalah */}
        {(userLoading || !currentUser || auth.currentUser) && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-2xl shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-yellow-900 text-lg mb-2">Status Autentikasi</h4>
                  <div className="text-sm text-yellow-800 space-y-1 mb-4">
                    <div><strong>Loading:</strong> {userLoading ? 'Ya' : 'Tidak'}</div>
                    <div><strong>Firestore User:</strong> {currentUser ? 'Login' : 'Tidak Login'}</div>
                    <div><strong>Email:</strong> {currentUser?.email || auth.currentUser?.email || 'N/A'}</div>
                    <div><strong>Role:</strong> {currentUser?.role || 'N/A'}</div>
                    <div><strong>Display Name:</strong> {currentUser?.displayName || auth.currentUser?.displayName || 'N/A'}</div>
                    <div><strong>UID:</strong> {currentUser?.uid || auth.currentUser?.uid || 'N/A'}</div>
                    <div><strong>Firebase Auth:</strong> {auth.currentUser ? '✅ Login' : '❌ Tidak Login'}</div>
                    <div><strong>Bypass Mode:</strong> {bypassMode ? '✅ Aktif' : '❌ Tidak Aktif'}</div>
                  </div>
                  
                  {/* Development Controls */}
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setBypassMode(!bypassMode);
                        setError(''); // Clear any existing errors
                        console.log('Bypass mode toggled:', !bypassMode);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        bypassMode 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {bypassMode ? 'Nonaktifkan Bypass' : 'Aktifkan Bypass Mode'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setBypassMode(true);
                        setError('');
                        console.log('🚀 Force bypass mode activated');
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                    >
                      Force Bypass
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    >
                      Refresh Halaman
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Role Manager for Development */}
        <AdminRoleManager />

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Form Container with Professional Design */}
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-gray-200/50 ring-1 ring-gray-900/5">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-pink-600 px-8 py-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="relative flex items-center gap-5">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Registrasi User Baru</h3>
                  <p className="text-red-100/90 text-sm leading-relaxed">Buat profile user baru dengan role dan permission yang sesuai</p>
                </div>
              </div>
            </div>

            {/* Form Fields Container */}
            <div className="px-8 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Nama - Full Width */}
                <div className="lg:col-span-2">
                  <label htmlFor="displayName" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    Nama Lengkap <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200/70 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-400 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md font-medium"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label htmlFor="role" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    Role User <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200/70 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-400 focus:bg-white transition-all duration-300 text-gray-900 appearance-none cursor-pointer shadow-sm hover:shadow-md font-medium"
                      required
                    >
                      {availableRoles.map(role => (
                        <option key={role} value={role}>
                          {getRoleTitle(role)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors pointer-events-none duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* User Name */}
                <div>
                  <label htmlFor="userName" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Username
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="userName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200/70 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md font-medium"
                      placeholder="Username unik"
                    />
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    Email <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200/70 rounded-2xl focus:ring-4 focus:ring-green-500/10 focus:border-green-400 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md font-medium"
                      placeholder="user@example.com"
                      required
                    />
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* No. Telp */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    No. Telepon
                  </label>
                  <div className="relative group">
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200/70 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-400 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md font-medium"
                      placeholder="08xxxxxxxxxx"
                    />
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Kata Sandi */}
                <div>
                  <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    Kata Sandi <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200/70 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md font-medium"
                      placeholder="Minimal 6 karakter"
                      required
                      minLength={6}
                    />
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Konfirmasi Kata Sandi */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Konfirmasi Kata Sandi <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="password"
                      id="confirmPassword" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-gray-50/80 border border-gray-200/70 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 focus:bg-white transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-sm hover:shadow-md font-medium"
                      placeholder="Ulangi kata sandi"
                      required
                    />
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Description */}
              {formData.role && (
                <div className="lg:col-span-2 mt-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-3xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-blue-900 mb-2 text-lg">Informasi Role</h4>
                        <p className="text-blue-800 leading-relaxed font-medium">
                          {getRoleDescription(formData.role)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
            <div className="flex justify-center mb-6">
              <button
                type="submit"
                disabled={loading}
                className="group relative overflow-hidden bg-gradient-to-r from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 text-white py-5 px-12 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl focus:ring-4 focus:ring-red-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none min-w-[280px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-bold">Membuat User...</span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <span className="font-bold text-xl">Buat User Baru</span>
                    </>
                  )}
                </div>
              </button>
            </div>
            
            {/* Helper Text */}
            <div className="flex items-start gap-3 p-4 bg-blue-50/50 backdrop-blur-sm rounded-2xl border border-blue-200/50">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-blue-900 mb-1">Informasi Penting</h5>
                <p className="text-sm text-blue-800 leading-relaxed">
                  Ini akan membuat profile user di sistem. User masih perlu mendaftar sendiri dengan email ini untuk bisa login ke sistem.
                </p>
              </div>
            </div>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
}