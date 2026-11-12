import { Clock, MapPin, QrCode } from 'lucide-react';
import { STATUS_STYLES } from '../config/theme';
import { getPageUrl, isTestEnvironment } from '../config/routes';

const DATE_BOX_PALETTE = [
  'bg-[#EEF2FF] text-[#4F46E5]',
  'bg-[#FFF2E6] text-[#EA580C]',
  'bg-[#E8F8F0] text-[#059669]',
  'bg-[#FFEBF3] text-[#DB2777]',
];

export default function UpcomingActivitiesCard({
  activities = [],
  title = 'Upcoming Activities',
  viewAllLabel = 'View All',
  footerLabel = 'View All Activities',
  viewAllPage = 'schedule',
  onViewAll,
  onSelectActivity,
}) {
  const handleLink = (e, pageId, act) => {
    if (isTestEnvironment()) {
      e.preventDefault();
      if (act) onSelectActivity?.(act);
      else onViewAll?.();
    }
  };

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h2 className="text-[15px] sm:text-base font-bold text-slate-900">{title}</h2>
        {onViewAll && (
          <a
            href={getPageUrl(viewAllPage)}
            onClick={(e) => handleLink(e, viewAllPage)}
            className="text-xs sm:text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {viewAllLabel}
          </a>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_14px_rgba(15,23,42,0.04)] overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            Tidak ada aktivitas atau jadwal yang cocok dengan pencarian Anda.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activities.map((act, idx) => {
              const boxClass = act.isQr
                ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white'
                : DATE_BOX_PALETTE[idx % DATE_BOX_PALETTE.length];
              const badgeClass = STATUS_STYLES[act.status] || STATUS_STYLES.Upcoming;
              const targetPage = act.targetPage || 'schedule';

              return (
                <a
                  key={act.id}
                  href={getPageUrl(targetPage)}
                  onClick={(e) => handleLink(e, targetPage, act)}
                  className="w-full text-left p-3.5 sm:p-4 flex items-center gap-3.5 hover:bg-slate-50/80 transition-colors"
                >
                  {/* Left Date or QR Icon Box */}
                  <div
                    className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 font-bold leading-tight ${boxClass}`}
                  >
                    {act.isQr ? (
                      <>
                        <QrCode className="w-5 h-5 mb-0.5" />
                        <span className="text-[9px] uppercase tracking-wider font-extrabold">QR</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[9px] uppercase tracking-wider opacity-80">
                          {act.monthShort}
                        </span>
                        <span className="text-[16px] font-extrabold leading-none my-0.5">
                          {act.dayNum}
                        </span>
                        <span className="text-[9px] font-medium opacity-75">{act.dayName}</span>
                      </>
                    )}
                  </div>

                  {/* Center Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[13.5px] sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {act.title}
                      </h3>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${badgeClass}`}
                      >
                        {act.status === 'Active' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                        {act.status}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-col gap-0.5 text-[11.5px] text-slate-500">
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{act.time}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{act.location}</span>
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {onViewAll && activities.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/40">
            <a
              href={getPageUrl(viewAllPage)}
              onClick={(e) => handleLink(e, viewAllPage)}
              className="block w-full py-2.5 text-center text-xs sm:text-[13px] font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 transition-colors"
            >
              {footerLabel}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
