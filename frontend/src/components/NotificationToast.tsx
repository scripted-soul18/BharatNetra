import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X, Navigation } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="absolute top-16 left-3 right-3 z-50 animate-fadeIn pointer-events-auto">
      <div className="bg-white/95 dark:bg-[#0C1728]/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xl p-3 flex items-start justify-between gap-3">
        {/* Icon */}
        <div className="shrink-0 mt-0.5">
          {toast.type === 'success' && (
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'warning' && (
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
            {toast.title}
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
            {toast.message}
          </div>
          {toast.actionLabel && toast.onAction && (
            <button
              onClick={() => {
                toast.onAction?.();
                onDismiss();
              }}
              className="mt-2 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {toast.actionLabel} →
            </button>
          )}
        </div>

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-md transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
