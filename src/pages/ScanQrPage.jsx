import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import {
  Camera,
  CameraOff,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Upload,
  Keyboard,
  Sparkles,
  Clock,
  MapPin,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import QrCodeGraphic from '../components/QrCodeGraphic';
import { getPageUrl, isTestEnvironment } from '../config/routes';

export default function ScanQrPage() {
  const { state, currentUser, scanQrCode, navigate } = useApp();
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [selectedDemoSession, setSelectedDemoSession] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const activeSessions = state.qrSessions.filter((s) => s.active);

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleDecodeSuccess = (code) => {
    const res = scanQrCode(code);
    setScanResult(res);
    if (res.ok) {
      stopCamera();
    }
  };

  const startCamera = async () => {
    setCameraError('');
    setScanResult(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Peramban tidak mendukung akses kamera langsung. Gunakan Unggah QR atau Input Kode.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
          scanLoop();
        }
      }, 100);
    } catch {
      setCameraError(
        'Izin kamera ditolak atau kamera tidak tersedia. Anda dapat mengunggah gambar QR atau memilih sesi aktif di bawah.'
      );
      setCameraActive(false);
    }
  };

  const scanLoop = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !streamRef.current) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qr = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (qr?.data) {
          handleDecodeSuccess(qr.data);
          return;
        }
      }
    }
    rafRef.current = requestAnimationFrame(scanLoop);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const qr = jsQR(imageData.data, imageData.width, imageData.height);
        if (qr?.data) {
          handleDecodeSuccess(qr.data);
        } else {
          setScanResult({
            ok: false,
            message: 'QR Code tidak terdeteksi pada gambar tersebut. Coba gambar lain atau masukkan kode sesi.',
          });
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const res = scanQrCode(manualCode);
    setScanResult(res);
    if (res.ok) setManualCode('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main: Responsive Camera Viewfinder */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-[0_2px_16px_rgba(15,23,42,0.04)] space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Pemindai QR Presensi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Arahkan kamera ke QR Code yang ditampilkan guru di kelas
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold shrink-0">
              <QrCode className="w-3.5 h-3.5" />
              <span>{currentUser?.className}</span>
            </span>
          </div>

          {/* Appropriately Sized Camera Container */}
          <div className="relative w-full max-w-[300px] sm:max-w-[340px] aspect-square mx-auto rounded-3xl overflow-hidden bg-slate-950 shadow-inner border-4 border-indigo-100">
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                {/* Animated Scanning Line */}
                <div className="pointer-events-none absolute inset-x-6 top-3 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34D399] animate-scanline" />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-3">
                  <Camera className="w-8 h-8 text-indigo-300" />
                </div>
                <p className="text-sm font-bold">Kamera Siap Memindai</p>
                <p className="text-[11px] text-slate-300 mt-1 max-w-[220px]">
                  Klik tombol di bawah untuk mengaktifkan kamera atau gunakan simulasi QR sesi aktif.
                </p>
              </div>
            )}

            {/* Corner Framing Guides */}
            <div className="pointer-events-none absolute inset-5">
              <span className="absolute top-0 left-0 w-7 h-7 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl" />
              <span className="absolute top-0 right-0 w-7 h-7 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl" />
              <span className="absolute bottom-0 left-0 w-7 h-7 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl" />
              <span className="absolute bottom-0 right-0 w-7 h-7 border-b-4 border-r-4 border-indigo-400 rounded-br-xl" />
            </div>
          </div>

          {cameraError && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          {/* Camera & Upload Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {cameraActive ? (
              <button
                type="button"
                onClick={stopCamera}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white py-3 px-4 text-xs sm:text-sm font-bold shadow-sm transition"
              >
                <CameraOff className="w-4 h-4" />
                <span>Matikan Kamera</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#4F46E5] to-[#7C3AED] text-white py-3 px-4 text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 hover:brightness-105 transition"
              >
                <Camera className="w-4 h-4" />
                <span>Aktifkan Kamera</span>
              </button>
            )}

            <label className="w-full cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 py-3 px-4 text-xs sm:text-sm font-bold transition">
              <Upload className="w-4 h-4" />
              <span>Unggah Gambar QR</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Scan Status Feedback Banner */}
          {scanResult && (
            <div
              className={`rounded-2xl p-4 border flex items-start gap-3 ${
                scanResult.ok
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {scanResult.ok ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold">
                  {scanResult.ok
                    ? scanResult.already
                      ? 'Presensi Sudah Tercatat'
                      : 'Presensi Berhasil!'
                    : 'Scan Gagal'}
                </p>
                <p className="text-xs mt-0.5 opacity-90">{scanResult.message}</p>
                {scanResult.ok && (
                  <a
                    href={getPageUrl('attendance-history')}
                    onClick={(e) => {
                      if (isTestEnvironment()) {
                        e.preventDefault();
                        navigate('attendance-history');
                      }
                    }}
                    className="mt-2 inline-flex items-center text-xs font-bold text-emerald-700 underline"
                  >
                    Lihat Riwayat Presensi →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Manual Token Input & Active Sessions Quick Scan */}
        <div className="lg:col-span-5 space-y-5">
          {/* Manual Token Card */}
          <form
            onSubmit={handleManualSubmit}
            className="bg-white rounded-3xl border border-slate-100 p-5 shadow-[0_2px_14px_rgba(15,23,42,0.04)] space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Input Kode Sesi Manual</h3>
                <p className="text-[11px] text-slate-500">Alternatif bila kamera terkendala</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Contoh: SMK-PW-XI1-3910"
                className="w-full min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-mono uppercase focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-bold transition shrink-0"
              >
                Verifikasi
              </button>
            </div>
          </form>

          {/* Active Sessions Ready for Instant Test / Scan */}
          <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-[0_2px_14px_rgba(15,23,42,0.04)] space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Sesi QR Aktif Hari Ini</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {activeSessions.length} Aktif
              </span>
            </div>

            <div className="space-y-3">
              {activeSessions.map((ses) => {
                const alreadyCheckedIn = ses.attendeeIds.includes(currentUser?.id);
                return (
                  <div
                    key={ses.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 leading-snug">
                          {ses.subject}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {ses.className} • {ses.teacherName}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          alreadyCheckedIn
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {alreadyCheckedIn ? 'Sudah Hadir' : 'Aktif'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {ses.startTime}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {ses.room}
                      </span>
                    </div>

                    {selectedDemoSession === ses.id && (
                      <div className="flex flex-col items-center py-2 bg-white rounded-xl border border-slate-100">
                        <QrCodeGraphic value={ses.code} size={130} />
                        <p className="mt-1.5 text-[11px] font-mono font-bold text-indigo-600">
                          {ses.code}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleDecodeSuccess(ses.code)}
                        disabled={alreadyCheckedIn}
                        className={`flex-1 rounded-xl py-2 px-3 text-xs font-bold transition ${
                          alreadyCheckedIn
                            ? 'bg-emerald-100 text-emerald-700 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {alreadyCheckedIn ? 'Tercatat Hadir ✓' : 'Simulasi Scan Sesi Ini'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDemoSession((prev) => (prev === ses.id ? null : ses.id))
                        }
                        className="rounded-xl border border-slate-200 bg-white hover:bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                      >
                        {selectedDemoSession === ses.id ? 'Tutup QR' : 'Lihat QR'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

