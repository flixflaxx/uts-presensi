import { TrendingUp } from 'lucide-react';
import { WEEKLY_ATTENDANCE_STATS } from '../data/seedData';

export default function AttendanceChart({ title = 'Statistik Kehadiran Mingguan', subtitle = 'Persentase kehadiran kelas & sesi aktif' }) {
  const avgPresent = Math.round(
    WEEKLY_ATTENDANCE_STATS.reduce((acc, item) => acc + item.present, 0) / WEEKLY_ATTENDANCE_STATS.length
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-[0_2px_14px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Rata-rata {avgPresent}% Hadir</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 pt-4 px-1">
        {WEEKLY_ATTENDANCE_STATS.map((item) => (
          <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
            <div className="text-[10px] sm:text-xs font-bold text-indigo-600 opacity-85 group-hover:opacity-100 transition-opacity">
              {item.present}%
            </div>
            <div className="w-full max-w-[38px] h-28 bg-slate-100 rounded-xl p-1 flex flex-col justify-end overflow-hidden">
              <div
                className="w-full rounded-lg bg-gradient-to-t from-[#4F46E5] via-[#6366F1] to-[#8B5CF6] transition-all duration-500 group-hover:from-[#3730A3] group-hover:to-[#7C3AED]"
                style={{ height: `${item.present}%` }}
                title={`${item.day}: Hadir ${item.present}%, Terlambat ${item.late}%, Alpa ${item.absent}%`}
              />
            </div>
            <span className="text-xs font-semibold text-slate-600">{item.day}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            Hadir Tepat Waktu
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            Izin / Terlambat
          </span>
        </div>
        <span className="font-medium text-slate-400">Minggu Aktif • Nov 2026</span>
      </div>
    </div>
  );
}

