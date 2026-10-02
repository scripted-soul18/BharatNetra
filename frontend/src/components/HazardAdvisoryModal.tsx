import React from 'react';
import { AlertTriangle, AlertOctagon, X, ChevronRight, ShieldAlert } from 'lucide-react';
import { HazardIncident } from '../engine/HazardRegistry';
import { Coordinate } from '../services/safeRouteEngine';

export interface HazardAdvisoryItem {
  description: string;
  type?: string;
  location?: string | Coordinate;
}

interface HazardAdvisoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  highwayName?: string;
  hazards: Array<{ description: string; type?: string; location?: string | Coordinate }>;
  onInspectWeatherForecast: () => void;
}

export const HazardAdvisoryModal: React.FC<HazardAdvisoryModalProps> = ({
  isOpen,
  onClose,
  highwayName = 'Corridor',
  hazards,
  onInspectWeatherForecast
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xl transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 font-extrabold text-sm">
            <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span>Active Road Hazard Advisory</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hazard Items List */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
          <div className="text-xs font-black text-slate-900 dark:text-white flex items-center justify-between">
            <span>{highwayName} Real-Time Safety Status</span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              {hazards.length} Issue{hazards.length > 1 ? 's' : ''} Detected
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {hazards.map((hz, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-950/80 border border-amber-500/20 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2"
              >
                <span className="text-rose-500 font-bold shrink-0 mt-0.5">⚠️</span>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold block">{hz.description}</span>
                  {hz.location && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Near {typeof hz.location === 'string' ? hz.location : `${hz.location.lat.toFixed(3)}°, ${hz.location.lon.toFixed(3)}°`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              onClose();
              onInspectWeatherForecast();
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>View Weather &amp; Landslide Forecast</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
