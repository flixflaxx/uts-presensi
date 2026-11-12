import { Menu, Bell, Search, X, ArrowLeft } from 'lucide-react';
import UserAvatar from './UserAvatar';
import { PAGE_TITLES, ROLE_META } from '../config/navigation';
import { getPageUrl, isTestEnvironment } from '../config/routes';

export default function MobileHeader({
  user,
  activePage,
  searchQuery,
  onSearchChange,
  unreadCount,
  onOpenDrawer,
  onOpenNotifications,
  onNavigate,
}) {
  const roleMeta = ROLE_META[user?.role] || ROLE_META.student;
  const isHome = activePage === 'home';
  const topTitle = isHome ? roleMeta.portalTitle : PAGE_TITLES[activePage] || roleMeta.portalTitle;

  const linkClick = (e, id) => {
    if (isTestEnvironment()) {
      e.preventDefault();
      onNavigate(id);
    }
  };

  return (
    <header className="lg:hidden relative bg-gradient-to-br from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white overflow-hidden">
      {/* Subtle decorative glow circles matching reference depth */}
      <div className="pointer-events-none absolute -top-12 -right-10 w-44 h-44 rounded-full bg-white/10 blur-xl" />
      <div className="pointer-events-none absolute top-14 -left-12 w-36 h-36 rounded-full bg-sky-300/15 blur-2xl" />

      <div className="relative z-10 px-4 pt-3 pb-4">
        {/* Top Bar: Hamburger + Title on left, Bell + Avatar on right */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {isHome ? (
              <button
                type="button"
                onClick={onOpenDrawer}
                aria-label="Buka menu navigasi"
                className="w-10 h-10 -ml-1.5 rounded-xl flex items-center justify-center hover:bg-white/15 active:scale-95 transition"
              >
                <Menu className="w-6 h-6 text-white" strokeWidth={2.2} />
              </button>
            ) : (
              <div className="flex items-center gap-1 -ml-1.5">
                <a
                  href={getPageUrl('home')}
                  onClick={(e) => linkClick(e, 'home')}
                  aria-label="Kembali ke beranda"
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/15 active:scale-95 transition"
                >
                  <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.2} />
                </a>
                <button
                  type="button"
                  onClick={onOpenDrawer}
                  aria-label="Buka menu navigasi"
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/15 active:scale-95 transition"
                >
                  <Menu className="w-5 h-5 text-white" strokeWidth={2.2} />
                </button>
              </div>
            )}

            <h1 className="text-[19px] sm:text-xl font-bold tracking-tight truncate">
              {topTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenNotifications}
              aria-label="Buka notifikasi"
              className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/15 active:scale-95 transition"
            >
              <Bell className="w-5 h-5 text-white" strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[9.5px] font-extrabold flex items-center justify-center shadow-sm ring-2 ring-[#4F46E5]">
                  {unreadCount}
                </span>
              )}
            </button>

            <a
              href={getPageUrl('profile')}
              onClick={(e) => linkClick(e, 'profile')}
              aria-label="Profil pengguna"
              className="rounded-full ring-2 ring-white/45 hover:ring-white transition active:scale-95"
            >
              <UserAvatar user={user} size="md" />
            </a>
          </div>
        </div>

        {/* Personal Greeting (matches "Hello, Alex 👋" + subtitle on Home) */}
        {isHome ? (
          <div className="mt-2.5 pl-1">
            <p className="text-[16px] sm:text-lg font-bold tracking-tight flex items-center gap-1.5">
              <span>Hello, {user?.firstName || 'User'}</span>
              <span role="img" aria-label="wave">
                👋
              </span>
            </p>
            <p className="text-xs sm:text-[13px] text-white/85 mt-0.5 font-medium">
              {roleMeta.greetingSubtitle}
            </p>
          </div>
        ) : (
          <div className="mt-2.5 pl-1 flex items-center justify-between gap-2 text-xs text-white/85">
            <span className="truncate font-medium">
              {user?.name} • {user?.className}
            </span>
            <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold">
              {roleMeta.portalTitle}
            </span>
          </div>
        )}

        {/* White Rounded Search Bar at bottom of header */}
        <div className="mt-3">
          <div className="flex items-center gap-2.5 bg-white rounded-full px-4 py-2 shadow-[0_8px_24px_rgba(30,27,75,0.16)]">
            <Search className="w-[18px] h-[18px] text-indigo-600 shrink-0" strokeWidth={2.2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search anything..."
              aria-label="Cari fitur, jadwal, atau pengumuman"
              className="w-full bg-transparent text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Hapus pencarian"
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Curved decorative bottom contour matching reference screenshot */}
      <svg
        viewBox="0 0 1440 44"
        preserveAspectRatio="none"
        className="block w-full h-5 sm:h-6 -mb-px text-[#F5F7FB]"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0,6 C340,42 1100,42 1440,6 L1440,44 L0,44 Z"
        />
      </svg>
    </header>
  );
}
