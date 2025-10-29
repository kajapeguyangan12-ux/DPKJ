"use client";
import React, { useState, useEffect } from 'react';
import { User, updateUser, deleteUser, getUsersByRole } from '../../../../lib/userService';
import { UserRole } from '../../../../lib/rolePermissions';

interface UserManagementProps {
  roleId: UserRole;
  roleLabel: string;
}

interface UserFormData {
  username: string;
  email: string;
  fullName: string;
  password?: string;
}

function UserFormModal({ 
  open, 
  onClose, 
  onSubmit,
  initialData,
}: { 
  open: boolean; 
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  initialData?: User | null;
}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setUsername(initialData.username);
      setEmail(initialData.email);
      setFullName(initialData.fullName);
      setPassword('');
      setConfirmPassword('');
    } else {
      setUsername('');
      setEmail('');
      setFullName('');
      setPassword('');
      setConfirmPassword('');
    }
    setError('');
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validasi password
    if (!initialData && !password) {
      setError('Password tidak boleh kosong untuk pengguna baru');
      return;
    }

    if (password && password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    if (password && password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        username,
        email,
        fullName,
        password: password || undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl p-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {initialData ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl transition-colors hover:bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-red-500 focus:bg-white transition-colors text-base"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Masukkan email"
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-red-500 focus:bg-white transition-colors text-base"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-red-500 focus:bg-white transition-colors text-base"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Password Baru {initialData && <span className="text-sm text-gray-500 font-normal">(Kosongkan jika tidak ingin ubah)</span>}
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Masukkan password baru"
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-red-500 focus:bg-white transition-colors text-base"
              required={!initialData}
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">Konfirmasi Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi password baru"
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 bg-gray-50 focus:outline-none focus:border-red-500 focus:bg-white transition-colors text-base"
              required={password.length > 0}
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-base"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold transition-all duration-300 transform hover:scale-105 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Menyimpan...' : initialData ? 'Perbarui' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UserManagementList({ roleId, roleLabel }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getUsersByRole(roleId);
        setUsers(data);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [roleId]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersByRole(roleId);
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        // Update existing user
        const updateData: any = {
          username: data.username,
          email: data.email,
          fullName: data.fullName,
        };
        
        // If password is provided, update password via API
        if (data.password) {
          const token = localStorage.getItem('authToken') || '';
          const response = await fetch('/api/admin/update-user-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId: editingUser.id,
              email: data.email,
              password: data.password,
            }),
          });
          
          if (!response.ok) {
            throw new Error(await response.text());
          }
        }
        
        await updateUser(editingUser.id, updateData);
      } else {
        // Create new user
        const token = localStorage.getItem('authToken') || '';
        const response = await fetch('/api/admin/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            displayName: data.fullName,
            username: data.username,
            role: roleId,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }
      }
      
      await loadUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
    
    try {
      await deleteUser(userId);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Gagal menghapus pengguna');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{roleLabel}</h3>
          <p className="text-sm text-gray-500 mt-1">Mengelola pengguna dengan role {roleLabel}</p>
        </div>
        <button
          onClick={handleAddUser}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah Pengguna
        </button>
      </div>

      <UserFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingUser}
      />

      {loading ? (
        <div className="text-center py-12 text-gray-500">Memuat pengguna...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Belum ada pengguna dengan role ini</div>
      ) : (
        <div className="grid gap-4">
          {users.map(user => (
            <div
              key={user.id}
              className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 flex items-center justify-between hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xl">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">{user.fullName}</h4>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                  <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {user.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
                <button
                  onClick={() => handleEditUser(user)}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 font-medium hover:bg-red-100 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
