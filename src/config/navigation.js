import {
  User,
  CalendarDays,
  Users,
  ClipboardCheck,
  QrCode,
  Award,
  History,
  BellRing,
  BookOpen,
  FileText,
  GraduationCap,
  Settings,
  Home,
  LayoutGrid,
  CheckSquare,
  BarChart3,
  Layers,
  BookMarked,
  ShieldCheck,
  Activity,
  FileCheck2,
} from 'lucide-react';

export const ROLE_META = {
  student: {
    portalTitle: 'Student Portal',
    roleLabel: 'Siswa',
    greetingSubtitle: 'Have a great day ahead!',
    pillClass: 'bg-indigo-100 text-indigo-700',
    primaryActionLabel: 'Scan QR',
    primaryActionPage: 'scan-qr',
  },
  teacher: {
    portalTitle: 'Teacher Portal',
    roleLabel: 'Guru',
    greetingSubtitle: 'Siap mengajar & kelola presensi kelas!',
    pillClass: 'bg-blue-100 text-blue-700',
    primaryActionLabel: 'Buka Sesi QR',
    primaryActionPage: 'attendance',
  },
  admin: {
    portalTitle: 'Admin Portal',
    roleLabel: 'Admin',
    greetingSubtitle: 'Pantau presensi & operasional sekolah.',
    pillClass: 'bg-purple-100 text-purple-700',
    primaryActionLabel: 'Monitor QR',
    primaryActionPage: 'qr-monitor',
  },
};

export const QUICK_ACCESS_BY_ROLE = {
  student: [
    { id: 'profile', label: 'Profile', desc: 'View & edit profile', icon: User, color: 'purple' },
    { id: 'schedule', label: 'Schedule', desc: 'Class timetable', icon: CalendarDays, color: 'peach' },
    { id: 'teachers', label: 'Teachers', desc: 'Faculty directory', icon: Users, color: 'blue' },
    { id: 'attendance', label: 'Attendance', desc: 'Check attendance', icon: ClipboardCheck, color: 'green' },
    { id: 'scan-qr', label: 'Scan QR', desc: 'Presensi cepat QR', icon: QrCode, color: 'indigo', priority: true, badge: 'SCAN' },
    { id: 'grades', label: 'Grades', desc: 'View your grades', icon: Award, color: 'yellow' },
    { id: 'attendance-history', label: 'Attendance History', desc: 'Riwayat hadir', icon: History, color: 'sky' },
    { id: 'notices', label: 'Notices', desc: 'Latest updates', icon: BellRing, color: 'teal', badge: 'NEW' },
    { id: 'library', label: 'Library', desc: 'Books & resources', icon: BookOpen, color: 'pink' },
    { id: 'assignments', label: 'Assignments', desc: 'Tasks & uploads', icon: FileText, color: 'rose' },
    { id: 'exams', label: 'Exams', desc: 'Schedule & results', icon: GraduationCap, color: 'lime' },
    { id: 'settings', label: 'Settings', desc: 'App preferences', icon: Settings, color: 'violet' },
  ],
  teacher: [
    { id: 'profile', label: 'Profile', desc: 'Profil & NIP guru', icon: User, color: 'purple' },
    { id: 'schedule', label: 'Teaching Schedule', desc: 'Jadwal mengajar', icon: CalendarDays, color: 'peach' },
    { id: 'attendance', label: 'QR Session', desc: 'Buka & kelola QR', icon: QrCode, color: 'indigo', priority: true, badge: 'LIVE' },
    { id: 'manual-attendance', label: 'Manual Check-in', desc: 'Input hadir siswa', icon: CheckSquare, color: 'green' },
    { id: 'students', label: 'Students', desc: 'Direktori siswa', icon: Users, color: 'pink' },
    { id: 'recap', label: 'Attendance Recap', desc: 'Rekap per kelas', icon: History, color: 'yellow' },
    { id: 'assignments', label: 'Assignments', desc: 'Kelola tugas', icon: FileText, color: 'sky' },
    { id: 'grades', label: 'Grading', desc: 'Input nilai siswa', icon: Award, color: 'teal' },
    { id: 'notices', label: 'Notices', desc: 'Info & pengumuman', icon: BellRing, color: 'violet', badge: 'NEW' },
    { id: 'leave-requests', label: 'Leave Requests', desc: 'Izin & sakit siswa', icon: FileCheck2, color: 'rose' },
    { id: 'reports', label: 'Reports', desc: 'Ekspor rekap kelas', icon: BarChart3, color: 'lime' },
    { id: 'settings', label: 'Settings', desc: 'Pengaturan akun', icon: Settings, color: 'blue' },
  ],
  admin: [
    { id: 'management', label: 'User Management', desc: 'Siswa, guru & akun', icon: Users, color: 'purple' },
    { id: 'classes', label: 'Classes & Majors', desc: 'Kelas & jurusan', icon: Layers, color: 'peach' },
    { id: 'subjects', label: 'Subjects', desc: 'Mapel & kurikulum', icon: BookMarked, color: 'blue' },
    { id: 'schedule', label: 'Schedules', desc: 'Kelola jadwal', icon: CalendarDays, color: 'green' },
    { id: 'qr-monitor', label: 'QR Monitor', desc: 'Pantau QR aktif', icon: QrCode, color: 'indigo', priority: true, badge: 'LIVE' },
    { id: 'attendance-audit', label: 'Attendance Audit', desc: 'Koreksi presensi', icon: ShieldCheck, color: 'yellow' },
    { id: 'leave-requests', label: 'Leave Requests', desc: 'Persetujuan izin', icon: FileCheck2, color: 'sky' },
    { id: 'notices', label: 'Notices', desc: 'Kelola pengumuman', icon: BellRing, color: 'teal', badge: 'NEW' },
    { id: 'reports', label: 'Reports & Export', desc: 'Laporan sekolah', icon: BarChart3, color: 'pink' },
    { id: 'activity-logs', label: 'Activity Logs', desc: 'Riwayat aktivitas', icon: Activity, color: 'rose' },
    { id: 'profile', label: 'Profile', desc: 'Profil admin', icon: User, color: 'lime' },
    { id: 'settings', label: 'Settings', desc: 'Konfigurasi sistem', icon: Settings, color: 'violet' },
  ],
};

export const BOTTOM_NAV_BY_ROLE = {
  student: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'attendance', label: 'Attendance', icon: QrCode },
    { id: 'more', label: 'More', icon: LayoutGrid },
  ],
  teacher: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'schedule', label: 'Schedule', icon: CalendarDays },
    { id: 'attendance', label: 'Attendance', icon: QrCode },
    { id: 'more', label: 'More', icon: LayoutGrid },
  ],
  admin: [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'management', label: 'Management', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'more', label: 'More', icon: LayoutGrid },
  ],
};

export const SIDEBAR_NAV_BY_ROLE = {
  student: [
    {
      section: 'Utama',
      items: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'scan-qr', label: 'Scan QR Code', icon: QrCode, badge: 'LIVE' },
        { id: 'schedule', label: 'Jadwal Pelajaran', icon: CalendarDays },
        { id: 'attendance', label: 'Presensi & Izin', icon: ClipboardCheck },
        { id: 'attendance-history', label: 'Riwayat Hadir', icon: History },
      ],
    },
    {
      section: 'Akademik',
      items: [
        { id: 'assignments', label: 'Tugas Sekolah', icon: FileText },
        { id: 'grades', label: 'Nilai & Rapor', icon: Award },
        { id: 'exams', label: 'Jadwal Ujian', icon: GraduationCap },
        { id: 'teachers', label: 'Direktori Guru', icon: Users },
        { id: 'library', label: 'Perpustakaan', icon: BookOpen },
        { id: 'notices', label: 'Pengumuman', icon: BellRing },
      ],
    },
    {
      section: 'Akun',
      items: [
        { id: 'profile', label: 'Profil Siswa', icon: User },
        { id: 'settings', label: 'Pengaturan', icon: Settings },
      ],
    },
  ],
  teacher: [
    {
      section: 'Utama',
      items: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'attendance', label: 'Sesi QR Presensi', icon: QrCode, badge: 'LIVE' },
        { id: 'schedule', label: 'Jadwal Mengajar', icon: CalendarDays },
        { id: 'manual-attendance', label: 'Input Presensi', icon: CheckSquare },
        { id: 'recap', label: 'Rekap Kehadiran', icon: History },
      ],
    },
    {
      section: 'Kelas & Akademik',
      items: [
        { id: 'students', label: 'Daftar Siswa', icon: Users },
        { id: 'assignments', label: 'Tugas Siswa', icon: FileText },
        { id: 'grades', label: 'Input Nilai', icon: Award },
        { id: 'leave-requests', label: 'Persetujuan Izin', icon: FileCheck2 },
        { id: 'notices', label: 'Pengumuman', icon: BellRing },
        { id: 'reports', label: 'Laporan Kelas', icon: BarChart3 },
      ],
    },
    {
      section: 'Akun',
      items: [
        { id: 'profile', label: 'Profil Guru', icon: User },
        { id: 'settings', label: 'Pengaturan', icon: Settings },
      ],
    },
  ],
  admin: [
    {
      section: 'Utama',
      items: [
        { id: 'home', label: 'Dashboard', icon: Home },
        { id: 'qr-monitor', label: 'Monitor QR Aktif', icon: QrCode, badge: 'LIVE' },
        { id: 'reports', label: 'Laporan Kehadiran', icon: BarChart3 },
      ],
    },
    {
      section: 'Manajemen Data',
      items: [
        { id: 'management', label: 'Kelola Pengguna', icon: Users },
        { id: 'classes', label: 'Kelas & Jurusan', icon: Layers },
        { id: 'subjects', label: 'Mata Pelajaran', icon: BookMarked },
        { id: 'schedule', label: 'Jadwal Pelajaran', icon: CalendarDays },
      ],
    },
    {
      section: 'Operasional',
      items: [
        { id: 'attendance-audit', label: 'Audit Presensi', icon: ShieldCheck },
        { id: 'leave-requests', label: 'Persetujuan Izin', icon: FileCheck2 },
        { id: 'notices', label: 'Pengumuman Sekolah', icon: BellRing },
        { id: 'activity-logs', label: 'Log Aktivitas', icon: Activity },
      ],
    },
    {
      section: 'Sistem',
      items: [
        { id: 'profile', label: 'Profil Admin', icon: User },
        { id: 'settings', label: 'Pengaturan', icon: Settings },
      ],
    },
  ],
};

export const PAGE_TITLES = {
  home: null, // Uses role portal title on Home
  profile: 'Profile',
  schedule: 'Schedule',
  teachers: 'Teachers Directory',
  attendance: 'Attendance',
  'scan-qr': 'Scan QR Code',
  grades: 'Grades & Report',
  'attendance-history': 'Attendance History',
  notices: 'Notices & Info',
  library: 'Digital Library',
  assignments: 'Assignments',
  exams: 'Exams Schedule',
  settings: 'Settings',
  'manual-attendance': 'Manual Check-in',
  students: 'Students List',
  recap: 'Attendance Recap',
  'leave-requests': 'Leave Requests',
  reports: 'Reports & Export',
  management: 'User Management',
  classes: 'Classes & Majors',
  subjects: 'Subjects',
  'qr-monitor': 'Live QR Monitor',
  'attendance-audit': 'Attendance Audit',
  'activity-logs': 'Activity Logs',
  more: 'All Menu',
};

