import { BOTTOM_NAV_BY_ROLE } from '../config/navigation';
import { getPageUrl, isTestEnvironment } from '../config/routes';

export default function BottomNav({ role = 'student', activePage, onNavigate, onOpenMore }) {
  const items = BOTTOM_NAV_BY_ROLE[role] || BOTTOM_NAV_BY_ROLE.student;

  const isItemActive = (itemId) => {
    if (itemId === activePage) return true;
    if (
      itemId === 'attendance' &&
      (activePage === 'scan-qr' || activePage === 'attendance-history' || activePage === 'manual-attendance')
    ) {
      return true;
    }
    if (itemId === 'management' && (activePage === 'classes' || activePage === 'subjects')) {
      return true;
    }
    return false;
  };

  return (
    <nav
      aria-label="Navigasi bawah mobile"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-6px_24px_rgba(15,23,42,0.07)] pb-safe"
    >
      <div className="grid grid-cols-4 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(item.id);
          const content = (
            <>
              <div
                className={`p-1 rounded-xl transition-all ${
                  active ? 'bg-indigo-50 text-[#5B4CE6] scale-105' : ''
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 1.9} />
              </div>
              <span className={`mt-0.5 text-[11px] leading-none ${active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </>
          );

          if (item.id === 'more') {
            return (
              <button
                key={item.id}
                type="button"
                onClick={onOpenMore}
                className="flex flex-col items-center justify-center py-2 px-1 transition-colors text-slate-400 hover:text-slate-600"
              >
                {content}
              </button>
            );
          }

          return (
            <a
              key={item.id}
              href={getPageUrl(item.id)}
              onClick={(e) => {
                if (isTestEnvironment()) {
                  e.preventDefault();
                  onNavigate(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                active ? 'text-[#5B4CE6]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {content}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
