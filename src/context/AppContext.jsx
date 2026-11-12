import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getPageFromPathname, getPageUrl, isTestEnvironment } from '../config/routes';
import {
  INITIAL_ACTIVITY_LOGS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_CLASSES,
  INITIAL_EXAMS,
  INITIAL_GRADES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_LIBRARY_BOOKS,
  INITIAL_NOTICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_QR_SESSIONS,
  INITIAL_SCHEDULES,
  INITIAL_SUBJECTS,
  INITIAL_USERS,
} from '../data/seedData';

const STORAGE_KEY = 'smk_attend_state_v1';
const FLASH_TOAST_KEY = 'smk_attend_flash_toast';

const DEFAULT_SCHOOL_SETTINGS = {
  schoolName: 'SMKN 1 Nusantara',
  academicYear: '2026/2027 • Semester Ganjil',
  checkInStart: '07:00',
  lateToleranceMinutes: 15,
  qrValidityMinutes: 45,
  enableNotifications: true,
  enableSoundFeedback: true,
};

function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && Array.isArray(parsed.users)) {
        return parsed;
      }
    }
  } catch {
    // Ignore malformed localStorage
  }

  return {
    currentUserId: null,
    users: INITIAL_USERS,
    classes: INITIAL_CLASSES,
    subjects: INITIAL_SUBJECTS,
    schedules: INITIAL_SCHEDULES,
    qrSessions: INITIAL_QR_SESSIONS,
    attendanceRecords: INITIAL_ATTENDANCE_RECORDS,
    leaveRequests: INITIAL_LEAVE_REQUESTS,
    grades: INITIAL_GRADES,
    assignments: INITIAL_ASSIGNMENTS,
    exams: INITIAL_EXAMS,
    libraryBooks: INITIAL_LIBRARY_BOOKS,
    notices: INITIAL_NOTICES,
    notifications: INITIAL_NOTIFICATIONS,
    activityLogs: INITIAL_ACTIVITY_LOGS,
    schoolSettings: DEFAULT_SCHOOL_SETTINGS,
  };
}

const AppContext = createContext(null);

function readFlashToast() {
  try {
    const raw = sessionStorage.getItem(FLASH_TOAST_KEY);
    if (raw) {
      sessionStorage.removeItem(FLASH_TOAST_KEY);
      return JSON.parse(raw);
    }
  } catch {
    // Ignore storage error
  }
  return null;
}

export function AppProvider({ children }) {
  const [state, setState] = useState(getInitialState);
  const [activePage, setActivePage] = useState(() =>
    getPageFromPathname(typeof window !== 'undefined' ? window.location.pathname : '/')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(readFlashToast);

  useEffect(() => {
    const onPopState = () => {
      setActivePage(getPageFromPathname(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast((prev) => (prev?.id === toast.id ? null : prev));
    }, 3600);
    return () => clearTimeout(timer);
  }, [toast]);

  const persistStateNow = (nextState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch {
      // Ignore quota errors
    }
  };

  const showToast = (message, type = 'success', flashForNextPage = false) => {
    const id = Date.now();
    const payload = { id, message, type };
    if (flashForNextPage && !isTestEnvironment()) {
      try {
        sessionStorage.setItem(FLASH_TOAST_KEY, JSON.stringify(payload));
      } catch {
        // Ignore
      }
    }
    setToast(payload);
  };

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) || null,
    [state.users, state.currentUserId]
  );

  const navigate = (page) => {
    if (!isTestEnvironment()) {
      window.location.assign(getPageUrl(page));
      return;
    }
    setActivePage(page);
    if (typeof window !== 'undefined' && window.history?.pushState) {
      window.history.pushState({ page }, '', getPageUrl(page));
    }
  };

  const handleLinkClick = (e, page) => {
    if (isTestEnvironment()) {
      e.preventDefault();
      navigate(page);
    }
  };

  const loginAsRole = (role) => {
    const target =
      state.users.find((u) => u.role === role && u.status === 'active') ||
      state.users.find((u) => u.role === role);
    if (!target) return;
    const nextState = { ...state, currentUserId: target.id };
    persistStateNow(nextState);
    setState(nextState);
    setSearchQuery('');
    showToast(`Selamat datang, ${target.firstName}!`, 'success', true);
    navigate('home');
  };

  const loginWithCredentials = (identifier, password) => {
    const normalized = identifier.trim().toLowerCase();
    if (!normalized || !password.trim()) {
      return { ok: false, error: 'Email / NIS / NIP dan kata sandi wajib diisi.' };
    }
    const found = state.users.find(
      (u) =>
        u.email.toLowerCase() === normalized ||
        u.identifier.toLowerCase() === normalized ||
        u.firstName.toLowerCase() === normalized
    );
    if (!found) {
      return { ok: false, error: 'Akun tidak ditemukan. Gunakan tombol demo atau email/NIS terdaftar.' };
    }
    if (found.status !== 'active') {
      return { ok: false, error: 'Akun dinonaktifkan oleh admin sekolah.' };
    }
    const nextState = { ...state, currentUserId: found.id };
    persistStateNow(nextState);
    setState(nextState);
    setSearchQuery('');
    showToast(`Berhasil masuk sebagai ${found.name}`, 'success', true);
    navigate('home');
    return { ok: true };
  };

  const logout = () => {
    const nextState = { ...state, currentUserId: null };
    persistStateNow(nextState);
    setState(nextState);
    setSearchQuery('');
    showToast('Anda telah keluar dari portal.', 'info', true);
    navigate('login');
  };

  const updateProfile = (updates) => {
    if (!currentUser) return;
    const cleanName = (updates.name ?? currentUser.name).trim();
    const firstName = cleanName.split(/\s+/)[0] || currentUser.firstName;
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === currentUser.id ? { ...u, ...updates, name: cleanName, firstName } : u
      ),
    }));
    showToast('Profil berhasil diperbarui.');
  };

  const scanQrCode = (rawCode) => {
    if (!currentUser) return { ok: false, message: 'Silakan login terlebih dahulu.' };
    const code = rawCode.trim().toUpperCase();
    if (!code) return { ok: false, message: 'Kode QR tidak boleh kosong.' };

    const session = state.qrSessions.find((s) => s.code.toUpperCase() === code);
    if (!session) {
      return { ok: false, message: `Kode QR "${code}" tidak valid atau tidak ditemukan.` };
    }
    if (!session.active) {
      return { ok: false, message: `Sesi presensi ${session.subject} sudah ditutup oleh guru.` };
    }
    if (session.expiresAt && Date.now() > session.expiresAt) {
      return { ok: false, message: 'QR Code telah kedaluwarsa. Minta guru memuat ulang kode QR.' };
    }
    if (session.attendeeIds.includes(currentUser.id)) {
      return { ok: true, already: true, session, message: `Presensi kamu pada ${session.subject} sudah tercatat sebelumnya.` };
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const dateStr = now.toISOString().slice(0, 10);

    const newRecord = {
      id: `att-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      className: currentUser.className,
      date: dateStr,
      time: timeStr,
      subject: session.subject,
      status: 'Hadir',
      method: 'QR Scan',
      note: `Scan QR di ${session.room}`,
    };

    const newLog = {
      id: `log-${Date.now()}`,
      actor: currentUser.name,
      role: 'Siswa',
      action: `Presensi QR berhasil pada ${session.subject} (${session.className})`,
      time: timeStr,
      status: 'Sukses',
    };

    setState((prev) => ({
      ...prev,
      qrSessions: prev.qrSessions.map((s) =>
        s.id === session.id ? { ...s, attendeeIds: [...s.attendeeIds, currentUser.id] } : s
      ),
      attendanceRecords: [newRecord, ...prev.attendanceRecords],
      activityLogs: [newLog, ...prev.activityLogs],
    }));

    showToast(`Presensi ${session.subject} berhasil dicatat!`);
    return {
      ok: true,
      already: false,
      session,
      record: newRecord,
      message: `Hadir tercatat pada ${timeStr} di ${session.room}.`,
    };
  };

  const createQrSession = ({ subject, className, room, meetingLabel, durationMinutes = 45 }) => {
    if (!currentUser) return null;
    const prefix = subject
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() || 'X')
      .join('');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const clsTag = className.replace(/\s+/g, '').slice(0, 4).toUpperCase();
    const code = `SMK-${prefix}-${clsTag}-${rand}`;
    const now = new Date();
    const end = new Date(now.getTime() + durationMinutes * 60000);
    const fmt = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;

    const newSession = {
      id: `qr-ses-${Date.now()}`,
      code,
      subject,
      className,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      room: room || 'Lab RPL 1',
      meetingLabel: meetingLabel || 'Pertemuan Aktif Hari Ini',
      startTime: fmt(now),
      endTime: fmt(end),
      expiresAt: Date.now() + durationMinutes * 60000,
      active: true,
      attendeeIds: [],
    };

    const newLog = {
      id: `log-${Date.now()}`,
      actor: currentUser.name,
      role: currentUser.role === 'admin' ? 'Admin' : 'Guru',
      action: `Membuka sesi QR ${subject} (${className})`,
      time: fmt(now),
      status: 'Sukses',
    };

    setState((prev) => ({
      ...prev,
      qrSessions: [newSession, ...prev.qrSessions],
      activityLogs: [newLog, ...prev.activityLogs],
    }));
    showToast(`Sesi QR ${subject} (${code}) aktif!`);
    return newSession;
  };

  const refreshQrCode = (sessionId) => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setState((prev) => ({
      ...prev,
      qrSessions: prev.qrSessions.map((s) => {
        if (s.id !== sessionId) return s;
        const parts = s.code.split('-');
        parts[parts.length - 1] = String(rand);
        return {
          ...s,
          code: parts.join('-'),
          active: true,
          expiresAt: Date.now() + (prev.schoolSettings.qrValidityMinutes || 45) * 60000,
        };
      }),
    }));
    showToast('Token QR diperbarui.');
  };

  const toggleQrSession = (sessionId) => {
    setState((prev) => ({
      ...prev,
      qrSessions: prev.qrSessions.map((s) =>
        s.id === sessionId ? { ...s, active: !s.active } : s
      ),
    }));
    showToast('Status sesi QR diperbarui.', 'info');
  };

  const markManualAttendance = ({ studentId, studentName, className, subject, status, note }) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = status === 'Alpa' || status === 'Izin' || status === 'Sakit'
      ? '-'
      : `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const newRecord = {
      id: `att-${Date.now()}-${Math.floor(Math.random() * 999)}`,
      studentId,
      studentName,
      className,
      date: dateStr,
      time: timeStr,
      subject,
      status,
      method: currentUser?.role === 'admin' ? 'Audit Admin' : 'Manual Guru',
      note: note || `Diinput oleh ${currentUser?.name || 'Guru'}`,
    };

    setState((prev) => ({
      ...prev,
      attendanceRecords: [newRecord, ...prev.attendanceRecords],
    }));
    showToast(`Status ${studentName}: ${status} disimpan.`);
  };

  const updateAttendanceStatus = (recordId, status, note) => {
    setState((prev) => ({
      ...prev,
      attendanceRecords: prev.attendanceRecords.map((r) =>
        r.id === recordId ? { ...r, status, note: note ?? r.note } : r
      ),
    }));
    showToast('Data presensi berhasil dikoreksi.');
  };

  const submitLeaveRequest = ({ type, startDate, endDate, reason }) => {
    if (!currentUser) return;
    const newReq = {
      id: `lv-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      className: currentUser.className,
      type,
      startDate,
      endDate: endDate || startDate,
      reason,
      status: 'Menunggu',
      reviewedBy: null,
    };
    setState((prev) => ({
      ...prev,
      leaveRequests: [newReq, ...prev.leaveRequests],
    }));
    showToast(`Pengajuan ${type} berhasil dikirim.`);
  };

  const reviewLeaveRequest = (requestId, decision) => {
    const target = state.leaveRequests.find((l) => l.id === requestId);
    if (!target) return;
    setState((prev) => {
      const updatedReqs = prev.leaveRequests.map((l) =>
        l.id === requestId
          ? { ...l, status: decision, reviewedBy: currentUser?.name || 'Admin' }
          : l
      );
      let updatedRecords = prev.attendanceRecords;
      if (decision === 'Disetujui') {
        updatedRecords = [
          {
            id: `att-lv-${Date.now()}`,
            studentId: target.studentId,
            studentName: target.studentName,
            className: target.className,
            date: target.startDate,
            time: '-',
            subject: 'Seluruh Mata Pelajaran',
            status: target.type,
            method: 'Persetujuan Izin',
            note: target.reason,
          },
          ...prev.attendanceRecords,
        ];
      }
      return {
        ...prev,
        leaveRequests: updatedReqs,
        attendanceRecords: updatedRecords,
      };
    });
    showToast(`Pengajuan ${target.studentName} ${decision.toLowerCase()}.`);
  };

  const submitAssignment = (assignmentId, fileName) => {
    setState((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, status: 'Sudah Dikumpulkan', submittedFile: fileName || 'jawaban_tugas.pdf' }
          : a
      ),
    }));
    showToast('Tugas berhasil dikumpulkan!');
  };

  const createAssignment = ({ title, subject, className, dueDate, description }) => {
    const newAsg = {
      id: `asg-${Date.now()}`,
      title,
      subject,
      className,
      dueDate,
      teacher: currentUser?.name || 'Ahmad Fauzi, S.Kom',
      description,
      status: 'Belum Dikumpulkan',
      score: null,
      submittedFile: null,
    };
    setState((prev) => ({ ...prev, assignments: [newAsg, ...prev.assignments] }));
    showToast('Tugas baru berhasil diterbitkan.');
  };

  const gradeAssignment = (assignmentId, score) => {
    setState((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) =>
        a.id === assignmentId ? { ...a, status: 'Dinilai', score: Number(score) } : a
      ),
    }));
    showToast('Nilai tugas disimpan.');
  };

  const updateGradeRecord = (gradeId, { tugas, uts, uas }) => {
    const t = Number(tugas);
    const m = Number(uts);
    const f = Number(uas);
    const finalScore = Math.round(t * 0.35 + m * 0.3 + f * 0.35);
    const grade = finalScore >= 88 ? 'A' : finalScore >= 80 ? 'B+' : finalScore >= 72 ? 'B' : 'C';
    setState((prev) => ({
      ...prev,
      grades: prev.grades.map((g) =>
        g.id === gradeId ? { ...g, tugas: t, uts: m, uas: f, finalScore, grade } : g
      ),
    }));
    showToast('Nilai rapor diperbarui.');
  };

  const toggleBorrowBook = (bookId) => {
    setState((prev) => ({
      ...prev,
      libraryBooks: prev.libraryBooks.map((b) => {
        if (b.id !== bookId) return b;
        const borrowing = !b.borrowedByUser;
        return {
          ...b,
          borrowedByUser: borrowing,
          stock: borrowing ? Math.max(0, b.stock - 1) : b.stock + 1,
          dueDate: borrowing ? '2026-11-25' : null,
        };
      }),
    }));
    showToast('Status peminjaman buku diperbarui.');
  };

  const createNotice = ({ title, category, audience, location, content }) => {
    const now = new Date();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const newNotice = {
      id: `ntc-${Date.now()}`,
      title,
      category,
      audience,
      date: now.toISOString().slice(0, 10),
      monthShort: months[now.getMonth()],
      dayNum: String(now.getDate()).padStart(2, '0'),
      dayName: days[now.getDay()],
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`,
      location: location || 'Portal Sekolah',
      author: currentUser?.name || 'Admin',
      content,
      isNew: true,
      read: false,
    };
    setState((prev) => ({
      ...prev,
      notices: [newNotice, ...prev.notices],
    }));
    showToast('Pengumuman baru berhasil dipublikasikan!');
  };

  const markNoticeRead = (noticeId) => {
    setState((prev) => ({
      ...prev,
      notices: prev.notices.map((n) => (n.id === noticeId ? { ...n, read: true, isNew: false } : n)),
    }));
  };

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
    }));
  };

  const addUser = ({ name, role, identifier, className, major, email }) => {
    const clean = name.trim();
    const newUser = {
      id: `usr-${role.slice(0, 3)}-${Date.now()}`,
      role,
      name: clean,
      firstName: clean.split(/\s+/)[0] || clean,
      identifier,
      identifierLabel: role === 'student' ? 'NISN' : 'NIP',
      className: className || (role === 'student' ? 'XI RPL 1' : 'Pengajar'),
      major: major || 'Rekayasa Perangkat Lunak',
      email,
      phone: '0812-0000-0000',
      address: 'Bandung',
      avatarBg: 'from-indigo-200 to-purple-100',
      avatarColor: '#4F46E5',
      status: 'active',
    };
    setState((prev) => ({ ...prev, users: [newUser, ...prev.users] }));
    showToast(`Pengguna ${clean} berhasil ditambahkan.`);
  };

  const toggleUserStatus = (userId) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      ),
    }));
    showToast('Status pengguna diperbarui.');
  };

  const addSchedule = (item) => {
    setState((prev) => ({
      ...prev,
      schedules: [...prev.schedules, { id: `sch-${Date.now()}`, color: 'purple', ...item }],
    }));
    showToast('Jadwal berhasil ditambahkan.');
  };

  const deleteSchedule = (scheduleId) => {
    setState((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((s) => s.id !== scheduleId),
    }));
    showToast('Slot jadwal dihapus.', 'info');
  };

  const addClassRoom = (item) => {
    setState((prev) => ({
      ...prev,
      classes: [...prev.classes, { id: `cls-${Date.now()}`, studentsCount: 32, ...item }],
    }));
    showToast('Kelas baru ditambahkan.');
  };

  const addSubject = (item) => {
    setState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, { id: `sub-${Date.now()}`, ...item }],
    }));
    showToast('Mata pelajaran ditambahkan.');
  };

  const updateSchoolSettings = (updates) => {
    setState((prev) => ({
      ...prev,
      schoolSettings: { ...prev.schoolSettings, ...updates },
    }));
    showToast('Pengaturan berhasil disimpan.');
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = { ...getInitialState(), currentUserId: currentUser?.id || null };
    persistStateNow(fresh);
    setState(fresh);
    setSearchQuery('');
    showToast('Data demo dikembalikan ke kondisi awal.', 'info', true);
    navigate(fresh.currentUserId ? 'home' : 'login');
  };

  const value = {
    state,
    currentUser,
    activePage,
    searchQuery,
    setSearchQuery,
    toast,
    showToast,
    navigate,
    handleLinkClick,
    loginAsRole,
    loginWithCredentials,
    logout,
    updateProfile,
    scanQrCode,
    createQrSession,
    refreshQrCode,
    toggleQrSession,
    markManualAttendance,
    updateAttendanceStatus,
    submitLeaveRequest,
    reviewLeaveRequest,
    submitAssignment,
    createAssignment,
    gradeAssignment,
    updateGradeRecord,
    toggleBorrowBook,
    createNotice,
    markNoticeRead,
    markAllNotificationsRead,
    addUser,
    toggleUserStatus,
    addSchedule,
    deleteSchedule,
    addClassRoom,
    addSubject,
    updateSchoolSettings,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
