import { useState } from 'react';
import { CheckSquare, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import UserAvatar from '../components/UserAvatar';

const STATUS_OPTIONS = ['Hadir', 'Terlambat', 'Izin', 'Sakit', 'Alpa'];

export default function ManualAttendancePage() {
  const { state, markManualAttendance } = useApp();
  const [selectedClass, setSelectedClass] = useState('XI RPL 1');
  const [selectedSubject, setSelectedSubject] = useState('Pemrograman Web & Perangkat Bergerak');
  const [draftStatuses, setDraftStatuses] = useState({});
  const [draftNotes, setDraftNotes] = useState({});

  const students = state.users.filter(
    (u) => u.role === 'student' && (selectedClass === 'Semua' || u.className === selectedClass)
  );

  const handleSaveStudent = (stu) => {
    const status = draftStatuses[stu.id] || 'Hadir';
    const note = draftNotes[stu.id] || '';
    markManualAttendance({
      studentId: stu.id,
      studentName: stu.name,
      className: stu.className,
      subject: selectedSubject,
      status,
      note,
    });
  };

  const handleSaveAll = () => {
    students.forEach((stu) => handleSaveStudent(stu));
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Input Presensi Manual Kelas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Catat kehadiran siswa secara langsung bila siswa tidak membawa perangkat
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold max-w-[220px]"
          >
            {state.subjects.map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSaveAll}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold transition"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Simpan Semua</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {students.map((stu) => {
          const currentStatus = draftStatuses[stu.id] || 'Hadir';
          return (
            <div
              key={stu.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar user={stu} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{stu.name}</p>
                  <p className="text-xs text-slate-500">
                    {stu.className} • NISN {stu.identifier}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDraftStatuses({ ...draftStatuses, [stu.id]: opt })}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      currentStatus === opt
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-indigo-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Catatan opsional..."
                  value={draftNotes[stu.id] || ''}
                  onChange={(e) => setDraftNotes({ ...draftNotes, [stu.id]: e.target.value })}
                  className="flex-1 lg:w-44 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleSaveStudent(stu)}
                  className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-bold shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

