import { useState } from 'react';
import { Mail, Phone, MapPin, Award, Save, ShieldCheck, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import UserAvatar from '../components/UserAvatar';
import QrCodeGraphic from '../components/QrCodeGraphic';
import { ROLE_META } from '../config/navigation';

export default function ProfilePage() {
  const { currentUser, updateProfile } = useApp();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  const roleMeta = ROLE_META[currentUser?.role] || ROLE_META.student;

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile({ name, email, phone, address });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Digital ID Card */}
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-3xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white p-6 shadow-xl shadow-indigo-500/20 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-xl" />

          <div className="relative z-10 flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">
                Kartu Identitas Digital
              </p>
              <h2 className="text-base font-extrabold">SMK Attend • SMKN 1</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-[11px] font-bold">
              {roleMeta.roleLabel}
            </span>
          </div>

          <div className="relative z-10 mt-5 flex items-center gap-4">
            <UserAvatar user={currentUser} size="lg" className="ring-3 ring-white/40" />
            <div className="min-w-0">
              <h3 className="text-lg font-extrabold leading-tight truncate">{currentUser?.name}</h3>
              <p className="text-xs text-white/85 mt-0.5">
                {currentUser?.identifierLabel}: {currentUser?.identifier}
              </p>
              <p className="text-xs text-white/85 truncate">{currentUser?.className}</p>
            </div>
          </div>

          <div className="relative z-10 mt-5 pt-4 border-t border-white/20 flex items-center justify-between gap-4">
            <div className="space-y-1 text-xs text-white/90">
              <p className="font-semibold">{currentUser?.major}</p>
              <p className="inline-flex items-center gap-1 text-[11px] text-white/75">
                <ShieldCheck className="w-3.5 h-3.5" /> Status Akun Aktif
              </p>
            </div>
            <div className="bg-white p-1.5 rounded-xl shrink-0">
              <QrCodeGraphic
                value={`SMK-ID:${currentUser?.identifier}`}
                size={76}
                className="border-0 p-0 shadow-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="truncate">{currentUser?.email}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{currentUser?.phone || '0812-8834-1092'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <span>{currentUser?.address || 'Bandung'}</span>
          </div>
          {currentUser?.birthDate && (
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Tanggal Lahir: {currentUser.birthDate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Editable Profile Form */}
      <form
        onSubmit={handleSave}
        className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-[0_2px_14px_rgba(15,23,42,0.04)] space-y-4"
      >
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Edit Profil Akun</h3>
            <p className="text-xs text-slate-500">
              Perubahan nama otomatis menyesuaikan sapaan di header portal
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              {currentUser?.identifierLabel || 'ID'}
            </label>
            <input
              type="text"
              value={currentUser?.identifier || ''}
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Email Sekolah</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Nomor Telepon</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">Alamat Domisili</label>
          <textarea
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#6D28D9] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:brightness-105 transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );
}

