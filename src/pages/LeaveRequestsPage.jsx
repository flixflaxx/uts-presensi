import { Check, X, Calendar, FileCheck2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATUS_STYLES } from '../config/theme';

export default function LeaveRequestsPage() {
  const { state, reviewLeaveRequest } = useApp();

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Persetujuan Pengajuan Izin & Sakit</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifikasi pengajuan izin siswa agar otomatis tercatat pada rekap presensi
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
          {state.leaveRequests.filter((l) => l.status === 'Menunggu').length} Menunggu
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.leaveRequests.map((lv) => (
          <div
            key={lv.id}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{lv.studentName}</h3>
                    <p className="text-xs text-slate-500">
                      {lv.className} • Jenis: <strong className="text-slate-700">{lv.type}</strong>
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    STATUS_STYLES[lv.status] || STATUS_STYLES.Menunggu
                  }`}
                >
                  {lv.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-3">
                {lv.reason}
              </p>

              <p className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                <Calendar className="w-3.5 h-3.5" /> Tanggal: {lv.startDate}
                {lv.reviewedBy && <span>• Diproses oleh {lv.reviewedBy}</span>}
              </p>
            </div>

            {lv.status === 'Menunggu' && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => reviewLeaveRequest(lv.id, 'Disetujui')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-xs font-bold transition"
                >
                  <Check className="w-4 h-4" />
                  <span>Setujui</span>
                </button>
                <button
                  type="button"
                  onClick={() => reviewLeaveRequest(lv.id, 'Ditolak')}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 py-2 text-xs font-bold transition"
                >
                  <X className="w-4 h-4" />
                  <span>Tolak</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

