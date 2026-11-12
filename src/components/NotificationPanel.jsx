import { Bell, CheckCheck, X } from 'lucide-react';
import { getPageUrl, isTestEnvironment } from '../config/routes';

export default function NotificationPanel({
  open,
  onClose,
  notifications,
  onSelectNotification,
  onMarkAllRead,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start sm:justify-end p-0 sm:p-6">
      <div
        className="fixed inset-0 bg-slate-900/35 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full sm:w-96 bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[82vh] flex flex-col">
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-purple-50/70">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Notifikasi</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai dibaca</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup notifikasi"
              className="p-1 rounded-lg text-slate-400 hover:bg-white hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              Belum ada notifikasi baru.
            </div>
          ) : (
            notifications.map((n) => (
              <a
                key={n.id}
                href={getPageUrl(n.targetPage || 'home')}
                onClick={(e) => {
                  if (isTestEnvironment()) {
                    e.preventDefault();
                    onSelectNotification(n);
                    onClose();
                  }
                }}
                className={`w-full text-left p-4 hover:bg-slate-50 transition flex items-start gap-3 ${
                  n.unread ? 'bg-indigo-50/35' : ''
                }`}
              >
                <span
                  className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                    n.unread ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{n.message}</p>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
