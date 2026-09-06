/**
 * Route Comparison Panel Component (from Bharat-Netra)
 * Allows side-by-side comparison of Safest Route vs Fastest Route vs Alternative Bypass
 */

import React from 'react';
import { EvaluatedRouteOption } from '../engine/SafeRouteEngine';
import { ShieldCheck, Zap, Navigation, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RouteComparisonPanelProps {
  routes: EvaluatedRouteOption[];
  selectedRouteId: string;
  onSelectRoute: (routeId: string) => void;
  onStartNavigation: () => void;
  onClose: () => void;
}

export const RouteComparisonPanel: React.FC<RouteComparisonPanelProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  onStartNavigation,
  onClose
}) => {
  return (
    <div className="w-full glass-panel bg-white/95 dark:bg-slate-900/95 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-fadeIn transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
              Multi-Route Safety Evaluation
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Safety-dominant scoring compares active landslide zones, slope, and travel time
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold"
        >
          ✕
        </button>
      </div>

      {/* Routes List */}
      <div className="space-y-2.5">
        {routes.map((r) => {
          const isSelected = r.id === selectedRouteId;
          const score = r.telemetry.safetyScore;
          const isSafe = score >= 75;

          return (
            <div
              key={r.id}
              onClick={() => onSelectRoute(r.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800/60 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: r.color }}
                  />
                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {r.name}
                  </span>
                  {r.isRecommended && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> RECOMMENDED
                    </span>
                  )}
                </div>

                {/* Safety Score Pill */}
                <div
                  className={`px-2.5 py-1 rounded-xl text-xs font-black font-mono border ${
                    isSafe
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                  }`}
                >
                  {score}% Safety
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-2.5">
                {r.via}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Distance</div>
                  <div className="font-bold font-mono text-slate-900 dark:text-slate-200 mt-0.5">
                    {r.telemetry.distanceKm} km
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Est. Time</div>
                  <div className="font-bold font-mono text-slate-900 dark:text-slate-200 mt-0.5">
                    {r.telemetry.durationMinutes} min
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400">Hazards</div>
                  <div
                    className={`font-bold font-mono mt-0.5 ${
                      r.telemetry.hazardCount === 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {r.telemetry.hazardCount} active
                  </div>
                </div>
              </div>

              {/* Advisory note */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-start gap-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{r.telemetry.explanation}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <button
        onClick={onStartNavigation}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs tracking-wider shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <Navigation className="w-4 h-4 fill-white" />
        <span>START SAFE NAVIGATION ON SELECTED ROUTE</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
