import { LogOut, QrCode, X } from 'lucide-react';
import { ROLE_META, SIDEBAR_NAV_BY_ROLE } from '../config/navigation';
import { getPageUrl, isTestEnvironment } from '../config/routes';
import UserAvatar from './UserAvatar';

export default function MobileDrawer({
  open,
  onClose,
  user,
  activePage,
  onNavigate,
  onSwitchRole,
  onLogout,
}) {
  if (!open) return null;

  const role = user?.role || 'student';
  const roleMeta = ROLE_META[role] || ROLE_META.student;
  const sections = SIDEBAR_NAV_BY_ROLE[role] || SIDEBAR_NAV_BY_ROLE.student;

  const handleLink = (e, id) => {
    if (isTestEnvironment()) {
      e.preventDefault();
      onNavigate(id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 w-[82%] max-w-[310px] bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Gradient User Header */}
        <div className="bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-extrabold tracking-tight">SMK Attend</p>
                <p className="text-[11px] text-white/80">{roleMeta.portalTitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu"
              className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <UserAvatar user={user} size="md" className="ring-2 ring-white/40" />
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-[11px] text-white/80 truncate">
                {user?.identifierLabel}: {user?.identifier} • {user?.className}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {sections.map((group) => (
            <div key={group.section}>
              <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.section}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.id;
                  return (
                    <a
                      key={item.id}
                      href={getPageUrl(item.id)}
                      onClick={(e) => handleLink(e, item.id)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition ${
                        active
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`}
                        />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-600 text-white">
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

        {/* Quick Portal Switcher & Logout */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 space-y-2.5">
          <div>
            <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Beralih Portal (Demo)
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'student', label: 'Siswa' },
                { id: 'teacher', label: 'Guru' },
                { id: 'admin', label: 'Admin' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    onSwitchRole(r.id);
                    onClose();
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold transition ${
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

          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar / Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
