import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';
import UserAvatar from '../components/UserAvatar';

export default function StudentsPage() {
  const { state, searchQuery } = useApp();
  const [selectedClass, setSelectedClass] = useState('Semua');
  const q = searchQuery.trim().toLowerCase();

  const students = state.users.filter((u) => {
    if (u.role !== 'student') return false;
    if (selectedClass !== 'Semua' && u.className !== selectedClass) return false;
    if (
      q &&
      !u.name.toLowerCase().includes(q) &&
      !u.identifier.toLowerCase().includes(q) &&
      !u.className.toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });

  const getAttendancePercent = (studentId) => {
    const recs = state.attendanceRecords.filter((r) => r.studentId === studentId);
    if (recs.length === 0) return 96;
    const ok = recs.filter((r) => r.status === 'Hadir' || r.status === 'Terlambat').length;
    return Math.round((ok / recs.length) * 100);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Daftar Siswa & Wali Kelas</h2>
          <p className="text-xs text-slate-500 mt-0.5">{students.length} siswa aktif terdaftar</p>
        </div>

        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold"
        >
          <option value="Semua">Semua Kelas</option>
          {state.classes.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((stu) => {
          const pct = getAttendancePercent(stu.id);
          return (
            <div
              key={stu.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3.5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <UserAvatar user={stu} size="md" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-slate-900 truncate">{stu.name}</h3>
                    <p className="text-xs text-indigo-600 font-semibold">{stu.className}</p>
                    <p className="text-[11px] text-slate-400">NISN: {stu.identifier}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold shrink-0">
                  {pct}%
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <p className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{stu.email}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{stu.phone}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

