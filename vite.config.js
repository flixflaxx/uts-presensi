import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const htmlPages = [
  'index.html',
  'login.html',
  'dashboard.html',
  'profile.html',
  'schedule.html',
  'teachers.html',
  'attendance.html',
  'scan-qr.html',
  'grades.html',
  'attendance-history.html',
  'notices.html',
  'library.html',
  'assignments.html',
  'exams.html',
  'settings.html',
  'manual-attendance.html',
  'students.html',
  'recap.html',
  'leave-requests.html',
  'reports.html',
  'management.html',
  'classes.html',
  'subjects.html',
  'qr-monitor.html',
  'attendance-audit.html',
  'activity-logs.html',
];

const input = Object.fromEntries(
  htmlPages.map((file) => [file.replace(/\.html$/, ''), resolve(__dirname, file)])
);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input,
    },
  },
});
