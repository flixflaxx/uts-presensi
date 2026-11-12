import { useMemo, useState } from 'react';
import { BellRing, Calendar, MapPin, Plus, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

export default function NoticesPage() {
  const { state, currentUser, searchQuery, createNotice, markNoticeRead } = useApp();
  const [category, setCategory] = useState('Semua');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Akademik',
    audience: 'Semua',
    location: 'Portal Sekolah',
    content: '',
  });

  const canPublish = currentUser?.role === 'admin' || currentUser?.role === 'teacher';

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return state.notices.filter((n) => {
      if (category !== 'Semua' && n.category !== category) return false;
      if (
        q &&
        !n.title.toLowerCase().includes(q) &&
        !n.content.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [state.notices, category, searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    createNotice(form);
    setForm({ title: '', category: 'Akademik', audience: 'Semua', location: 'Portal Sekolah', content: '' });
    setShowCreate(false);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Pengumuman & Informasi Sekolah</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Berita akademik, jadwal kegiatan, dan pengumuman resmi SMKN 1 Nusantara
          </p>
        </div>

        {canPublish && (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#6D28D9] text-white px-4 py-2.5 text-xs font-bold shadow-sm hover:brightness-105 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Pengumuman</span>
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['Semua', 'Penting', 'Akademik', 'Kegiatan'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
              category === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((n) => (
          <article
            key={n.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm space-y-3 transition ${
              !n.read ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-slate-100'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <BellRing className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {n.category} • {n.audience}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{n.title}</h3>
                </div>
              </div>
              {n.isNew && (
                <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold shrink-0">
                  NEW
                </span>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {n.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {n.location}
                </span>
              </div>

              {!n.read && (
                <button
                  type="button"
                  onClick={() => markNoticeRead(n.id)}
                  className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:underline"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Tandai dibaca</span>
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Publikasikan Pengumuman">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Pengumuman</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Contoh: Jadwal Praktikum Lab RPL"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option>Akademik</option>
                <option>Penting</option>
                <option>Kegiatan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target</label>
              <select
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option>Semua</option>
                <option>Siswa</option>
                <option>Guru</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi / Keterangan</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Isi Pengumuman</label>
            <textarea
              rows={3}
              required
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-sm font-bold"
          >
            Publikasikan Sekarang
          </button>
        </form>
      </Modal>
    </div>
  );
}

