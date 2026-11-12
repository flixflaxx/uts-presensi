import { useMemo, useState } from 'react';
import { Calendar, Clock, Download, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATUS_STYLES } from '../config/theme';

export default function AttendanceHistoryPage({ isTeacherRecap = false }) {
  const { state, currentUser, searchQuery, showToast } = useApp();
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [classFilter, setClassFilter] = useState('Semua');

  const records = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return state.attendanceRecords.filter((rec) => {
      if (!isTeacherRecap && currentUser?.role === 'student' && rec.studentId !== currentUser.id) {
        return false;
      }
      if (statusFilter !== 'Semua' && rec.status !== statusFilter) return false;
      if (classFilter !== 'Semua' && rec.className !== classFilter) return false;
      if (
        q &&
        !rec.subject.toLowerCase().includes(q) &&
        !rec.studentName.toLowerCase().includes(q) &&
        !rec.note.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [state.attendanceRecords, isTeacherRecap, currentUser, statusFilter, classFilter, searchQuery]);

  const handleExportCsv = () => {
    const headers = ['Tanggal', 'Waktu', 'Siswa', 'Kelas', 'Mata Pelajaran', 'Status', 'Metode', 'Catatan'];
    const rows = records.map((r) => [
      r.date,
      r.time,
      r.studentName,
      r.className,
      r.subject,
      r.status,
      r.method,
      r.note,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekap-presensi-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('File CSV rekap presensi diunduh.');
  };

  return (
    <div className="space-y-5">
      {/* Header & Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {isTeacherRecap ? 'Rekap Kehadiran Siswa' : 'Riwayat Kehadiran Saya'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {records.length} catatan presensi ditemukan
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isTeacherRecap && (
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
            >
              <option value="Semua">Semua Kelas</option>
              {state.classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 text-xs font-bold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {['Semua', 'Hadir', 'Terlambat', 'Izin', 'Sakit', 'Alpa'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              statusFilter === st
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Mobile Card List (< md) */}
      <div className="md:hidden space-y-3">
        {records.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-sm text-slate-500">
            Tidak ada data presensi untuk filter ini.
          </div>
        ) : (
          records.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{r.subject}</h3>
                  {isTeacherRecap && (
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                      {r.studentName} • {r.className}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    STATUS_STYLES[r.status] || STATUS_STYLES.Hadir
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {r.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {r.time}
                </span>
                <span>• {r.method}</span>
              </div>
              {r.note && <p className="text-xs text-slate-500">{r.note}</p>}
            </div>
          ))
        )}
      </div>

      {/* Desktop & Tablet Responsive Table (>= md) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Tanggal</th>
                {isTeacherRecap && <th className="py-3.5 px-4">Siswa</th>}
                <th className="py-3.5 px-4">Mata Pelajaran</th>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Metode</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {r.date}
                  </td>
                  {isTeacherRecap && (
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{r.studentName}</p>
                      <p className="text-[11px] text-slate-500">{r.className}</p>
                    </td>
                  )}
                  <td className="py-3.5 px-4 font-bold text-slate-900">{r.subject}</td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{r.time}</td>
                  <td className="py-3.5 px-4 text-slate-600">{r.method}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        STATUS_STYLES[r.status] || STATUS_STYLES.Hadir
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

