import { ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATUS_STYLES } from '../config/theme';

export default function AdminAuditPage() {
  const { state, searchQuery, updateAttendanceStatus } = useApp();
  const q = searchQuery.trim().toLowerCase();

  const records = state.attendanceRecords.filter(
    (r) =>
      !q ||
      r.studentName.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.className.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Audit & Koreksi Presensi</h2>
          <p className="text-xs text-slate-500">
            Admin dapat memeriksa dan memperbarui status kehadiran apabila terdapat kendala teknis
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {records.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{r.studentName}</h3>
                <span className="text-[11px] font-semibold text-indigo-600">{r.className}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    STATUS_STYLES[r.status] || STATUS_STYLES.Hadir
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {r.subject} • {r.date} ({r.time})
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{r.note}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={r.status}
                onChange={(e) =>
                  updateAttendanceStatus(r.id, e.target.value, `Dikoreksi Admin (${e.target.value})`)
                }
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700"
              >
                {['Hadir', 'Terlambat', 'Izin', 'Sakit', 'Alpa'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

