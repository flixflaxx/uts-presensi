import { Mail, Phone, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import UserAvatar from '../components/UserAvatar';

export default function TeachersPage() {
  const { state, searchQuery } = useApp();
  const q = searchQuery.trim().toLowerCase();

  const teachers = state.users.filter((u) => {
    if (u.role !== 'teacher') return false;
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.major.toLowerCase().includes(q) ||
      (u.subjects || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Direktori Guru & Wali Kelas</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Informasi pengampu mata pelajaran dan kontak konsultasi akademik
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="flex items-center gap-3.5">
              <UserAvatar user={t} size="lg" />
              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-slate-900 truncate">{t.name}</h3>
                <p className="text-xs font-semibold text-indigo-600">{t.className}</p>
                <p className="text-[11px] text-slate-400">NIP: {t.identifier}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(t.subjects || [t.major]).map((sub) => (
                <span
                  key={sub}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold"
                >
                  <BookOpen className="w-3 h-3" />
                  {sub}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{t.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{t.phone}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

