import { useMemo } from 'react';
import {
  CheckCircle2,
  ClipboardCheck,
  FileText,
  QrCode,
  ShieldCheck,
  Users,
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QUICK_ACCESS_BY_ROLE, ROLE_META } from '../config/navigation';
import { getPageUrl, isTestEnvironment } from '../config/routes';
import QuickAccessCard from '../components/QuickAccessCard';
import UpcomingActivitiesCard from '../components/UpcomingActivitiesCard';
import StatCard from '../components/StatCard';
import AttendanceChart from '../components/AttendanceChart';
import QrCodeGraphic from '../components/QrCodeGraphic';

export default function DashboardHome({ onOpenMore }) {
  const { state, currentUser, searchQuery, navigate } = useApp();
  const role = currentUser?.role || 'student';
  const roleMeta = ROLE_META[role] || ROLE_META.student;

  const quickAccessItems = useMemo(() => {
    const base = QUICK_ACCESS_BY_ROLE[role] || QUICK_ACCESS_BY_ROLE.student;
    if (!searchQuery.trim()) return base;
    const q = searchQuery.trim().toLowerCase();
    return base.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }, [role, searchQuery]);

  // Build upcoming activities combining active QR sessions, next classes, and notices
  const upcomingActivities = useMemo(() => {
    const activeQrs = state.qrSessions
      .filter((s) => s.active)
      .filter((s) =>
        role === 'student'
          ? s.className === currentUser?.className
          : role === 'teacher'
          ? s.teacherId === currentUser?.id
          : true
      )
      .slice(0, 2)
      .map((s) => ({
        id: s.id,
        isQr: true,
        title: `QR Aktif: ${s.subject}`,
        time: `${s.startTime} - ${s.endTime}`,
        location: `${s.room} • ${s.className} • ${s.teacherName}`,
        status: 'Active',
        targetPage: role === 'student' ? 'scan-qr' : role === 'teacher' ? 'attendance' : 'qr-monitor',
      }));

    const scheduleItems = state.schedules
      .filter((sch) =>
        role === 'student'
          ? sch.className === currentUser?.className
          : role === 'teacher'
          ? sch.teacherId === currentUser?.id
          : true
      )
      .slice(0, 2)
      .map((sch) => ({
        id: sch.id,
        monthShort: 'NOV',
        dayNum: '12',
        dayName: sch.day.slice(0, 3),
        title: `${sch.subject} (${sch.className})`,
        time: `${sch.start} - ${sch.end} WIB`,
        location: `${sch.room} • ${sch.teacher}`,
        status: 'Upcoming',
        targetPage: 'schedule',
      }));

    const noticeItems = state.notices.slice(0, 2).map((n) => ({
      id: n.id,
      monthShort: n.monthShort || 'NOV',
      dayNum: n.dayNum || '14',
      dayName: n.dayName || 'Sab',
      title: n.title,
      time: n.time,
      location: n.location,
      status: n.category === 'Kegiatan' ? 'Event' : 'Notice',
      targetPage: 'notices',
    }));

    const combined = [...activeQrs, ...scheduleItems, ...noticeItems].slice(0, 4);

    if (!searchQuery.trim()) return combined;
    const q = searchQuery.trim().toLowerCase();
    return combined.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.status.toLowerCase().includes(q)
    );
  }, [state.qrSessions, state.schedules, state.notices, role, currentUser, searchQuery]);

  // Role-specific KPI stats for Tablet & Desktop views
  const studentAttendanceCount = state.attendanceRecords.filter(
    (r) => r.studentId === currentUser?.id && r.status === 'Hadir'
  ).length;
  const studentTotalRecords = state.attendanceRecords.filter(
    (r) => r.studentId === currentUser?.id
  ).length || 1;
  const studentRate = Math.round((studentAttendanceCount / studentTotalRecords) * 100);
  const pendingAssignments = state.assignments.filter(
    (a) => a.status === 'Belum Dikumpulkan'
  ).length;
  const activeQrCount = state.qrSessions.filter((s) => s.active).length;
  const pendingLeaves = state.leaveRequests.filter((l) => l.status === 'Menunggu').length;
  const totalStudents = state.users.filter((u) => u.role === 'student').length;
  const totalTeachers = state.users.filter((u) => u.role === 'teacher').length;

  const primaryActiveSession = state.qrSessions.find((s) => s.active);

  const kpiCards = useMemo(() => {
    if (role === 'student') {
      return [
        {
          label: 'Tingkat Kehadiran',
          value: `${studentRate}%`,
          sublabel: `${studentAttendanceCount} dari ${studentTotalRecords} sesi hadir`,
          icon: CheckCircle2,
          color: 'green',
          targetPage: 'attendance-history',
          onClick: () => navigate('attendance-history'),
        },
        {
          label: 'Sesi QR Aktif',
          value: `${activeQrCount} Sesi`,
          sublabel: 'Siap di-scan sekarang',
          icon: QrCode,
          color: 'indigo',
          targetPage: 'scan-qr',
          onClick: () => navigate('scan-qr'),
        },
        {
          label: 'Tugas Aktif',
          value: `${pendingAssignments} Tugas`,
          sublabel: 'Menunggu pengumpulan',
          icon: FileText,
          color: 'peach',
          targetPage: 'assignments',
          onClick: () => navigate('assignments'),
        },
        {
          label: 'Rata-rata Nilai',
          value: '88.8',
          sublabel: 'Predikat A • Semester Ganjil',
          icon: BookOpen,
          color: 'purple',
          targetPage: 'grades',
          onClick: () => navigate('grades'),
        },
      ];
    }

    if (role === 'teacher') {
      return [
        {
          label: 'Sesi QR Mengajar',
          value: `${activeQrCount} Aktif`,
          sublabel: 'Lab RPL 1 & Lab RPL 2',
          icon: QrCode,
          color: 'indigo',
          targetPage: 'attendance',
          onClick: () => navigate('attendance'),
        },
        {
          label: 'Kehadiran Kelas',
          value: '95%',
          sublabel: 'XI RPL 1 hari ini',
          icon: ClipboardCheck,
          color: 'green',
          targetPage: 'recap',
          onClick: () => navigate('recap'),
        },
        {
          label: 'Siswa Diampu',
          value: `${totalStudents} Siswa`,
          sublabel: 'RPL & TKJ Aktif',
          icon: Users,
          color: 'blue',
          targetPage: 'students',
          onClick: () => navigate('students'),
        },
        {
          label: 'Izin Menunggu',
          value: `${pendingLeaves} Berkas`,
          sublabel: 'Perlu konfirmasi wali kelas',
          icon: Clock,
          color: 'peach',
          targetPage: 'leave-requests',
          onClick: () => navigate('leave-requests'),
        },
      ];
    }

    return [
      {
        label: 'Kehadiran Sekolah',
        value: '94.8%',
        sublabel: 'Hari ini • Semua jurusan',
        icon: ShieldCheck,
        color: 'green',
        targetPage: 'reports',
        onClick: () => navigate('reports'),
      },
      {
        label: 'Total Siswa & Guru',
        value: `${totalStudents + totalTeachers}`,
        sublabel: `${totalStudents} Siswa • ${totalTeachers} Guru`,
        icon: Users,
        color: 'purple',
        targetPage: 'management',
        onClick: () => navigate('management'),
      },
      {
        label: 'Sesi QR Berlangsung',
        value: `${activeQrCount} Sesi`,
        sublabel: 'Monitor real-time kelas',
        icon: QrCode,
        color: 'indigo',
        targetPage: 'qr-monitor',
        onClick: () => navigate('qr-monitor'),
      },
      {
        label: 'Persetujuan Izin',
        value: `${pendingLeaves} Pending`,
        sublabel: 'Menunggu review admin',
        icon: ClipboardCheck,
        color: 'peach',
        targetPage: 'leave-requests',
        onClick: () => navigate('leave-requests'),
      },
    ];
  }, [
    role,
    studentRate,
    studentAttendanceCount,
    studentTotalRecords,
    activeQrCount,
    pendingAssignments,
    totalStudents,
    totalTeachers,
    pendingLeaves,
    navigate,
  ]);

  return (
    <div className="space-y-6">
      {/* DESKTOP WELCOME BANNER + STATS (Adaptive Desktop Layout, hidden on <640px mobile so mobile matches reference directly) */}
      <section className="hidden lg:block rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white p-6 shadow-lg shadow-indigo-500/15 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[11px] font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{state.schoolSettings.academicYear}</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Hello, {currentUser?.firstName} 👋
            </h2>
            <p className="text-sm text-white/85 max-w-xl">
              {roleMeta.greetingSubtitle} • {currentUser?.className} ({currentUser?.major})
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={getPageUrl(roleMeta.primaryActionPage)}
              onClick={(e) => {
                if (isTestEnvironment()) {
                  e.preventDefault();
                  navigate(roleMeta.primaryActionPage);
                }
              }}
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-indigo-700 px-5 py-3 text-sm font-extrabold shadow-md hover:bg-indigo-50 active:scale-95 transition"
            >
              <QrCode className="w-5 h-5" />
              <span>{roleMeta.primaryActionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* TABLET & DESKTOP STAT CARDS ROW */}
      <section className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </section>

      {/* MAIN CONTENT GRID: Mobile vertical flow matching reference; Desktop 12-col split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN (Mobile full width, Desktop 8 cols): Quick Access + Attendance Chart */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Access Section (Matches Reference: Header + 3-col Pastel Grid on mobile, 4-col on desktop) */}
          <section>
            <div className="flex items-center justify-between mb-3 px-0.5">
              <h2 className="text-[15px] sm:text-base font-bold text-slate-900">Quick Access</h2>
              <button
                type="button"
                onClick={() => {
                  if (window.innerWidth < 1024 && onOpenMore) {
                    onOpenMore();
                  } else {
                    navigate(roleMeta.primaryActionPage);
                  }
                }}
                className="text-xs sm:text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                View All
              </button>
            </div>

            {quickAccessItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-sm text-slate-500">
                Tidak ada menu yang cocok dengan &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
                {quickAccessItems.map((item) => (
                  <QuickAccessCard key={item.id} item={item} onClick={navigate} />
                ))}
              </div>
            )}
          </section>

          {/* Attendance Analytics Chart (Visible cleanly on Tablet & Desktop; on Mobile visible under Upcoming Activities or concise card so Quick Access + Upcoming Activities mirror reference first!) */}
          <div className="hidden sm:block">
            <AttendanceChart />
          </div>
        </div>

        {/* RIGHT COLUMN (Mobile full width right below Quick Access, Desktop 4 cols): Upcoming Activities + Live QR Widget */}
        <div className="lg:col-span-4 space-y-6">
          <UpcomingActivitiesCard
            activities={upcomingActivities}
            title="Upcoming Activities"
            viewAllLabel="View Schedule"
            footerLabel="View All Activities"
            onViewAll={() => navigate('schedule')}
            onSelectActivity={(act) => navigate(act.targetPage || 'schedule')}
          />

          {/* Compact Live QR Highlight Card on Desktop Sidebar Column */}
          {primaryActiveSession && (
            <div className="hidden lg:block bg-white rounded-2xl border border-indigo-100 p-4 shadow-[0_2px_14px_rgba(79,70,229,0.08)]">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-900">Sesi QR Berlangsung</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  {primaryActiveSession.className}
                </span>
              </div>

              <div className="flex items-center gap-3.5 bg-slate-50 rounded-xl p-3">
                <QrCodeGraphic value={primaryActiveSession.code} size={76} className="p-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 line-clamp-2">
                    {primaryActiveSession.subject}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {primaryActiveSession.room} • {primaryActiveSession.attendeeIds.length} hadir
                  </p>
                  <p className="text-[11px] font-mono font-bold text-indigo-600 mt-1">
                    {primaryActiveSession.code}
                  </p>
                </div>
              </div>

              <a
                href={getPageUrl(roleMeta.primaryActionPage)}
                onClick={(e) => {
                  if (isTestEnvironment()) {
                    e.preventDefault();
                    navigate(roleMeta.primaryActionPage);
                  }
                }}
                className="block mt-3 w-full text-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 transition"
              >
                {role === 'student'
                  ? 'Buka Pemindai QR'
                  : role === 'teacher'
                  ? 'Kelola Sesi QR'
                  : 'Pantau Seluruh QR'}
              </a>
            </div>
          )}

          {/* On mobile, show Attendance Summary Chart below Upcoming Activities so nothing crowds the top reference fold */}
          <div className="sm:hidden">
            <AttendanceChart
              title="Grafik Kehadiran"
              subtitle="Performa kehadiran minggu ini"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

