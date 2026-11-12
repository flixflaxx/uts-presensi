import { useState } from 'react';
import { Lock, Mail, QrCode, ArrowRight, ShieldCheck, GraduationCap, UserCog } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getPageUrl } from '../config/routes';

export default function LoginPage() {
  const { currentUser, loginWithCredentials, loginAsRole, handleLinkClick } = useApp();
  const [identifier, setIdentifier] = useState('alex.pratama@smkn1.sch.id');
  const [password, setPassword] = useState('smkattend2026');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = loginWithCredentials(identifier, password);
    if (!res.ok) {
      setError(res.error);
    } else {
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-between">
      {/* Top Curved Hero Header */}
      <div className="relative bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white pt-10 pb-14 px-4 text-center overflow-hidden">
        <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 -left-10 w-40 h-40 rounded-full bg-sky-300/15 blur-2xl" />

        <div className="relative z-10 max-w-md mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight">SMK Attend</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-white/85">
            Portal Presensi QR & Akademik Digital SMKN 1 Nusantara
          </p>
        </div>

        <svg
          viewBox="0 0 1440 44"
          preserveAspectRatio="none"
          className="absolute bottom-0 inset-x-0 w-full h-6 text-[#F5F7FB]"
          aria-hidden="true"
        >
          <path fill="currentColor" d="M0,6 C340,42 1100,42 1440,6 L1440,44 L0,44 Z" />
        </svg>
      </div>

      {/* Main Login Card */}
      <main className="flex-1 px-4 -mt-6 relative z-10 pb-10">
        <div className="max-w-md mx-auto space-y-5">
          {currentUser && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
              <div className="min-w-0">
                <p className="text-xs font-bold text-indigo-900 truncate">
                  Sesi aktif: {currentUser.name}
                </p>
                <p className="text-[11px] text-indigo-700 truncate">
                  {currentUser.className} • {currentUser.role}
                </p>
              </div>
              <a
                href={getPageUrl('home')}
                onClick={(e) => handleLinkClick(e, 'home')}
                className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 text-xs font-bold transition"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl shadow-[0_10px_35px_rgba(30,27,75,0.08)] border border-slate-100 p-6 space-y-4"
          >
            <div>
              <h2 className="text-lg font-bold text-slate-900">Masuk ke Portal</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Gunakan Email, NISN, atau NIP yang terdaftar
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Email / NISN / NIP
              </label>
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="alex.pratama@smkn1.sch.id"
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Kata Sandi</label>
              <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/25 hover:brightness-105 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <span>Masuk Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Role Quick Login Cards */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Akses Cepat Demo (3 Role)
              </h3>
              <span className="text-[11px] font-semibold text-indigo-600">1-Klik Masuk</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => loginAsRole('student')}
                className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 p-3 rounded-2xl bg-[#F3EFFF] border border-[#E7DEFF] hover:shadow-md transition text-left"
              >
                <div className="w-9 h-9 rounded-full bg-[#6D28D9] text-white flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">Student Portal</p>
                  <p className="text-[11px] text-slate-500 truncate">Alex Pratama • Siswa</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loginAsRole('teacher')}
                className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 p-3 rounded-2xl bg-[#EDF4FF] border border-[#D8E7FF] hover:shadow-md transition text-left"
              >
                <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">Teacher Portal</p>
                  <p className="text-[11px] text-slate-500 truncate">Ahmad Fauzi • Guru</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => loginAsRole('admin')}
                className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 p-3 rounded-2xl bg-[#FFF3E8] border border-[#FFE3CA] hover:shadow-md transition text-left"
              >
                <div className="w-9 h-9 rounded-full bg-[#F97316] text-white flex items-center justify-center shrink-0">
                  <UserCog className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">Admin Portal</p>
                  <p className="text-[11px] text-slate-500 truncate">Ratna Sari • Admin</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

