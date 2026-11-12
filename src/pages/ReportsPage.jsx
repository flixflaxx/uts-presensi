import { Download, Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AttendanceChart from '../components/AttendanceChart';

export default function ReportsPage() {
  const { state, showToast } = useApp();

  const classSummaries = state.classes.map((cls) => {
    const recs = state.attendanceRecords.filter((r) => r.className === cls.name);
    const total = recs.length || 1;
    const hadir = recs.filter((r) => r.status === 'Hadir').length;
    const rate = recs.length === 0 ? 94 : Math.round((hadir / total) * 100);
    return {
      ...cls,
      totalRecords: recs.length,
      hadir,
      rate,
    };
  });

  const handleExport = () => {
    const header = ['Kelas', 'Jurusan', 'Wali Kelas', 'Jumlah Siswa', 'Persentase Hadir'];
    const rows = classSummaries.map((c) => [c.name, c.major, c.homeroom, c.studentsCount, `${c.rate}%`]);
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-kehadiran-smk-attend.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Laporan kehadiran CSV berhasil diunduh.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">Laporan & Analitik Kehadiran</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ringkasan kehadiran per kelas & jurusan SMKN 1 Nusantara
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-bold"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      <AttendanceChart
        title="Tren Kehadiran Sekolah Mingguan"
        subtitle="Agregasi persentase hadir tepat waktu seluruh kelas"
      />

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {classSummaries.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">{c.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                {c.rate}% Hadir
              </span>
            </div>
            <p className="text-xs text-slate-500">{c.major}</p>
            <p className="text-xs text-slate-600">
              Wali Kelas: {c.homeroom} • {c.studentsCount} Siswa
            </p>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-5">Kelas</th>
              <th className="py-3.5 px-5">Jurusan</th>
              <th className="py-3.5 px-5">Wali Kelas</th>
              <th className="py-3.5 px-4 text-center">Jumlah Siswa</th>
              <th className="py-3.5 px-5 text-right">Tingkat Kehadiran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {classSummaries.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70">
                <td className="py-4 px-5 font-extrabold text-slate-900">{c.name}</td>
                <td className="py-4 px-5 text-slate-600">{c.major}</td>
                <td className="py-4 px-5 text-slate-700">{c.homeroom}</td>
                <td className="py-4 px-4 text-center font-semibold">{c.studentsCount}</td>
                <td className="py-4 px-5 text-right">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold">
                    {c.rate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

