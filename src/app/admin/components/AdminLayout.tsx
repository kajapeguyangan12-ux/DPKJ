"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminProvider } from './AdminContext';
import Image from 'next/image';

function RenderIcon({ name, className = '' }: { name: string; className?: string }) {
  const baseProps = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, className } as const;
  switch (name) {
    case 'home': return (<svg {...baseProps}><path d="M3 11.5L12 5l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11.5z"/></svg>);
    case 'users': return (<svg {...baseProps}><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>);
    case 'newspaper': return (<svg {...baseProps}><path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z"/><path d="M8 10h8M8 14h6"/></svg>);
    case 'file': return (<svg {...baseProps}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>);
    case 'layers': return (<svg {...baseProps}><path d="M12 2L2 7l10 5 10-5L12 2z"/><path d="M2 17l10 5 10-5"/></svg>);
    case 'building': return (<svg {...baseProps}><rect x="3" y="6" width="18" height="14" rx="1"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><line x1="9" y1="10" x2="9" y2="16"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="15" y1="10" x2="15" y2="16"/></svg>);
    case 'wallet': return (<svg {...baseProps}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><path d="M1 10h22"/></svg>);
    case 'bar-chart': return (<svg {...baseProps}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>);
    case 'home-alt': return (<svg {...baseProps}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>);
    case 'compass': return (<svg {...baseProps}><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 9 8 12 12 15 16 12"/></svg>);
    case 'briefcase': return (<svg {...baseProps}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
    case 'star': return (<svg {...baseProps}><polygon points="12 2 15.09 10.26 23.77 10.5 17.39 16.62 19.54 25.29 12 20.88 4.46 25.29 6.61 16.62 0.23 10.5 8.91 10.26 12 2"/></svg>);
    case 'map': return (<svg {...baseProps}><polygon points="1 6 1 22 8 18 16 22 23 18 23 6 16 10 8 6 1 10 1 6"/></svg>);
    case 'message': return (<svg {...baseProps}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>);
    case 'shopping-bag': return (<svg {...baseProps}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>);
    case 'gift': return (<svg {...baseProps}><polyline points="20.42 4.58 16.5 2.5 12 6.92 7.5 2.5 3.58 4.58"/><path d="M3.75 13v5a2 2 0 0 0 2 2h12.5a2 2 0 0 0 2-2v-5"/><line x1="12" y1="6.92" x2="12" y2="21"/><line x1="3.75" y1="9" x2="20.25" y2="9"/></svg>);
    case 'help-circle': return (<svg {...baseProps}><circle cx="12" cy="12" r="10"/><path d="M12 16v.01M12 12a2 2 0 0 0-2-2 2 2 0 0 0-2 2c0 1 1 2 2 2s2 1 2 2"/></svg>);
    case 'settings': return (<svg {...baseProps}><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.98 2.98l4.24 4.24M1 12h6m6 0h6m-16.78 7.78l4.24-4.24m2.98-2.98l4.24-4.24"/></svg>);
    default: return (<svg {...baseProps}><circle cx="12" cy="12" r="10"/></svg>);
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const menuItems = [
    { label: 'Home', path: '/admin/home' },
    { label: 'Kelola Pengguna', path: '/admin/kelola-pengguna' },
    { label: 'E-News', path: '/admin/e-news' },
    { label: 'Profil Desa', path: '/admin/profil-desa' },
    { label: 'Regulasi Desa', path: '/admin/regulasi' },
    { label: 'Keuangan', path: '/admin/keuangan' },
    { label: 'APB', path: '/admin/apb' },
    { label: 'Layanan Publik', path: '/admin/layanan-publik' },
    { label: 'IKM', path: '/admin/ikm' },
    { label: 'Wisata & Budaya', path: '/admin/wisata-budaya' },
    { label: 'Pengaduan', path: '/admin/pengaduan' },
    { label: 'E-UMKM', path: '/admin/e-umkm' },
    { label: 'Data Desa', path: '/admin/data-desa' },
  ];
  // Find active index by matching pathname
  const activeIndex = menuItems.findIndex(item => pathname?.startsWith(item.path));
  // top-right account avatar removed per request


  return (
    <AdminProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 flex font-sans text-gray-800">
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-gray-200 py-8 px-6 gap-6 h-full transition-all duration-300 shadow-sm">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-lg border border-gray-200">
            <Image 
              src="/logo/Logo_BGD1.png"
              alt="Logo BGD"
              width={56}
              height={56}
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>
        <nav className="flex flex-col gap-2 mt-4">
          {menuItems.map((item, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={item.label}
                onClick={() => window.location.href = item.path}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-medium transition transform duration-150 ${isActive ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md scale-105' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {idx === 0 && <RenderIcon name="home" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 1 && <RenderIcon name="users" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 2 && <RenderIcon name="newspaper" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 3 && <RenderIcon name="layers" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 4 && <RenderIcon name="file" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 5 && <RenderIcon name="wallet" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 6 && <RenderIcon name="bar-chart" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 7 && <RenderIcon name="briefcase" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 8 && <RenderIcon name="star" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 9 && <RenderIcon name="map" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 10 && <RenderIcon name="message" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 11 && <RenderIcon name="shopping-bag" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                  {idx === 12 && <RenderIcon name="gift" className={isActive ? 'w-5 h-5 text-white' : 'w-5 h-5 text-gray-400'} />}
                </span>
                <span className="flex-1 truncate text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto px-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors font-medium">
            <RenderIcon name="settings" className="w-4 h-4 text-gray-400" />
            Pengaturan
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden w-full bg-white px-4 py-3 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 overflow-x-auto">
          {menuItems.map((item, idx) => (
            <button
              key={item.label}
              onClick={() => window.location.href = item.path}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeIndex === idx ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-16 py-12 relative">
        {/* Top Bar (search removed — search moved into header cards) */}
        <div className="flex items-center justify-between mb-10">
          <div />
          <div className="flex items-center gap-8" />
        </div>

        {children}
      </main>
    </div>
    </AdminProvider>
  );
}
