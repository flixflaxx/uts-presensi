import { Activity, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ActivityLogsPage() {
  const { state, searchQuery } = useApp();
  const q = searchQuery.trim().toLowerCase();

  const logs = state.activityLogs.filter(
    (l) =>
      !q ||
      l.actor.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Log Aktivitas Sistem</h2>
          <p className="text-xs text-slate-500">
            Riwayat aksi presensi QR, pembukaan sesi, dan persetujuan izin
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100">
        {logs.map((log) => (
          <div key={log.id} className="p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-900">{log.actor}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                  {log.role}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{log.action}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 shrink-0">
              <Clock className="w-3 h-3" /> {log.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

