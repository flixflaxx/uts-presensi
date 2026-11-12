import { useMemo, useState } from 'react';
import { Plus, Power, Shield, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import UserAvatar from '../components/UserAvatar';
import Modal from '../components/Modal';

export default function AdminManagementPage() {
  const { state, searchQuery, addUser, toggleUserStatus } = useApp();
  const [roleFilter, setRoleFilter] = useState('Semua');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: 'student',
    identifier: '',
    className: 'XI RPL 1',
    major: 'Rekayasa Perangkat Lunak',
    email: '',
  });

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return state.users.filter((u) => {
      if (roleFilter !== 'Semua' && u.role !== roleFilter) return false;
      if (
        q &&
        !u.name.toLowerCase().includes(q) &&
        !u.identifier.toLowerCase().includes(q) &&
        !u.email.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [state.users, roleFilter, searchQuery]);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.identifier.trim()) return;
    addUser(form);
    setForm({
      name: '',
      role: 'student',
      identifier: '',
      className: 'XI RPL 1',
      major: 'Rekayasa Perangkat Lunak',
      email: '',
    });
    setShowAdd(false);
  };

  const roleLabels = { student: 'Siswa', teacher: 'Guru', admin: 'Admin' };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Manajemen Pengguna Portal</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola akun siswa, guru, dan administrator SMK Attend ({filtered.length} pengguna)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#6D28D9] text-white px-4 py-2.5 text-xs font-bold shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Role Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'Semua', label: 'Semua' },
          { id: 'student', label: 'Siswa' },
          { id: 'teacher', label: 'Guru' },
          { id: 'admin', label: 'Admin' },
        ].map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRoleFilter(r.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              roleFilter === r.id
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((u) => (
          <div key={u.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar user={u} size="md" />
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{u.name}</h3>
                  <p className="text-xs text-slate-500 truncate">
                    {roleLabels[u.role]} • {u.className}
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  u.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
              <span className="text-slate-500">
                {u.identifierLabel}: {u.identifier}
              </span>
              <button
                type="button"
                onClick={() => toggleUserStatus(u.id)}
                className="font-bold text-indigo-600 hover:underline"
              >
                {u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-5">Pengguna</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">NISN / NIP</th>
                <th className="py-3.5 px-4">Kelas / Unit</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={u} size="sm" />
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                      {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                      {roleLabels[u.role]}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{u.identifier}</td>
                  <td className="py-3.5 px-4 text-slate-700">{u.className}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {u.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => toggleUserStatus(u.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-3 py-1.5 font-bold transition"
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Tambah Pengguna Baru">
        <form onSubmit={handleCreate} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="student">Siswa</option>
                <option value="teacher">Guru</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">NISN / NIP</label>
              <input
                type="text"
                required
                value={form.identifier}
                onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kelas / Unit</label>
              <input
                type="text"
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 text-white py-2.5 text-sm font-bold"
          >
            Simpan Pengguna
          </button>
        </form>
      </Modal>
    </div>
  );
}

