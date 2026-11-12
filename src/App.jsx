import { useMemo, useState } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import MobileHeader from './components/MobileHeader';
import BottomNav from './components/BottomNav';
import DesktopSidebar from './components/DesktopSidebar';
import DesktopTopbar from './components/DesktopTopbar';
import MobileDrawer from './components/MobileDrawer';
import NotificationPanel from './components/NotificationPanel';
import MoreMenuModal from './components/MoreMenuModal';
import LoginPage from './pages/LoginPage';
import DashboardHome from './pages/DashboardHome';
import ScanQrPage from './pages/ScanQrPage';
import ProfilePage from './pages/ProfilePage';
import SchedulePage from './pages/SchedulePage';
import NoticesPage from './pages/NoticesPage';
import SettingsPage from './pages/SettingsPage';
import StudentAttendancePage from './pages/StudentAttendancePage';
import AttendanceHistoryPage from './pages/AttendanceHistoryPage';
import TeachersPage from './pages/TeachersPage';
import GradesPage from './pages/GradesPage';
import AssignmentsPage from './pages/AssignmentsPage';
import ExamsPage from './pages/ExamsPage';
import LibraryPage from './pages/LibraryPage';
import TeacherQrSessionPage from './pages/TeacherQrSessionPage';
import ManualAttendancePage from './pages/ManualAttendancePage';
import StudentsPage from './pages/StudentsPage';
import LeaveRequestsPage from './pages/LeaveRequestsPage';
import ReportsPage from './pages/ReportsPage';
import AdminManagementPage from './pages/AdminManagementPage';
import AdminAcademicsPage from './pages/AdminAcademicsPage';
import AdminAuditPage from './pages/AdminAuditPage';
import ActivityLogsPage from './pages/ActivityLogsPage';

function AppShell() {
  const {
    state,
    currentUser,
    activePage,
    searchQuery,
    setSearchQuery,
    toast,
    navigate,
    loginAsRole,
    logout,
    markAllNotificationsRead,
  } = useApp();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const roleNotifications = useMemo(() => {
    if (!currentUser) return [];
    return state.notifications.filter((n) => n.roles.includes(currentUser.role));
  }, [state.notifications, currentUser]);

  const unreadCount = roleNotifications.filter((n) => n.unread).length;

  if (!currentUser || activePage === 'login') {
    return (
      <>
        <LoginPage />
        {toast && <ToastBanner toast={toast} />}
      </>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <DashboardHome onOpenMore={() => setMoreOpen(true)} />;
      case 'scan-qr':
        return <ScanQrPage />;
      case 'profile':
        return <ProfilePage />;
      case 'schedule':
        return <SchedulePage />;
      case 'notices':
        return <NoticesPage />;
      case 'settings':
        return <SettingsPage />;
      case 'attendance':
        return currentUser.role === 'student' ? (
          <StudentAttendancePage />
        ) : (
          <TeacherQrSessionPage isAdminMonitor={currentUser.role === 'admin'} />
        );
      case 'attendance-history':
        return <AttendanceHistoryPage />;
      case 'recap':
        return <AttendanceHistoryPage isTeacherRecap />;
      case 'teachers':
        return <TeachersPage />;
      case 'grades':
        return <GradesPage />;
      case 'assignments':
        return <AssignmentsPage />;
      case 'exams':
        return <ExamsPage />;
      case 'library':
        return <LibraryPage />;
      case 'manual-attendance':
        return <ManualAttendancePage />;
      case 'students':
        return <StudentsPage />;
      case 'leave-requests':
        return <LeaveRequestsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'management':
        return <AdminManagementPage />;
      case 'classes':
        return <AdminAcademicsPage key="classes" initialTab="classes" />;
      case 'subjects':
        return <AdminAcademicsPage key="subjects" initialTab="subjects" />;
      case 'qr-monitor':
        return <TeacherQrSessionPage isAdminMonitor />;
      case 'attendance-audit':
        return <AdminAuditPage />;
      case 'activity-logs':
        return <ActivityLogsPage />;
      default:
        return <DashboardHome onOpenMore={() => setMoreOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900 overflow-x-hidden">
      {/* Desktop Fixed Sidebar */}
      <DesktopSidebar
        user={currentUser}
        activePage={activePage}
        onNavigate={navigate}
        onSwitchRole={loginAsRole}
        onLogout={logout}
      />

      {/* Main Responsive Content Column */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile & Tablet Gradient Header */}
        <MobileHeader
          user={currentUser}
          activePage={activePage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadCount={unreadCount}
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenNotifications={() => setNotifOpen(true)}
          onNavigate={navigate}
        />

        {/* Desktop Sticky Topbar */}
        <DesktopTopbar
          user={currentUser}
          activePage={activePage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          unreadCount={unreadCount}
          onOpenNotifications={() => setNotifOpen(true)}
          onNavigate={navigate}
        />

        {/* Main Workspace Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6 pb-24 lg:pb-10">
          {renderPage()}
        </main>
      </div>

      {/* Fixed Bottom Navigation for Mobile & Tablet */}
      <BottomNav
        role={currentUser.role}
        activePage={activePage}
        onNavigate={navigate}
        onOpenMore={() => setMoreOpen(true)}
      />

      {/* Mobile & Tablet Navigation Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={currentUser}
        activePage={activePage}
        onNavigate={navigate}
        onSwitchRole={loginAsRole}
        onLogout={logout}
      />

      {/* Notification Panel */}
      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={roleNotifications}
        onSelectNotification={(n) => {
          if (n.targetPage) navigate(n.targetPage);
        }}
        onMarkAllRead={markAllNotificationsRead}
      />

      {/* More Menu Bottom Sheet */}
      <MoreMenuModal
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        role={currentUser.role}
        onNavigate={navigate}
        onSwitchRole={loginAsRole}
        onLogout={logout}
      />

      {toast && <ToastBanner toast={toast} />}
    </div>
  );
}

function ToastBanner({ toast }) {
  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:max-w-sm z-50 pointer-events-none flex justify-end">
      <div
        className={`pointer-events-auto flex items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-bold shadow-xl border ${
          toast.type === 'info'
            ? 'bg-slate-900 text-white border-slate-800'
            : 'bg-emerald-600 text-white border-emerald-500'
        }`}
      >
        {toast.type === 'info' ? (
          <Info className="w-4 h-4 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 shrink-0" />
        )}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

