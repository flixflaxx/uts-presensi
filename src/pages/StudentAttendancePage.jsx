import { useState } from 'react';
import { QrCode, CheckCircle2, Clock, FilePlus2, ArrowRight, History } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATUS_STYLES } from '../config/theme';
import { getPageUrl, isTestEnvironment } from '../config/routes';

export default function StudentAttendancePage() {
  const { state, currentUser, navigate, submitLeaveRequest } = useApp();
  const [leaveType, setLeaveType] = useState('Izin');
  const [startDate, setStartDate] = useState('2026-11-12');
  const [reason, setReason] = useState('');

  const myRecords = state.attendanceRecords.filter((r) => r.studentId === currentUser?.id);
  const hadirCount = myRecords.filter((r) => r.status === 'Hadir').length;
  const lateCount = myRecords.filter((r) => r.status === 'Terlambat').length;
  const izinCount = myRecords.filter((r) => r.status === 'Izin' || r.status === 'Sakit').length;
  const myLeaves = state.leaveRequests.filter((l) => l.studentId === currentUser?.id);
  const activeSessions = state.qrSessions.filter(
    (s) => s.active && s.className === currentUser?.className
  );

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    submitLeaveRequest({ type: leaveType, startDate, endDate: startDate, reason });
    setReason('');
  };

  return (
    <div className="space-y-6">
      {/* Prioritized Scan QR Hero Card */}
      <div className="rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white p-5 sm:p-6 shadow-lg shadow-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            {activeSessions.length} Sesi QR Aktif untuk {currentUser?.className}
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold">Presensi QR Code Kelas</h2>
          <p className="text-xs sm:text-sm text-white/85">
            Scan kode QR dari guru pengampu untuk mencatat kehadiran hari ini secara instan.
          </p>
        </div>

        <a
          href={getPageUrl('scan-qr')}
          onClick={(e) => {
            if (isTestEnvironment()) {
              e.preventDefault();
              navigate('scan-qr');
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-indigo-700 px-5 py-3 text-sm font-extrabold shadow-md hover:bg-indigo-50 active:scale-95 transition shrink-0"
        >
          <QrCode className="w-5 h-5" />
          <span>Scan QR Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Summary Pills */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#EAF9F0] border border-[#CEEFE0] rounded-2xl p-3.5 text-center">
          <p className="text-xl font-extrabold text-emerald-700">{hadirCount}</p>
          <p className="text-[11px] font-bold text-emerald-800 mt-0.5">Hadir</p>
        </div>
        <div className="bg-[#FFF9E5] border border-[#FDEBB6] rounded-2xl p-3.5 text-center">
          <p className="text-xl font-extrabold text-amber-700">{lateCount}</p>
          <p className="text-[11px] font-bold text-amber-800 mt-0.5">Terlambat</p>
        </div>
        <div className="bg-[#EBF6FF] border border-[#CFE8FF] rounded-2xl p-3.5 text-center">
          <p className="text-xl font-extrabold text-sky-700">{izinCount}</p>
          <p className="text-[11px] font-bold text-sky-800 mt-0.5">Izin / Sakit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Leave Request Form */}
        <form
          onSubmit={handleLeaveSubmit}
          className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <FilePlus2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pengajuan Izin / Sakit</h3>
              <p className="text-[11px] text-slate-500">Dikirim ke wali kelas & admin</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Jenis</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                <option value="Izin">Izin</option>
                <option value="Sakit">Sakit</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alasan / Keterangan</label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tuliskan alasan ketidakhadiran secara jelas..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-xs sm:text-sm font-bold transition"
          >
            Kirim Pengajuan
          </button>
        </form>

        {/* Recent Records & Leave Status */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Riwayat Presensi Terakhir</h3>
              <a
                href={getPageUrl('attendance-history')}
                onClick={(e) => {
                  if (isTestEnvironment()) {
                    e.preventDefault();
                    navigate('attendance-history');
                  }
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
              >
                <History className="w-3.5 h-3.5" />
                <span>Lihat Semua</span>
              </a>
            </div>

            <div className="divide-y divide-slate-100">
              {myRecords.slice(0, 4).map((rec) => (
                <div key={rec.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {rec.subject}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {rec.date} ({rec.time})
                      </span>
                      <span>• {rec.method}</span>
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      STATUS_STYLES[rec.status] || STATUS_STYLES.Hadir
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Status Pengajuan Izin Saya</h3>
            {myLeaves.length === 0 ? (
              <p className="text-xs text-slate-500">Belum ada pengajuan izin/sakit.</p>
            ) : (
              <div className="space-y-2.5">
                {myLeaves.map((lv) => (
                  <div
                    key={lv.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900">
                        {lv.type} • {lv.startDate}
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">{lv.reason}</p>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        STATUS_STYLES[lv.status] || STATUS_STYLES.Menunggu
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {lv.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

