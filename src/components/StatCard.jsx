import { PASTEL_VARIANTS } from '../config/theme';
import { getPageUrl, isTestEnvironment } from '../config/routes';

export default function StatCard({ label, value, sublabel, icon: Icon, color = 'purple', targetPage, onClick }) {
  const variant = PASTEL_VARIANTS[color] || PASTEL_VARIANTS.purple;

  const content = (
    <>
      <div
        className={`w-10 h-10 xl:w-11 xl:h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm ${variant.iconBg}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] xl:text-xs font-semibold text-slate-500 truncate">{label}</p>
        <p className="text-lg xl:text-xl font-extrabold text-slate-900 leading-tight mt-0.5">{value}</p>
        {sublabel && <p className="text-[10.5px] xl:text-[11px] text-slate-400 truncate mt-0.5">{sublabel}</p>}
      </div>
    </>
  );

  const classes =
    'text-left rounded-2xl border p-3.5 xl:p-4 bg-white border-slate-100 shadow-[0_2px_12px_rgba(15,23,42,0.04)] flex items-center gap-3 xl:gap-3.5 min-w-0 transition';

  if (targetPage) {
    return (
      <a
        href={getPageUrl(targetPage)}
        onClick={(e) => {
          if (isTestEnvironment()) {
            e.preventDefault();
            onClick?.();
          }
        }}
        className={`${classes} hover:shadow-md hover:-translate-y-0.5 cursor-pointer`}
      >
        {content}
      </a>
    );
  }

  return <div className={classes}>{content}</div>;
}
