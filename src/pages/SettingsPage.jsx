import { useState } from 'react';
import { Bell, LogOut, RefreshCw, RotateCcw, Save, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SettingsPage() {
  const {
    state,
    currentUser,
    updateSchoolSettings,
    loginAsRole,
    logout,
    resetDemoData,
  } = useApp();

  const [schoolName, setSchoolName] = useState(state.schoolSettings.schoolName);
  const [lateTolerance, setLateTolerance] = useState(state.schoolSettings.lateToleranceMinutes);
  const [qrValidity, setQrValidity] = useState(state.schoolSettings.qrValidityMinutes);
  const [enableNotif, setEnableNotif] = useState(state.schoolSettings.enableNotifications);

  const isAdmin = currentUser?.role === 'admin';

  const handleSave = (e) => {
    e.preventDefault();
    updateSchoolSettings({
      schoolName,
      lateToleranceMinutes: Number(lateTolerance),
      qrValidityMinutes: Number(qrValidity),
      enableNotifications: enableNotif,
    });
  };

  return (
    <div className="max-w-3xl space-y-5">
      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-sm space-y-5"
      >
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Pengaturan Portal & Preferensi</h2>
            <p className="text-xs text-slate-500">
              Sesuaikan preferensi notifikasi serta parameter presensi
            </p>
          </div>
        </div>

        <label className="flex items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
          <div>
            <p className="text-sm font-bold text-slate-900">Notifikasi Sesi QR & Pengumuman</p>
            <p className="text-xs text-slate-500">
              Tampilkan lencana & pengingat sesi presensi aktif
            </p>
          </div>
          <input
            type="checkbox"
            checked={enableNotif}
            onChange={(e) => setEnableNotif(e.target.checked)}
            className="w-5 h-5 accent-indigo-600 rounded"
          />
        </label>

        {isAdmin && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600">
              <Shield className="w-4 h-4" />
              <span>Konfigurasi Sekolah (Khusus Admin)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Sekolah</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Toleransi Terlambat (mnt)
                </label>
                <input
                  type="number"
                  value={lateTolerance}
                  onChange={(e) => setLateTolerance(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Masa Berlaku QR (mnt)
                </label>
                <input
                  type="number"
                  value={qrValidity}
                  onChange={(e) => setQrValidity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Switch Portal & Demo Actions */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Beralih Akun & Reset Demo</h3>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { id: 'student', label: 'Portal Siswa' },
            { id: 'teacher', label: 'Portal Guru' },
            { id: 'admin', label: 'Portal Admin' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => loginAsRole(r.id)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                currentUser?.role === r.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-indigo-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={resetDemoData}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 px-4 text-xs font-bold transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Data Demo</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 py-2.5 px-4 text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

