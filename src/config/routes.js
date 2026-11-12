export const PAGE_ROUTES = {
  login: '/login.html',
  home: '/dashboard.html',
  profile: '/profile.html',
  schedule: '/schedule.html',
  teachers: '/teachers.html',
  attendance: '/attendance.html',
  'scan-qr': '/scan-qr.html',
  grades: '/grades.html',
  'attendance-history': '/attendance-history.html',
  notices: '/notices.html',
  library: '/library.html',
  assignments: '/assignments.html',
  exams: '/exams.html',
  settings: '/settings.html',
  'manual-attendance': '/manual-attendance.html',
  students: '/students.html',
  recap: '/recap.html',
  'leave-requests': '/leave-requests.html',
  reports: '/reports.html',
  management: '/management.html',
  classes: '/classes.html',
  subjects: '/subjects.html',
  'qr-monitor': '/qr-monitor.html',
  'attendance-audit': '/attendance-audit.html',
  'activity-logs': '/activity-logs.html',
};

export function getPageUrl(pageId) {
  return PAGE_ROUTES[pageId] || PAGE_ROUTES.home;
}

export function getPageFromPathname(pathname = '/') {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/' || clean === '/index.html' || clean === '/login' || clean === '/login.html') {
    return 'login';
  }
  const slug = clean.replace(/^\//, '').replace(/\.html$/i, '');
  if (slug === 'dashboard' || slug === 'home') return 'home';
  if (PAGE_ROUTES[slug]) return slug;
  return 'home';
}

export function isTestEnvironment() {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.userAgent === 'string' &&
    navigator.userAgent.toLowerCase().includes('jsdom')
  );
}

