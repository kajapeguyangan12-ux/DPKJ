"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
// Custom SVG icons as components
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockClosedIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

// Use public assets so paths resolve at runtime and work with Turbopack
const DesaLogo = "/logo/LOGO_DPKJ.png";
const SipekaLogo = "/logo/LOGO_DPKJ.png";

export default function LoginMasyarakatPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: integrate real auth flow
    router.push("/masyarakat/home");
  };

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-[100svh] flex items-center justify-center px-4 py-8 md:px-6 lg:px-8">
        <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fadeIn transform hover:shadow-3xl transition-all duration-500">
            {/* Header with logo and branding */}
            <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-red-700 px-6 py-10 md:px-8 md:py-12 text-white text-center overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>
              <div className="relative z-10">
                <div className="mx-auto w-20 h-20 bg-white/95 rounded-2xl p-3 shadow-lg mb-4 backdrop-blur-sm">
                  <Image 
                    src={DesaLogo} 
                    alt="Logo Desa" 
                    width={64} 
                    height={64} 
                    className="w-full h-full object-contain" 
                    priority 
                  />
                </div>
                <h1 className="text-xl font-bold mb-2">Dauh Puri Kaja</h1>
                <div className="flex items-center justify-center gap-2 text-white/90">
                  <Image 
                    src={SipekaLogo} 
                    alt="Logo SIGEDE" 
                    width={20} 
                    height={20} 
                    className="object-contain brightness-0 invert" 
                  />
                  <span className="font-semibold tracking-wider text-sm">SIGEDE</span>
                </div>
                <p className="text-white/80 text-sm mt-2">Sistem Informasi Desa</p>
              </div>
            </div>

            {/* Login form */}
            <div className="px-6 py-8 md:px-8 md:py-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight">Masuk ke Akun</h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">Silakan masuk untuk mengakses layanan desa digital</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                {/* Username field */}
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      placeholder="Masukkan username Anda"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:bg-white/70 hover:border-gray-400 hover:shadow-md focus:bg-white focus:shadow-lg"
                      required
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 hover:bg-white/70 hover:border-gray-400 hover:shadow-md focus:bg-white focus:shadow-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden ${isLoading ? 'animate-pulse-glow' : ''}`}
                >
                  {isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-80"></div>
                  )}
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Memproses masuk...</span>
                      </>
                    ) : (
                      <>
                        <span>MASUK</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>

                {/* Links */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                  <Link 
                    href="/masyarakat/daftar" 
                    className="group text-red-600 hover:text-red-700 font-medium transition-all duration-300 relative"
                  >
                    <span className="relative z-10">Belum punya akun? Daftar</span>
                    <div className="absolute inset-0 bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-2"></div>
                  </Link>
                  <div className="hidden sm:block w-px h-4 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
                  <Link 
                    href="/admin/login" 
                    className="group text-blue-600 hover:text-blue-700 font-medium transition-all duration-300 relative"
                  >
                    <span className="relative z-10">Login sebagai Admin</span>
                    <div className="absolute inset-0 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-2"></div>
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
                    {/* Footer */}
          <div className="text-center mt-8 px-4">
            <p className="text-gray-500 text-sm leading-relaxed">
              ©Copyright BaliGerbangDigital 2024 
              <span className="text-gray-700 font-medium"></span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
