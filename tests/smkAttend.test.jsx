import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../src/App';

function loginAsStudent() {
  fireEvent.click(screen.getByText('Student Portal'));
}

describe('SMK Attend — Multi-Role Responsive Portal & MPA Flows', () => {
  it('starts on Login Page on initial visit before entering any portal', () => {
    render(<App />);

    expect(window.location.pathname).toBe('/');
    expect(screen.getByText('Masuk ke Portal')).toBeTruthy();
    expect(screen.getByText('Akses Cepat Demo (3 Role)')).toBeTruthy();
    expect(screen.queryByText('Upcoming Activities')).toBeNull();
  });

  it('supports multi-page URLs and browser Back navigation without redirect loops', () => {
    render(<App />);

    loginAsStudent();
    expect(window.location.pathname).toBe('/dashboard.html');
    expect(screen.getByText('Upcoming Activities')).toBeTruthy();

    fireEvent.click(screen.getByText('Scan QR Code'));
    expect(window.location.pathname).toBe('/scan-qr.html');
    expect(screen.getByText('Pemindai QR Presensi')).toBeTruthy();

    // Simulasi tombol Back browser kembali ke dashboard.html
    window.history.replaceState({}, '', '/dashboard.html');
    fireEvent(window, new PopStateEvent('popstate'));
    expect(screen.getByText('Upcoming Activities')).toBeTruthy();

    // Simulasi tombol Back browser kembali ke halaman login awal tanpa loop redirect
    window.history.replaceState({}, '', '/login.html');
    fireEvent(window, new PopStateEvent('popstate'));
    expect(screen.getByText('Masuk ke Portal')).toBeTruthy();
    expect(screen.getByText(/Sesi aktif: Alex Pratama/i)).toBeTruthy();
  });

  it('renders Student Portal dashboard matching design specs with all 12 Quick Access cards and bottom nav', () => {
    render(<App />);
    loginAsStudent();

    expect(screen.getAllByText('Student Portal').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hello, Alex/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Have a great day ahead!').length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText('Search anything...')).toBeTruthy();

    const expectedStudentCards = [
      'Profile',
      'Schedule',
      'Teachers',
      'Attendance',
      'Scan QR',
      'Grades',
      'Attendance History',
      'Notices',
      'Library',
      'Assignments',
      'Exams',
      'Settings',
    ];
    for (const label of expectedStudentCards) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }

    expect(screen.getByText('Upcoming Activities')).toBeTruthy();

    const bottomNav = screen.getByLabelText('Navigasi bawah mobile');
    expect(within(bottomNav).getByText('Home')).toBeTruthy();
    expect(within(bottomNav).getByText('Schedule')).toBeTruthy();
    expect(within(bottomNav).getByText('Attendance')).toBeTruthy();
    expect(within(bottomNav).getByText('More')).toBeTruthy();
  });

  it('filters Quick Access via live search and navigates to Scan QR to record attendance', () => {
    render(<App />);
    loginAsStudent();

    const searchInput = screen.getByPlaceholderText('Search anything...');
    fireEvent.change(searchInput, { target: { value: 'Scan QR' } });
    expect(screen.getAllByText('Scan QR').length).toBeGreaterThan(0);
    expect(screen.queryByText('Library')).toBeNull();

    fireEvent.change(searchInput, { target: { value: '' } });

    fireEvent.click(screen.getByText('Scan QR Code'));
    expect(screen.getByText('Pemindai QR Presensi')).toBeTruthy();

    const codeInput = screen.getByPlaceholderText('Contoh: SMK-PW-XI1-3910');
    fireEvent.change(codeInput, { target: { value: 'INVALID-CODE' } });
    fireEvent.click(screen.getByText('Verifikasi'));
    expect(screen.getByText('Scan Gagal')).toBeTruthy();

    const simButtons = screen.getAllByText('Simulasi Scan Sesi Ini');
    fireEvent.click(simButtons[0]);
    expect(screen.getByText('Presensi Berhasil!')).toBeTruthy();

    fireEvent.click(screen.getByText('Lihat Riwayat Presensi →'));
    expect(screen.getByText('Riwayat Kehadiran Saya')).toBeTruthy();
  });

  it('navigates across all Student subpages cleanly', () => {
    render(<App />);
    loginAsStudent();

    const routes = [
      { link: 'Profil Siswa', heading: 'Edit Profil Akun' },
      { link: 'Jadwal Pelajaran', heading: /Jadwal Pelajaran/i },
      { link: 'Direktori Guru', heading: 'Direktori Guru & Wali Kelas' },
      { link: 'Presensi & Izin', heading: 'Presensi QR Code Kelas' },
      { link: 'Tugas Sekolah', heading: 'Daftar Tugas Sekolah' },
      { link: 'Nilai & Rapor', heading: /Capaian Akademik/i },
      { link: 'Jadwal Ujian', heading: /Kartu Peserta Ujian/i },
      { link: 'Perpustakaan', heading: 'Perpustakaan Digital & Buku Paket' },
      { link: 'Pengumuman', heading: 'Pengumuman & Informasi Sekolah' },
      { link: 'Pengaturan', heading: 'Pengaturan Portal & Preferensi' },
    ];

    for (const r of routes) {
      fireEvent.click(screen.getByText(r.link));
      expect(screen.getAllByText(r.heading).length).toBeGreaterThan(0);
    }
  });

  it('updates greeting dynamically when editing logged-in user profile name', () => {
    render(<App />);
    loginAsStudent();

    fireEvent.click(screen.getByText('Profil Siswa'));
    const nameInput = screen.getByDisplayValue('Alex Pratama');
    fireEvent.change(nameInput, { target: { value: 'Budi Santoso' } });
    fireEvent.click(screen.getByText('Simpan Perubahan'));

    fireEvent.click(screen.getByText('Dashboard'));
    expect(screen.getAllByText(/Hello, Budi/i).length).toBeGreaterThan(0);
  });

  it('supports student submitting a leave request and Admin approving it', () => {
    render(<App />);
    loginAsStudent();

    fireEvent.click(screen.getByText('Presensi & Izin'));
    const reasonBox = screen.getByPlaceholderText('Tuliskan alasan ketidakhadiran secara jelas...');
    fireEvent.change(reasonBox, { target: { value: 'Keperluan lomba robotik kota' } });
    fireEvent.click(screen.getByText('Kirim Pengajuan'));
    expect(screen.getByText('Keperluan lomba robotik kota')).toBeTruthy();

    // Switch to Admin and approve
    fireEvent.click(screen.getByRole('button', { name: 'Admin' }));
    fireEvent.click(screen.getAllByText('Persetujuan Izin')[0]);
    expect(screen.getByText('Keperluan lomba robotik kota')).toBeTruthy();

    const approveBtns = screen.getAllByRole('button', { name: 'Setujui' });
    fireEvent.click(approveBtns[0]);
    expect(screen.getByText(/Pengajuan Alex Pratama disetujui/i)).toBeTruthy();
  });

  it('supports Teacher creating a new QR session and manual check-in', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Teacher Portal'));
    expect(screen.getAllByText('Teacher Portal').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hello, Ahmad/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('Sesi QR Presensi'));
    expect(screen.getByText('Kelola Sesi QR Presensi')).toBeTruthy();

    fireEvent.click(screen.getByText('Buat Sesi QR Baru'));
    fireEvent.click(screen.getByText('Aktifkan QR Session'));
    expect(screen.getByText(/Sesi QR .* aktif!/i)).toBeTruthy();

    fireEvent.click(screen.getByText('Input Presensi'));
    expect(screen.getByText('Input Presensi Manual Kelas')).toBeTruthy();
    fireEvent.click(screen.getByText('Simpan Semua'));
    expect(screen.getByText(/disimpan/i)).toBeTruthy();
  });

  it('supports Admin Portal navigation, bottom nav, User Management, Academics, Audit & Logs', () => {
    render(<App />);

    fireEvent.click(screen.getByText('Admin Portal'));
    expect(screen.getAllByText('Admin Portal').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hello, Ratna/i).length).toBeGreaterThan(0);

    const bottomNav = screen.getByLabelText('Navigasi bawah mobile');
    expect(within(bottomNav).getByText('Home')).toBeTruthy();
    expect(within(bottomNav).getByText('Management')).toBeTruthy();
    expect(within(bottomNav).getByText('Reports')).toBeTruthy();
    expect(within(bottomNav).getByText('More')).toBeTruthy();

    fireEvent.click(screen.getByText('Kelola Pengguna'));
    expect(screen.getByText('Manajemen Pengguna Portal')).toBeTruthy();

    fireEvent.click(screen.getByText('Kelas & Jurusan'));
    expect(screen.getByText(/XI RPL 1/)).toBeTruthy();

    fireEvent.click(screen.getByText('Mata Pelajaran'));
    expect(screen.getByText(/RPL-301/)).toBeTruthy();

    fireEvent.click(screen.getByText('Audit Presensi'));
    expect(screen.getByText('Audit & Koreksi Presensi')).toBeTruthy();

    fireEvent.click(screen.getByText('Log Aktivitas'));
    expect(screen.getByText('Log Aktivitas Sistem')).toBeTruthy();
  });

  it('opens and closes Mobile Drawer and More Menu Modal properly', () => {
    render(<App />);
    loginAsStudent();

    fireEvent.click(screen.getByLabelText('Buka menu navigasi'));
    expect(screen.getByText('Beralih Portal (Demo)')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Tutup menu'));
    expect(screen.queryByText('Beralih Portal (Demo)')).toBeNull();

    const bottomNav = screen.getByLabelText('Navigasi bawah mobile');
    fireEvent.click(within(bottomNav).getByText('More'));
    expect(screen.getByText('Semua Menu Student Portal')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Tutup menu lainnya'));
    expect(screen.queryByText('Semua Menu Student Portal')).toBeNull();
  });

  it('supports Logout to Login Page and logging back in via Demo Role card', () => {
    render(<App />);
    loginAsStudent();

    fireEvent.click(screen.getByLabelText('Keluar dari portal'));
    expect(screen.getByText('Masuk ke Portal')).toBeTruthy();
    expect(screen.getByText('Akses Cepat Demo (3 Role)')).toBeTruthy();

    fireEvent.click(screen.getByText('Student Portal'));
    expect(screen.getAllByText(/Hello, Alex/i).length).toBeGreaterThan(0);
  });
});
