import { Calendar, Clock, GraduationCap, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATUS_STYLES } from '../config/theme';

export default function ExamsPage() {
  const { state, currentUser, searchQuery } = useApp();
  const q = searchQuery.trim().toLowerCase();

  const exams = state.exams.filter(
    (ex) =>
      !q ||
      ex.title.toLowerCase().includes(q) ||
      ex.subject.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/80">
            Kartu Peserta Ujian • {currentUser?.className}
          </p>
          <h2 className="text-xl font-extrabold mt-0.5">{currentUser?.name}</h2>
          <p className="text-xs text-white/85 mt-0.5">
            Nomor Peserta: UJ-2026-{currentUser?.identifier?.slice(-4)}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl bg-white/15 px-4 py-2.5 text-xs font-bold">
          <GraduationCap className="w-5 h-5" />
          <span>Semester Ganjil 2026/2027</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold text-indigo-600">{ex.subject}</p>
                <h3 className="text-sm font-extrabold text-slate-900 mt-0.5">{ex.title}</h3>
              </div>
              <span
                className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  STATUS_STYLES[ex.status] || STATUS_STYLES.Terjadwal
                }`}
              >
                {ex.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {ex.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {ex.time}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {ex.room} ({ex.seat})
              </span>
            </div>

            {ex.score !== null && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Nilai Hasil Ujian</span>
                <span className="text-sm font-extrabold text-emerald-700">{ex.score} / 100</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

