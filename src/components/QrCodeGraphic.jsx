import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QrCodeGraphic({ value, size = 200, className = '' }) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    let cancelled = false;
    if (!value) return;
    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: {
        dark: '#1E1B4B',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-slate-100 text-xs text-slate-400 ${className}`}
        style={{ width: size, height: size }}
      >
        Memuat QR...
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`QR Code ${value}`}
      width={size}
      height={size}
      className={`max-w-full h-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm ${className}`}
    />
  );
}

