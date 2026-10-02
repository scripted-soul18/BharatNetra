import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Signal,
  MessageSquare,
  Camera,
  Maximize2,
  Minimize2,
  Smartphone,
  Monitor,
  QrCode,
  X,
  ExternalLink
} from 'lucide-react';

interface MobileAppWrapperProps {
  children: React.ReactNode;
}

export const MobileAppWrapper: React.FC<MobileAppWrapperProps> = ({ children }) => {
  const [timeStr, setTimeStr] = useState('9:41');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [networkUrl, setNetworkUrl] = useState('http://192.168.3.239:5173');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);

    // Derive current hostname URL
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';
      if (host !== 'localhost' && host !== '127.0.0.1') {
        setNetworkUrl(`http://${host}${port}`);
      } else {
        setNetworkUrl(`http://192.168.3.239${port || ':5173'}`);
      }
    }

    return () => clearInterval(interval);
  }, []);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(networkUrl)}&margin=10`;

  return (
    <div className="min-h-screen w-full bg-slate-100/90 dark:bg-[#03060E] flex items-center justify-center p-0 sm:p-4 selection:bg-emerald-600 selection:text-white relative transition-colors duration-300">
      {/* Floating Buttons in bottom-right corner of Desktop */}
      <div className="fixed bottom-4 right-4 z-[999] hidden sm:flex items-center gap-2">
        {/* QR Code Scanner Button */}
        <button
          onClick={() => setShowQrModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
          title="Scan QR Code to open on your Phone"
        >
          <QrCode className="w-4 h-4" />
          <span>Scan on Mobile</span>
        </button>

        {/* Expand / Phone View Switcher */}
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xl backdrop-blur-md transition-all active:scale-95"
          title={isFullScreen ? 'Switch to Smartphone Frame View' : 'Switch to Full Screen Desktop View'}
        >
          {isFullScreen ? (
            <>
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>Phone View</span>
            </>
          ) : (
            <>
              <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Expand</span>
            </>
          )}
        </button>
      </div>

      {/* QR Code Modal for Mobile Scanning */}
      {showQrModal && (
        <div className="fixed inset-0 z-[1000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl text-center">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                <QrCode className="w-5 h-5" />
                <span>Open Bharat Netra on Mobile</span>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Scan this QR code with your phone camera or QR scanner to open the full mobile application directly:
            </p>

            {/* QR Code Image */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-md inline-block mx-auto">
              <img
                src={qrImageUrl}
                alt="Bharat Netra Mobile QR Code"
                className="w-48 h-48 rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <div className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase">
                Wi-Fi Network URL
              </div>
              <a
                href={networkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>{networkUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Make sure your phone is connected to the same Wi-Fi network.
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Container - Adaptive between Phone Frame and Full Screen */}
      <div
        className={`w-full transition-all duration-300 flex flex-col justify-between relative overflow-hidden bg-white dark:bg-[#070E1A] ${
          isFullScreen
            ? 'max-w-7xl min-h-screen sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800'
            : 'sm:max-w-[430px] md:max-w-[440px] min-h-screen sm:min-h-[860px] sm:max-h-[94vh] sm:h-[880px] sm:rounded-[42px] shadow-[0_20px_70px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_70px_rgba(0,0,0,0.85)] sm:border-[7px] sm:border-slate-900 dark:sm:border-slate-800 ring-1 ring-slate-900/10 dark:ring-white/10'
        }`}
      >
        {/* Top Native Mobile Status Bar (Hidden in Fullscreen Desktop mode) */}
        {!isFullScreen && (
          <div className="w-full px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#070E1A] border-b border-slate-100 dark:border-slate-800/60 select-none shrink-0 z-50 transition-colors duration-300">
            {/* Left: Clock */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-slate-900 dark:text-white">{timeStr}</span>
            </div>

            {/* Center Dynamic Island Notch */}
            <div className="w-24 h-4 bg-slate-900 dark:bg-black rounded-full flex items-center justify-between px-2.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-slate-800 dark:bg-slate-900" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            </div>

            {/* Right: Network & Battery Indicators */}
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">
              <Signal className="w-3 h-3 text-slate-700 dark:text-slate-300" />
              <Wifi className="w-3 h-3 text-slate-700 dark:text-slate-300" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">98%</span>
                <Battery className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-emerald-400" />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Screen View Content */}
        <div className="flex-1 w-full flex flex-col overflow-y-auto overflow-x-hidden relative bg-white dark:bg-[#070E1A]">
          {children}
        </div>

        {/* Bottom Smartphone Gesture Indicator Bar */}
        {!isFullScreen && (
          <div className="w-full py-1.5 bg-white dark:bg-[#070E1A] border-t border-slate-100 dark:border-slate-800/60 flex justify-center shrink-0 z-50 transition-colors duration-300">
            <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};

