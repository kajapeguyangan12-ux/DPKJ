"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    if (!username || !password) {
      setError('Username dan Password wajib diisi');
      return;
    }
    setError('');
  // Simulate login
  router.push('/admin/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-100 to-white">
      <div className="bg-white shadow-lg rounded-lg flex w-full max-w-3xl overflow-hidden">
        {/* Left Side */}
        <div className="w-1/2 bg-gradient-to-br from-red-400 to-red-200 flex flex-col items-center justify-center p-8">
          <img src="/Logo/LOGO_DPKJ.png" alt="Logo DPKJ" className="w-32 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Dauh Puri Kaja</h2>
          <p className="text-white text-lg font-semibold">Selamat Datang Di Aplikasi SIGEDE</p>
        </div>
        {/* Right Side */}
        <div className="w-1/2 flex flex-col justify-center items-center p-8">
          <img src="/Logo/Logo_BGD.png" alt="Logo BGD" className="w-24 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Silakan Login Untuk Masuk Ke Sistem SI GEDE
          </h1>
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Masukkan Username"
              className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-gray-800 placeholder-gray-500 placeholder-opacity-100"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Masukkan Password"
              className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white text-gray-800 placeholder-gray-500 placeholder-opacity-100"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
