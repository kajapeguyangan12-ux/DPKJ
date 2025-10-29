"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import AdminLayout from "../components/AdminLayout";
import AdminHeaderCard, { AdminHeaderSearchBar, AdminHeaderAccount } from "../../components/AdminHeaderCard";

function RenderIcon({ name, className = '' }: { name: string; className?: string }) {
  const baseProps = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, className } as const;
  switch (name) {
    case 'home': return (<svg {...baseProps}><path d="M3 11.5L12 5l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z"/></svg>);
    case 'users': return (<svg {...baseProps}><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>);
    case 'newspaper': return (<svg {...baseProps}><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z"/><path d="M8 10h8M8 14h6"/></svg>);
    case 'file': return (<svg {...baseProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>);
    case 'wallet': return (<svg {...baseProps}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><path d="M1 10h22"/></svg>);
    case 'briefcase': return (<svg {...baseProps}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
    case 'star': return (<svg {...baseProps}><polygon points="12 2 15.09 10.26 23.77 10.5 17.39 16.62 19.54 25.29 12 20.88 4.46 25.29 6.61 16.62 0.23 10.5 8.91 10.26 12 2"/></svg>);
    case 'layers': return (<svg {...baseProps}><path d="M12 2L2 7l10 5 10-5L12 2z"/><path d="M2 17l10 5 10-5"/></svg>);
    case 'message-circle': return (<svg {...baseProps}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
    case 'shopping-bag': return (<svg {...baseProps}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>);
    case 'map': return (<svg {...baseProps}><polygon points="1 6 1 22 8 18 16 22 23 18 23 6 16 10 8 6 1 10 1 6"/></svg>);
    case 'database': return (<svg {...baseProps}><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6"/><path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6"/></svg>);
    case 'gift': return (<svg {...baseProps}><polyline points="20.42 4.58 16.5 2.5 12 6.92 7.5 2.5 3.58 4.58"/><path d="M3.75 13v5a2 2 0 0 0 2 2h12.5a2 2 0 0 0 2-2v-5"/><line x1="12" y1="6.92" x2="12" y2="21"/><line x1="3.75" y1="9" x2="20.25" y2="9"/></svg>);
    case 'home-alt': return (<svg {...baseProps}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
    default: return (<svg {...baseProps}><circle cx="12" cy="12" r="10"/></svg>);
  }
}

function getIcon(iconName: string, colorClass = "text-red-600") {
  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
      <RenderIcon name={iconName} className={`w-8 h-8 ${colorClass}`} />
    </div>
  );
}

export default function AdminHomePage() {
  const gridItems = [
    { label: "E-News", icon: 'newspaper', href: '/admin/e-news' },
    { label: "Profil Desa", icon: 'home', href: '/admin/profil-desa' },
    { label: "Regulasi Desa", icon: 'file', href: '/admin/regulasi' },
    { label: "Keuangan", icon: 'wallet', href: '/admin/keuangan' },
    { label: "Layanan Publik", icon: 'briefcase', href: '/admin/layanan-publik' },
    { label: "IKM", icon: 'star', href: '/admin/ikm' },
    { label: "Wisata & Budaya", icon: 'layers', href: '/admin/wisata-budaya' },
    { label: "Pengaduan", icon: 'message-circle', href: '/admin/pengaduan' },
    { label: "E-UMKM", icon: 'shopping-bag', href: '/admin/e-umkm' },
    { label: "Kelola Data Pengguna", icon: 'users', href: '/admin/kelola-pengguna' },
    { label: "Data Desa", icon: 'database', href: '/admin/data-desa' },
  ];

  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileUsername, setProfileUsername] = useState('data_username');
  const [profileEmail, setProfileEmail] = useState('admin@example.com');
  const [profileName, setProfileName] = useState('Data Nama');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileError, setProfileError] = useState('');

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
        <AdminHeaderCard title="Beranda">
          <AdminHeaderSearchBar />
          <AdminHeaderAccount onLogout={handleLogout} />
        </AdminHeaderCard>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {gridItems.map((item) => (
            <div
              key={item.label}
              onClick={() => item.href && router.push(item.href)}
              className="flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm hover:shadow-xl p-8 transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 cursor-pointer group hover:border-red-200"
            >
              <div className="mb-5">{getIcon(item.icon)}</div>
              <span className="font-semibold text-lg text-gray-800 text-center transition-colors duration-200 group-hover:text-red-600">{item.label}</span>
            </div>
          ))}
        </div>

        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowProfileModal(false)}></div>
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl z-60 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Kelola Akun Anda</h3>
              <form onSubmit={(e) => { e.preventDefault(); setProfileError(''); if (newPassword || confirmPassword) { if (newPassword !== confirmPassword) { setProfileError('Konfirmasi kata sandi tidak cocok'); return; } } setShowProfileModal(false); alert('Perubahan profil disimpan'); }}>
                <label className="text-sm text-gray-600">Username</label>
                <input value={profileUsername} onChange={(e) => setProfileUsername(e.target.value)} className="w-full mt-1 mb-3 px-3 py-2 rounded-md border border-gray-200 bg-white text-gray-800 placeholder-gray-400" />

                <label className="text-sm text-gray-600">Email</label>
                <input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="w-full mt-1 mb-3 px-3 py-2 rounded-md border border-gray-200 bg-white text-gray-800 placeholder-gray-400" />

                <label className="text-sm text-gray-600">Nama</label>
                <input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full mt-1 mb-3 px-3 py-2 rounded-md border border-gray-200 bg-white text-gray-800 placeholder-gray-400" />

                <label className="text-sm text-gray-600">Kata sandi baru</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Masukkan kata sandi baru" className="w-full mt-1 mb-3 px-3 py-2 rounded-md border border-gray-200 bg-white text-gray-800 placeholder-gray-400" />

                <label className="text-sm text-gray-600">Konfirmasi kata sandi baru</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Masukkan ulang kata sandi" className="w-full mt-1 mb-3 px-3 py-2 rounded-md border border-gray-200 bg-white text-gray-800 placeholder-gray-400" />

                {profileError && <div className="text-red-600 text-sm mb-2">{profileError}</div>}

                <div className="flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowProfileModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors">Batal</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm transition-colors">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
