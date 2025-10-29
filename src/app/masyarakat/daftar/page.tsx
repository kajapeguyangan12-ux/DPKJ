"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import HeaderCard from "../../components/HeaderCard";

// Custom SVG icons as components
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IdentificationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
  </svg>
);

const MailIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LockClosedIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const DesaLogo = "/logo/LOGO_DPKJ.png";

export default function DaftarMasyarakatPage() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    nik: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    agree: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      form.username.trim() !== "" &&
      form.name.trim() !== "" &&
      form.nik.trim() !== "" &&
      form.email.trim() !== "" &&
      form.phone.trim() !== "" &&
      form.password.length >= 6 &&
      form.password === form.confirm &&
      form.agree
    );
  }, [form]);

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert(
      `Pendaftaran berhasil!\n\nUsername: ${form.username}\nNama: ${form.name}\nNIK: ${form.nik}\nEmail: ${form.email}\nTelp: ${form.phone}\n\nSilakan login untuk melanjutkan.`
    );
    
    setIsLoading(false);
  };

  return (
    <main className="min-h-[100svh] bg-red-50 text-gray-800">
      <div className="mx-auto w-full max-w-md px-4 pb-20 pt-4">
        {/* Header Card */}
        <HeaderCard 
          title="Pendaftaran"
          subtitle="Buat Akun Baru"
          backUrl="/masyarakat/login"
        />

        {/* Registration Form Card */}
        <div className="rounded-3xl bg-white/95 shadow-xl ring-1 ring-gray-200 backdrop-blur-sm overflow-hidden">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
            <div className="text-center">
              <div className="mb-3">
                <div className="mx-auto w-16 h-16 bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
                  <UserIcon className="w-full h-full text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2">Buat Akun Baru</h2>
              <p className="text-white/90 text-sm">Lengkapi data diri untuk bergabung dengan SIGEDE</p>
            </div>
          </div>

          {/* Form content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Data Identitas</h3>
              <p className="text-gray-600 text-sm">Pastikan data sesuai dengan identitas resmi</p>
            </div>

              <form onSubmit={onSubmit} className="space-y-4">
                {/* Username field */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Username</label>
                  <input
                    type="text"
                    placeholder="Masukkan username unik"
                    value={form.username}
                    onChange={(e) => set("username", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 hover:border-gray-400"
                    required
                  />
                </div>

                {/* Full name field */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="Sesuai dengan KTP/Identitas resmi"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 hover:border-gray-400"
                    required
                  />
                </div>

                {/* NIK field */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">NIK</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="16 digit NIK sesuai KTP"
                    value={form.nik}
                    onChange={(e) => set("nik", e.target.value.replace(/\D/g, '').substring(0, 16))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 hover:border-gray-400"
                    required
                  />
                </div>

                {/* Email field */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="contoh@email.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 hover:border-gray-400"
                    required
                  />
                </div>

                {/* Phone field */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">No. Telp</label>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value.replace(/\D/g, '').substring(0, 13))}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 hover:border-gray-400"
                    required
                  />
                </div>

                {/* Password field */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 hover:border-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? "👁️‍🗨️" : "👁️"}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-1 text-xs text-gray-500">
                      Kekuatan: {form.password.length >= 8 ? '🟢 Kuat' : form.password.length >= 6 ? '🟡 Sedang' : '🔴 Lemah'}
                    </div>
                  )}
                </div>

                {/* Confirm password field */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Konfirmasi Kata Sandi</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Ulangi kata sandi"
                      value={form.confirm}
                      onChange={(e) => set("confirm", e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pr-10 text-sm shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200 hover:border-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? "👁️‍🗨️" : "👁️"}
                    </button>
                  </div>
                  {form.confirm && (
                    <div className="mt-1 text-xs">
                      {form.password === form.confirm ? (
                        <span className="text-green-600">✓ Password cocok</span>
                      ) : (
                        <span className="text-red-500">✗ Password tidak cocok</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms and conditions */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => set("agree", e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="agree" className="text-sm text-gray-700">
                    Saya menyetujui{" "}
                    <Link href="#" className="text-red-600 font-medium underline hover:text-red-700">
                      Syarat & Ketentuan
                    </Link>
                    {" "}yang berlaku
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      <span>Mendaftar...</span>
                    </div>
                  ) : (
                    "DAFTAR"
                  )}
                </button>

                {/* Login link */}
                <div className="pt-4 text-center text-sm">
                  Sudah Punya Akun?{" "}
                  <Link className="text-red-600 font-medium hover:text-red-700 hover:underline" href="/masyarakat/login">
                    Login
                  </Link>
                </div>
              </form>
            </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 px-4">
          <p className="text-gray-500 text-sm leading-relaxed">
            © 2024 Dauh Puri Kaja • Sistem Informasi Desa Digital
          </p>
        </div>
      </div>
    </main>
  );
}
