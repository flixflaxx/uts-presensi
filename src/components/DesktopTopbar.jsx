import { Bell, ChevronRight, QrCode, Search, X } from 'lucide-react';
import { PAGE_TITLES, ROLE_META } from '../config/navigation';
import { getPageUrl, isTestEnvironment } from '../config/routes';
import UserAvatar from './UserAvatar';

export default function DesktopTopbar({
  user,
  activePage,
  searchQuery,
  onSearchChange,
  unreadCount,
  onOpenNotifications,
  onNavigate,
}) {
  const roleMeta = ROLE_META[user?.role] || ROLE_META.student;
  const pageTitle = activePage === 'home' ? 'Dashboard Overview' : PAGE_TITLES[activePage] || 'Dashboard';

  const linkClick = (e, id) => {
    if (isTestEnvironment()) {
      e.preventDefault();
      onNavigate(id);
    }
  };

  return (
    <header className="hidden lg:flex sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b border-slate-200/75 px-6 h-16 items-center justify-between gap-4">
      {/* Left: Breadcrumb & Page Title */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span>SMK Attend</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <a
            href={getPageUrl('home')}
            onClick={(e) => linkClick(e, 'home')}
            className="text-indigo-600 font-semibold hover:underline"
          >
            {roleMeta.portalTitle}
          </a>
          {activePage !== 'home' && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-700 font-semibold truncate">{pageTitle}</span>
            </>
          )}
        </div>
        <h1 className="text-base font-bold text-slate-900 truncate">{pageTitle}</h1>
      </div>

      {/* Middle: Search Input */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-slate-100/80 hover:bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/30 border border-slate-200/70 rounded-full px-4 py-2 transition">
          <Search className="w-4 h-4 text-indigo-600 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari menu, mapel, siswa, atau pengumuman..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick Action CTA, Notification, Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href={getPageUrl(roleMeta.primaryActionPage)}
          onClick={(e) => linkClick(e, roleMeta.primaryActionPage)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:shadow-lg hover:brightness-105 active:scale-95 transition"
        >
          <QrCode className="w-4 h-4" />
          <span>{roleMeta.primaryActionLabel}</span>
        </a>

        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="Notifikasi"
          className="relative w-10 h-10 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition"
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        <a
          href={getPageUrl('profile')}
          onClick={(e) => linkClick(e, 'profile')}
          className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-slate-100 transition"
        >
          <UserAvatar user={user} size="sm" />
          <div className="text-left leading-tight">
            <p className="text-xs font-bold text-slate-800">{user?.name}</p>
            <p className="text-[10px] text-slate-500">{roleMeta.roleLabel}</p>
          </div>
        </a>
      </div>
    </header>
  );
}
