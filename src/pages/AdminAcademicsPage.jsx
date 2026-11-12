import { useState } from 'react';
import { BookMarked, Layers, Plus, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

export default function AdminAcademicsPage({ initialTab = 'classes' }) {
  const { state, addClassRoom, addSubject } = useApp();
  const [tab, setTab] = useState(initialTab);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);

  const [classForm, setClassForm] = useState({
    name: '',
    major: 'Rekayasa Perangkat Lunak',
    homeroom: 'Ahmad Fauzi, S.Kom',
    room: 'Lab RPL 3',
  });
  const [subForm, setSubForm] = useState({
    code: '',
    name: '',
    major: 'RPL',
    hoursPerWeek: 4,
    teacher: 'Ahmad Fauzi, S.Kom',
  });

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!classForm.name.trim()) return;
    addClassRoom(classForm);
    setClassForm({ name: '', major: 'Rekayasa Perangkat Lunak', homeroom: 'Ahmad Fauzi, S.Kom', room: 'Lab RPL 3' });
    setShowAddClass(false);
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!subForm.name.trim()) return;
    addSubject(subForm);
    setSubForm({ code: '', name: '', major: 'RPL', hoursPerWeek: 4, teacher: 'Ahmad Fauzi, S.Kom' });
    setShowAddSubject(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTab('classes')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'classes'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-indigo-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Kelas & Jurusan ({state.classes.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('subjects')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              tab === 'subjects'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-indigo-50'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>Mata Pelajaran ({state.subjects.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => (tab === 'classes' ? setShowAddClass(true) : setShowAddSubject(true))}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#6D28D9] text-white px-4 py-2 text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>{tab === 'classes' ? 'Tambah Kelas' : 'Tambah Mapel'}</span>
        </button>
      </div>

      {tab === 'classes' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900">{cls.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                  {cls.room}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600">{cls.major}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Wali: {cls.homeroom}</span>
                <span className="inline-flex items-center gap-1 font-bold text-slate-700">
                  <Users className="w-3.5 h-3.5" /> {cls.studentsCount}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.subjects.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold">
                  {sub.code}
                </span>
                <span className="text-xs font-bold text-slate-500">{sub.hoursPerWeek} JP/minggu</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">{sub.name}</h3>
              <p className="text-xs text-slate-500">
                Jurusan: {sub.major} • {sub.teacher}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal open={showAddClass} onClose={() => setShowAddClass(false)} title="Tambah Kelas Baru">
        <form onSubmit={handleAddClass} className="space-y-3">
          <input
            type="text"
            required
            placeholder="Nama Kelas (cth: XII TKJ 2)"
            value={classForm.name}
            onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="text"
            required
            placeholder="Jurusan"
            value={classForm.major}
            onChange={(e) => setClassForm({ ...classForm, major: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Wali Kelas"
            value={classForm.homeroom}
            onChange={(e) => setClassForm({ ...classForm, homeroom: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Ruangan Utama"
            value={classForm.room}
            onChange={(e) => setClassForm({ ...classForm, room: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <button type="submit" className="w-full rounded-xl bg-indigo-600 text-white py-2.5 text-sm font-bold">
            Simpan Kelas
          </button>
        </form>
      </Modal>

      <Modal open={showAddSubject} onClose={() => setShowAddSubject(false)} title="Tambah Mata Pelajaran">
        <form onSubmit={handleAddSubject} className="space-y-3">
          <input
            type="text"
            required
            placeholder="Kode Mapel (cth: RPL-305)"
            value={subForm.code}
            onChange={(e) => setSubForm({ ...subForm, code: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="text"
            required
            placeholder="Nama Mata Pelajaran"
            value={subForm.name}
            onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Guru Pengampu"
            value={subForm.teacher}
            onChange={(e) => setSubForm({ ...subForm, teacher: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <button type="submit" className="w-full rounded-xl bg-indigo-600 text-white py-2.5 text-sm font-bold">
            Simpan Mapel
          </button>
        </form>
      </Modal>
    </div>
  );
}

