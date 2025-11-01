"use client";
import React, { useState, useEffect } from 'react';
import { UserRole } from '../../../masyarakat/lib/useCurrentUser';
import { getRoleTitle, getRoleDescription } from '../../../../lib/rolePermissions';
import userManagementService, { FirestoreUser } from '../../../../lib/userManagementService';
import UserRegistrationForm from './UserRegistrationForm';
import EditUserModal from './EditUserModal';

interface UserListProps {
  roleId: UserRole;
  roleLabel: string;
}

interface UserCardProps {
  user: FirestoreUser;
  onEdit: (user: FirestoreUser) => void;
  onDelete: (user: FirestoreUser) => void;
  onApprove?: (user: FirestoreUser) => void;
  onReject?: (user: FirestoreUser) => void;
}

function UserCard({ user, onEdit, onDelete, onApprove, onReject }: UserCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Tidak Aktif';
      case 'suspended': return 'Ditangguhkan';
      case 'pending': return 'Menunggu';
      default: return 'Unknown';
    }
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    try {
      const d = date instanceof Date ? date : new Date(date);
      return d.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  return (
    <div className={`bg-white rounded-2xl border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
      user.status === 'pending' ? 'border-yellow-300 bg-yellow-50/30' : 'border-gray-200'
    }`}>
      {/* Pending Alert Banner */}
      {user.status === 'pending' && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2">
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <span>⏳</span>
            <span>Menunggu persetujuan admin</span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl flex items-center justify-center">
              <span className="text-xl font-bold text-red-600">
                {user.displayName?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{user.displayName}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
            {getStatusText(user.status)}
          </span>
        </div>



        {/* Metadata */}
        <div className="border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div>
              <span className="block">Dibuat:</span>
              <span className="text-gray-700">{formatDate(user.createdAt)}</span>
            </div>
            <div>
              <span className="block">
                {user.status === 'pending' ? 'Oleh:' : 'Login Terakhir:'}
              </span>
              <span className="text-gray-700">
                {user.status === 'pending' ? (user.createdBy || 'Admin') : formatDate(user.lastLoginAt)}
              </span>
            </div>
          </div>
          
          {/* Additional info for pending users */}
          {user.status === 'pending' && user.notes && (
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-xs text-yellow-800 font-medium block mb-1">Catatan:</span>
              <span className="text-xs text-yellow-700">{user.notes}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowActions(!showActions)}
              className={`text-sm transition-colors ${
                user.status === 'pending' 
                  ? 'text-yellow-600 hover:text-yellow-700' 
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              {showActions ? 'Tutup Menu' : (user.status === 'pending' ? '⚡ Butuh Tindakan' : 'Aksi')}
            </button>
            
            {showActions && (
              <div className="flex gap-2 flex-wrap">
                {/* Pending users get approve/reject buttons */}
                {user.status === 'pending' && onApprove && onReject ? (
                  <>
                    <button
                      onClick={() => onApprove(user)}
                      className="px-3 py-1 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                    >
                      ✓ Terima
                    </button>
                    <button
                      onClick={() => onReject(user)}
                      className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                    >
                      ✗ Tolak
                    </button>
                  </>
                ) : (
                  /* Regular users get edit/delete */
                  <>
                    <button
                      onClick={() => onEdit(user)}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Hapus
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserList({ roleId, roleLabel }: UserListProps) {
  const [users, setUsers] = useState<FirestoreUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<FirestoreUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load users
  const loadUsers = async () => {
    try {
      setLoading(true);
      const userData = await userManagementService.getUsersByRole(roleId);
      setUsers(userData);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  // Load users on mount and when roleId changes
  useEffect(() => {
    loadUsers();
  }, [roleId]);

  // Handle edit user
  const handleEditUser = (user: FirestoreUser) => {
    console.log('🎯 USER LIST: Edit button clicked for user:', user);
    console.log('📊 USER LIST: User data structure:', {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      status: user.status,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      notes: user.notes,
      idNumber: user.idNumber
    });
    
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    console.log('🚪 USER LIST: Closing edit modal');
    setShowEditModal(false);
    setSelectedUser(null);
  };

  // Handle user update success
  const handleUserUpdated = () => {
    loadUsers(); // Refresh the list
  };

  // Handle delete user
  const handleDeleteUser = async (user: FirestoreUser) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus user ${user.displayName}?`)) {
      return;
    }

    try {
      // TODO: Get current admin user ID
      await userManagementService.deleteUser(user.uid, 'current-admin-id');
      await loadUsers(); // Refresh list
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Gagal menghapus user');
    }
  };

  // Handle approve user (pending -> active)
  const handleApproveUser = async (user: FirestoreUser) => {
    if (!confirm(`Apakah Anda yakin ingin menerima user ${user.displayName}?`)) {
      return;
    }

    try {
      setLoading(true);
      // TODO: Get current admin user ID properly
      await userManagementService.approveUser(user.uid, 'current-admin-id');
      await loadUsers(); // Refresh list
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error approving user:', error);
      setError('Gagal menerima user');
    } finally {
      setLoading(false);
    }
  };

  // Handle reject user (delete pending user)
  const handleRejectUser = async (user: FirestoreUser) => {
    const reason = prompt(`Alasan menolak user ${user.displayName}:`);
    if (reason === null) return; // User cancelled
    
    if (!confirm(`Apakah Anda yakin ingin menolak user ${user.displayName}?\n\nUser ini akan dihapus dari sistem.`)) {
      return;
    }

    try {
      setLoading(true);
      // TODO: Get current admin user ID properly
      await userManagementService.rejectUser(user.uid, 'current-admin-id', reason);
      await loadUsers(); // Refresh list
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error rejecting user:', error);
      setError('Gagal menolak user');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show registration form
  if (showRegistrationForm) {
    return (
      <div>

        <UserRegistrationForm
          onSuccess={() => {
            setShowRegistrationForm(false);
            loadUsers();
          }}
          onCancel={() => setShowRegistrationForm(false)}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{roleLabel}</h2>
            <p className="text-gray-600">{getRoleDescription(roleId)}</p>
          </div>
          <button
            onClick={() => setShowRegistrationForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah User
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Cari user berdasarkan nama, email, atau ID..."
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data user...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada user</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Tidak ditemukan user yang sesuai dengan pencarian.' : `Belum ada user dengan role ${roleLabel}.`}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowRegistrationForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah User Pertama
            </button>
          )}
        </div>
      )}

      {/* User Grid */}
      {!loading && filteredUsers.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {searchTerm ? `${filteredUsers.length} user ditemukan` : `${filteredUsers.length} user`}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user.uid}
                user={user}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onApprove={handleApproveUser}
                onReject={handleRejectUser}
              />
            ))}
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      <EditUserModal
        user={selectedUser}
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onUpdate={handleUserUpdated}
      />
    </div>
  );
}