import { LogOut, RefreshCw, X } from 'lucide-react';
import { QUICK_ACCESS_BY_ROLE, ROLE_META } from '../config/navigation';
import QuickAccessCard from './QuickAccessCard';

export default function MoreMenuModal({
  open,
  onClose,
  role = 'student',
  onNavigate,
  onSwitchRole,
  onLogout,
}) {
  if (!open) return null;

  const items = QUICK_ACCESS_BY_ROLE[role] || QUICK_ACCESS_BY_ROLE.student;
  const roleMeta = ROLE_META[role] || ROLE_META.student;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex items-end">
      <div
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full bg-[#F5F7FB] rounded-t-3xl shadow-2xl max-h-[88vh] flex flex-col overflow-hidden">
        <div className="px-5 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Semua Menu {roleMeta.portalTitle}</h3>
            <p className="text-xs text-slate-500">Pilih fitur yang ingin Anda buka</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu lainnya"
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="grid grid-cols-3 gap-2.5">
            {items.map((item) => (
              <QuickAccessCard
                key={item.id}
                item={item}
                onClick={(id) => {
                  onNavigate(id);
                  onClose();
                }}
              />
            ))}
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ganti Role Portal (Demo)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'student', label: 'Siswa' },
                { id: 'teacher', label: 'Guru' },
                { id: 'admin', label: 'Admin' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    onSwitchRole(r.id);
                    onClose();
                  }}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    role === r.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-indigo-50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
