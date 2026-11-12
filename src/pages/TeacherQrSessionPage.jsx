import { useState } from 'react';
import {
  Copy,
  MapPin,
  Plus,
  Power,
  QrCode,
  RefreshCw,
  Users,
  Clock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import QrCodeGraphic from '../components/QrCodeGraphic';
import Modal from '../components/Modal';

export default function TeacherQrSessionPage({ isAdminMonitor = false }) {
  const {
    state,
    currentUser,
    createQrSession,
    refreshQrCode,
    toggleQrSession,
    showToast,
  } = useApp();

  const sessions = isAdminMonitor
    ? state.qrSessions
    : state.qrSessions.filter((s) => s.teacherId === currentUser?.id || s.active);

  const [selectedId, setSelectedId] = useState(sessions[0]?.id || '');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    subject: 'Pemrograman Web & Perangkat Bergerak',
    className: 'XI RPL 1',
    room: 'Lab RPL 1',
    meetingLabel: 'Pertemuan 12 • Integrasi Frontend',
    durationMinutes: 45,
  });

  const activeSession =
    sessions.find((s) => s.id === selectedId) || sessions[0] || null;

  const handleCreate = (e) => {
    e.preventDefault();
    const created = createQrSession(form);
    if (created) setSelectedId(created.id);
    setShowCreate(false);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    showToast(`Kode ${code} disalin.`);
  };

  const checkedInStudents = activeSession
    ? state.users.filter((u) => activeSession.attendeeIds.includes(u.id))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {isAdminMonitor ? 'Monitor Sesi QR Seluruh Sekolah' : 'Kelola Sesi QR Presensi'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tampilkan QR Code dinamis di layar kelas agar siswa dapat melakukan scan kehadiran
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#6D28D9] text-white px-4 py-2.5 text-xs font-bold shadow-sm hover:brightness-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Sesi QR Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Session Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Daftar Sesi ({sessions.length})
          </h3>
          {sessions.map((ses) => {
            const isSelected = activeSession?.id === ses.id;
            return (
              <button
                key={ses.id}
                type="button"
                onClick={() => setSelectedId(ses.id)}
                className={`w-full text-left rounded-2xl border p-4 transition space-y-2 ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-300 shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-indigo-600">{ses.className}</p>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {ses.subject}
                    </h4>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ses.active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {ses.active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                    {ses.active ? 'Aktif' : 'Ditutup'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {ses.startTime}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {ses.room}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                    <Users className="w-3 h-3" /> {ses.attendeeIds.length} hadir
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active QR Display & Attendees */}
        <div className="lg:col-span-7 space-y-5">
          {activeSession ? (
            <div className="bg-white rounded-3xl border border-slate-100 p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                    <QrCode className="w-3.5 h-3.5" /> {activeSession.className} • {activeSession.room}
                  </span>
                  <h3 className="mt-1.5 text-base sm:text-lg font-extrabold text-slate-900">
                    {activeSession.subject}
                  </h3>
                  <p className="text-xs text-slate-500">{activeSession.meetingLabel}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activeSession.active
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {activeSession.active ? 'Sesi Terbuka' : 'Sesi Ditutup'}
                </span>
              </div>

              {/* QR Display Box */}
              <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100 p-6 flex flex-col items-center text-center">
                <div className={activeSession.active ? '' : 'opacity-40 grayscale'}>
                  <QrCodeGraphic value={activeSession.code} size={210} />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <code className="px-3.5 py-1.5 rounded-xl bg-white border border-indigo-200 text-sm font-mono font-extrabold text-indigo-700">
                    {activeSession.code}
                  </code>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(activeSession.code)}
                    className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600"
                    title="Salin kode sesi"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 w-full">
                  <button
                    type="button"
                    onClick={() => refreshQrCode(activeSession.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Perbarui Token QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleQrSession(activeSession.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
                      activeSession.active
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{activeSession.active ? 'Tutup Sesi' : 'Aktifkan Kembali'}</span>
                  </button>
                </div>
              </div>

              {/* Checked-in Students */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Siswa Hadir ({checkedInStudents.length})
                  </h4>
                </div>
                {checkedInStudents.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
                    Belum ada siswa yang memindai QR sesi ini.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {checkedInStudents.map((stu) => (
                      <div
                        key={stu.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{stu.name}</p>
                          <p className="text-[10px] text-slate-500">NISN: {stu.identifier}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          Hadir
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-sm text-slate-500">
              Belum ada sesi QR. Klik &ldquo;Buat Sesi QR Baru&rdquo; untuk memulai.
            </div>
          )}
        </div>
      </div>

      {/* Create QR Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Buat Sesi QR Presensi">
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran</label>
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              {state.subjects.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kelas</label>
              <select
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {state.classes.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Topik / Pertemuan</label>
            <input
              type="text"
              value={form.meetingLabel}
              onChange={(e) => setForm({ ...form, meetingLabel: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Durasi Berlaku (menit)</label>
            <input
              type="number"
              min="5"
              max="180"
              value={form.durationMinutes}
              onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-sm font-bold"
          >
            Aktifkan QR Session
          </button>
        </form>
      </Modal>
    </div>
  );
}
