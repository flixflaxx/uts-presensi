import { useState } from 'react';
import { Calendar, CheckCircle2, FileText, Plus, UploadCloud } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATUS_STYLES } from '../config/theme';
import Modal from '../components/Modal';

export default function AssignmentsPage() {
  const { state, currentUser, searchQuery, submitAssignment, createAssignment, gradeAssignment } =
    useApp();
  const isTeacher = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [submitModal, setSubmitModal] = useState(null);
  const [fileName, setFileName] = useState('tugas_alex_pratama.pdf');
  const [createModal, setCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    subject: 'Pemrograman Web & Perangkat Bergerak',
    className: 'XI RPL 1',
    dueDate: '2026-11-20',
    description: '',
  });
  const [scoreInputs, setScoreInputs] = useState({});

  const q = searchQuery.trim().toLowerCase();
  const items = state.assignments.filter((a) => {
    if (statusFilter !== 'Semua' && a.status !== statusFilter) return false;
    if (
      q &&
      !a.title.toLowerCase().includes(q) &&
      !a.subject.toLowerCase().includes(q)
    ) {
      return false;
    }
    return true;
  });

  const handleSubmitTask = (e) => {
    e.preventDefault();
    if (!submitModal) return;
    submitAssignment(submitModal.id, fileName);
    setSubmitModal(null);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    createAssignment(newTask);
    setNewTask({
      title: '',
      subject: 'Pemrograman Web & Perangkat Bergerak',
      className: 'XI RPL 1',
      dueDate: '2026-11-20',
      description: '',
    });
    setCreateModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            {isTeacher ? 'Manajemen Tugas Kelas' : 'Daftar Tugas Sekolah'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTeacher ? 'Terbitkan tugas baru dan nilai pengumpulan siswa' : 'Pantau tenggat waktu & unggah tugas Anda'}
          </p>
        </div>

        {isTeacher && (
          <button
            type="button"
            onClick={() => setCreateModal(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#6D28D9] text-white px-4 py-2.5 text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Tugas Baru</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['Semua', 'Belum Dikumpulkan', 'Sudah Dikumpulkan', 'Dinilai'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              statusFilter === st
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between gap-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600">
                  <FileText className="w-3.5 h-3.5" />
                  {a.subject}
                </span>
                <span
                  className={`shrink-0 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                    STATUS_STYLES[a.status] || STATUS_STYLES.Upcoming
                  }`}
                >
                  {a.status}
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{a.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{a.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Tenggat: {a.dueDate}
                </span>
                <span>• {a.className}</span>
                {a.score !== null && (
                  <span className="font-bold text-emerald-700">• Nilai: {a.score}/100</span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              {a.submittedFile && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {a.submittedFile}
                </span>
              )}

              {!isTeacher && a.status === 'Belum Dikumpulkan' && (
                <button
                  type="button"
                  onClick={() => setSubmitModal(a)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold transition"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Kumpulkan Tugas</span>
                </button>
              )}

              {isTeacher && (
                <div className="ml-auto flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Nilai"
                    value={scoreInputs[a.id] ?? (a.score ?? '')}
                    onChange={(e) => setScoreInputs({ ...scoreInputs, [a.id]: e.target.value })}
                    className="w-20 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => gradeAssignment(a.id, scoreInputs[a.id] || 90)}
                    className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-xs font-bold"
                  >
                    Beri Nilai
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Assignment Modal */}
      <Modal
        open={Boolean(submitModal)}
        onClose={() => setSubmitModal(null)}
        title="Kumpulkan Tugas"
        subtitle={submitModal?.title}
      >
        <form onSubmit={handleSubmitTask} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Berkas / Link</label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-sm font-bold"
          >
            Unggah & Kirim Tugas
          </button>
        </form>
      </Modal>

      {/* Create Assignment Modal */}
      <Modal open={createModal} onClose={() => setCreateModal(false)} title="Buat Tugas Baru">
        <form onSubmit={handleCreateTask} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Tugas</label>
            <input
              type="text"
              required
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kelas</label>
              <select
                value={newTask.className}
                onChange={(e) => setNewTask({ ...newTask, className: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {state.classes.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tenggat</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi</label>
            <textarea
              rows={3}
              required
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 text-white py-2.5 text-sm font-bold"
          >
            Terbitkan Tugas
          </button>
        </form>
      </Modal>
    </div>
  );
}

