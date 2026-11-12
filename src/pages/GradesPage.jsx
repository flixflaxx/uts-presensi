import { useState } from 'react';
import { Award, Edit3, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function GradesPage() {
  const { state, currentUser, updateGradeRecord } = useApp();
  const isTeacher = currentUser?.role === 'teacher' || currentUser?.role === 'admin';
  const [editingId, setEditingId] = useState(null);
  const [scores, setScores] = useState({ tugas: 0, uts: 0, uas: 0 });

  const avgScore = (
    state.grades.reduce((acc, g) => acc + g.finalScore, 0) / (state.grades.length || 1)
  ).toFixed(1);

  const startEdit = (g) => {
    setEditingId(g.id);
    setScores({ tugas: g.tugas, uts: g.uts, uas: g.uas });
  };

  const handleSave = (id) => {
    updateGradeRecord(id, scores);
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-white/80">
            {isTeacher ? 'Portal Input Nilai Guru' : 'Rapor Semester Ganjil 2026/2027'}
          </p>
          <h2 className="text-xl font-extrabold mt-0.5">
            {isTeacher ? 'Evaluasi Nilai Siswa • XI RPL 1' : `Capaian Akademik • ${currentUser?.name}`}
          </h2>
        </div>
        <div className="rounded-2xl bg-white/15 backdrop-blur-sm px-5 py-3 text-center shrink-0">
          <p className="text-[11px] font-semibold text-white/85">Rata-rata Kelas / Nilai</p>
          <p className="text-2xl font-extrabold">{avgScore}</p>
        </div>
      </div>

      {/* Cards on Mobile, Table on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-3.5">
        {state.grades.map((g) => (
          <div key={g.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{g.subject}</h3>
                <p className="text-[11px] text-slate-500">{g.teacher}</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-extrabold">
                {g.grade} ({g.finalScore})
              </span>
            </div>

            {editingId === g.id ? (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {['tugas', 'uts', 'uas'].map((field) => (
                  <div key={field}>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                      {field}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={scores[field]}
                      onChange={(e) => setScores({ ...scores, [field]: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold"
                    />
                  </div>
                ))}
                <div className="col-span-3 flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => handleSave(g.id)}
                    className="flex-1 rounded-xl bg-indigo-600 text-white py-2 text-xs font-bold"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-xl bg-slate-100 text-slate-600 px-3 py-2 text-xs font-bold"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 rounded-xl p-2.5 text-xs">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">Tugas</p>
                  <p className="font-bold text-slate-800">{g.tugas}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">UTS</p>
                  <p className="font-bold text-slate-800">{g.uts}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">UAS</p>
                  <p className="font-bold text-slate-800">{g.uas}</p>
                </div>
              </div>
            )}

            {isTeacher && editingId !== g.id && (
              <button
                type="button"
                onClick={() => startEdit(g)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 text-xs font-bold"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ubah Nilai</span>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-5">Mata Pelajaran</th>
              <th className="py-3.5 px-5">Guru Pengampu</th>
              <th className="py-3.5 px-4 text-center">Tugas (35%)</th>
              <th className="py-3.5 px-4 text-center">UTS (30%)</th>
              <th className="py-3.5 px-4 text-center">UAS (35%)</th>
              <th className="py-3.5 px-4 text-center">Nilai Akhir</th>
              <th className="py-3.5 px-4 text-center">Predikat</th>
              {isTeacher && <th className="py-3.5 px-5 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {state.grades.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50/70">
                <td className="py-4 px-5 font-bold text-slate-900">{g.subject}</td>
                <td className="py-4 px-5 text-slate-600">{g.teacher}</td>
                {editingId === g.id ? (
                  <>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        value={scores.tugas}
                        onChange={(e) => setScores({ ...scores, tugas: e.target.value })}
                        className="w-16 text-center rounded-lg border border-indigo-300 py-1 font-bold"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        value={scores.uts}
                        onChange={(e) => setScores({ ...scores, uts: e.target.value })}
                        className="w-16 text-center rounded-lg border border-indigo-300 py-1 font-bold"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="number"
                        value={scores.uas}
                        onChange={(e) => setScores({ ...scores, uas: e.target.value })}
                        className="w-16 text-center rounded-lg border border-indigo-300 py-1 font-bold"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-4 px-4 text-center font-semibold text-slate-700">{g.tugas}</td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-700">{g.uts}</td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-700">{g.uas}</td>
                  </>
                )}
                <td className="py-4 px-4 text-center font-extrabold text-indigo-700 text-sm">
                  {g.finalScore}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                    <Award className="w-3 h-3" /> {g.grade}
                  </span>
                </td>
                {isTeacher && (
                  <td className="py-4 px-5 text-right">
                    {editingId === g.id ? (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSave(g.id)}
                          className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEdit(g)}
                        className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 font-bold"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

