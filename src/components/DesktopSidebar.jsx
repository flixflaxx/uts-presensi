import { LogOut, QrCode, RefreshCw } from 'lucide-react';
import { ROLE_META, SIDEBAR_NAV_BY_ROLE } from '../config/navigation';
import { getPageUrl, isTestEnvironment } from '../config/routes';
import UserAvatar from './UserAvatar';

export default function DesktopSidebar({
  user,
  activePage,
  onNavigate,
  onSwitchRole,
  onLogout,
}) {
  const role = user?.role || 'student';
  const roleMeta = ROLE_META[role] || ROLE_META.student;
  const sections = SIDEBAR_NAV_BY_ROLE[role] || SIDEBAR_NAV_BY_ROLE.student;

  const linkClick = (e, id) => {
    if (isTestEnvironment()) {
      e.preventDefault();
      onNavigate(id);
    }
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-slate-200/80 z-30">
      {/* Brand Header */}
      <a
        href={getPageUrl('home')}
        onClick={(e) => linkClick(e, 'home')}
        className="block px-5 pt-5 pb-4 border-b border-slate-100 hover:bg-slate-50/60 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <QrCode className="w-5 h-5" strokeWidth={2.3} />
          </div>
          <div className="min-w-0">
            <div className="text-base font-extrabold tracking-tight text-slate-900">
              SMK Attend
            </div>
            <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${roleMeta.pillClass}`}>
              {roleMeta.portalTitle}
            </span>
          </div>
        </div>
      </a>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {sections.map((group) => (
          <div key={group.section}>
            <p className="px-3 mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
              {group.section}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.id;
                return (
                  <a
                    key={item.id}
                    href={getPageUrl(item.id)}
                    onClick={(e) => linkClick(e, item.id)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-indigo-500/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`}
                        strokeWidth={active ? 2.3 : 2}
                      />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold ${
                          active ? 'bg-white/25 text-white' : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Portal Role Switcher (Demo convenience) */}
      <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
          <span className="inline-flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Portal Mode
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'student', label: 'Siswa' },
            { id: 'teacher', label: 'Guru' },
            { id: 'admin', label: 'Admin' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onSwitchRole(r.id)}
              className={`py-1 rounded-lg text-[11px] font-bold transition ${
                role === r.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom User Profile & Logout */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
          <a
            href={getPageUrl('profile')}
            onClick={(e) => linkClick(e, 'profile')}
            className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
          >
            <UserAvatar user={user} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[10.5px] text-slate-500 truncate">{user?.className}</p>
            </div>
          </a>
          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            aria-label="Keluar dari portal"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
