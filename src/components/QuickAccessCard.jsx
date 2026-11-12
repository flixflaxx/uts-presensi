import { ChevronRight } from 'lucide-react';
import { PASTEL_VARIANTS } from '../config/theme';
import { getPageUrl, isTestEnvironment } from '../config/routes';

export default function QuickAccessCard({ item, onClick }) {
  const variant = PASTEL_VARIANTS[item.color] || PASTEL_VARIANTS.purple;
  const Icon = item.icon;
  const isPriority = Boolean(item.priority);

  const handleClick = (e) => {
    if (isTestEnvironment()) {
      e.preventDefault();
      onClick?.(item.id);
    }
  };

  return (
    <a
      href={getPageUrl(item.id)}
      onClick={handleClick}
      className={`group relative flex flex-col justify-between text-left rounded-2xl border p-2.5 sm:p-3.5 transition-all duration-200 active:scale-[0.97] hover:-translate-y-0.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_20px_rgba(79,70,229,0.10)] min-h-[96px] sm:min-h-[118px] w-full min-w-0 overflow-hidden ${
        variant.card
      } ${isPriority ? 'ring-2 ring-indigo-500/45 shadow-[0_6px_18px_rgba(79,70,229,0.14)]' : ''}`}
    >
      {/* Top Row: Solid Circular Icon + Optional Badge */}
      <div className="flex items-start justify-between gap-1 w-full min-w-0">
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white shadow-sm shrink-0 transition-transform duration-200 group-hover:scale-105 ${variant.iconBg}`}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.2} />
        </div>

        {item.badge && (
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[10px] font-bold tracking-wide uppercase shrink-0 ${variant.badge}`}
          >
            {isPriority && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            )}
            {item.badge}
          </span>
        )}
      </div>

      {/* Bottom Text + Right Arrow */}
      <div className="mt-1.5 w-full min-w-0">
        <h3 className="text-[11px] sm:text-[13.5px] font-bold text-slate-900 leading-tight break-words">
          {item.label}
        </h3>
        <div className="mt-0.5 flex items-end justify-between gap-1 w-full min-w-0">
          <p className="text-[9.5px] sm:text-[11px] text-slate-500 leading-snug line-clamp-2 min-w-0 flex-1">
            {item.desc}
          </p>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0 mb-0.5" />
        </div>
      </div>
    </a>
  );
}
