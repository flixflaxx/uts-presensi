import { useMemo, useState } from 'react';
import { Clock, MapPin, Plus, QrCode, Trash2, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PASTEL_VARIANTS } from '../config/theme';
import { getPageUrl, isTestEnvironment } from '../config/routes';
import Modal from '../components/Modal';

const DAYS = ['Semua', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export default function SchedulePage() {
  const { state, currentUser, searchQuery, navigate, createQrSession, addSchedule, deleteSchedule } = useApp();
  const [selectedDay, setSelectedDay] = useState('Semua');
  const [selectedClass, setSelectedClass] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    day: 'Senin',
    start: '07:15',
    end: '09:30',
    subject: 'Pemrograman Web & Perangkat Bergerak',
    className: 'XI RPL 1',
    teacher: 'Ahmad Fauzi, S.Kom',
    room: 'Lab RPL 1',
  });

  const role = currentUser?.role || 'student';

  const filteredSchedules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return state.schedules.filter((sch) => {
      if (role === 'student' && sch.className !== currentUser?.className) return false;
      if (role === 'teacher' && selectedClass === 'Semua' && sch.teacherId !== currentUser?.id) return false;
      if (selectedDay !== 'Semua' && sch.day !== selectedDay) return false;
      if (selectedClass !== 'Semua' && sch.className !== selectedClass) return false;
      if (
        q &&
        !sch.subject.toLowerCase().includes(q) &&
        !sch.teacher.toLowerCase().includes(q) &&
        !sch.room.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [state.schedules, role, currentUser, selectedDay, selectedClass, searchQuery]);

  const handleLaunchQrFromSchedule = (sch) => {
    createQrSession({
      subject: sch.subject,
      className: sch.className,
      room: sch.room,
      meetingLabel: `Jadwal ${sch.day} • ${sch.start} - ${sch.end}`,
    });
    navigate('attendance');
  };

  const handleCreateSchedule = (e) => {
    e.preventDefault();
    addSchedule({ ...form, teacherId: 'usr-tch-1' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {role === 'teacher'
              ? 'Jadwal Mengajar Guru'
              : role === 'admin'
              ? 'Manajemen Jadwal Pelajaran'
              : `Jadwal Pelajaran • ${currentUser?.className}`}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {state.schoolSettings.academicYear}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(role === 'admin' || role === 'teacher') && (
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="Semua">Semua Kelas</option>
              {state.classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {role === 'admin' && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 text-xs font-bold transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>
          )}
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {DAYS.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
              selectedDay === day
                ? 'bg-gradient-to-r from-[#2563EB] to-[#6D28D9] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Grid Cards */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
          Tidak ada jadwal pelajaran untuk filter yang dipilih.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSchedules.map((sch) => {
            const variant = PASTEL_VARIANTS[sch.color] || PASTEL_VARIANTS.purple;
            return (
              <div
                key={sch.id}
                className={`rounded-2xl border p-4 shadow-sm transition hover:shadow-md flex flex-col justify-between gap-3 ${variant.card}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${variant.softBg}`}>
                      {sch.day} • {sch.className}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {sch.start} - {sch.end}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-sm font-extrabold text-slate-900 leading-snug">
                    {sch.subject}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-slate-600">
                    <p className="inline-flex items-center gap-1.5 mr-3">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {sch.teacher}
                    </p>
                    <p className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {sch.room}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-black/5 flex items-center justify-between gap-2">
                  {role === 'student' && (
                    <a
                      href={getPageUrl('scan-qr')}
                      onClick={(e) => {
                        if (isTestEnvironment()) {
                          e.preventDefault();
                          navigate('scan-qr');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:underline"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scan QR Kelas</span>
                    </a>
                  )}

                  {role === 'teacher' && (
                    <button
                      type="button"
                      onClick={() => handleLaunchQrFromSchedule(sch)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-xs font-bold transition"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Buka Sesi QR</span>
                    </button>
                  )}

                  {role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => deleteSchedule(sch.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Schedule Modal for Admin */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Jadwal Pelajaran">
        <form onSubmit={handleCreateSchedule} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hari</label>
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {DAYS.slice(1).map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kelas</label>
              <select
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {state.classes.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jam Mulai</label>
              <input
                type="text"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jam Selesai</label>
              <input
                type="text"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Guru Pengampu</label>
              <input
                type="text"
                value={form.teacher}
                onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ruangan</label>
              <input
                type="text"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-sm font-bold"
          >
            Simpan Jadwal
          </button>
        </form>
      </Modal>
    </div>
  );
}

