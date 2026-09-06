/**
 * Incident Evidence & Verification Modal (from Bharat-Netra)
 * Displays photographic evidence, IoT sensor metrics, and disaster authority advisories for an active hazard
 */

import React from 'react';
import { HazardIncident } from '../engine/HazardRegistry';
import { ShieldAlert, CheckCircle2, Clock, MapPin, AlertTriangle, X, Radio } from 'lucide-react';

interface IncidentEvidenceModalProps {
  hazard: HazardIncident | null;
  onClose: () => void;
}

export const IncidentEvidenceModal: React.FC<IncidentEvidenceModalProps> = ({ hazard, onClose }) => {
  if (!hazard) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto transition-colors">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  {hazard.type.replace('_', ' ')}
                </span>
                {hazard.verified ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" /> PENDING VERIFICATION
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-1">
                {hazard.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Photographic Evidence */}
        {hazard.imageUrl && (
          <div className="relative rounded-2xl overflow-hidden h-44 sm:h-52 border border-slate-200 dark:border-slate-800 shadow-inner">
            <img
              src={hazard.imageUrl}
              alt={hazard.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] text-white font-mono flex items-center gap-1">
              <span>Verified On-Site Imagery</span>
            </div>
          </div>
        )}

        {/* Telemetry Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-400">Severity</div>
            <div className="font-black text-rose-600 dark:text-rose-400 mt-0.5">{hazard.severity}</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-400">Source</div>
            <div className="font-black text-blue-600 dark:text-blue-400 mt-0.5">{hazard.source}</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-400">Hazard Radius</div>
            <div className="font-black font-mono text-slate-900 dark:text-white mt-0.5">{hazard.radiusMeters}m</div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-400">Status</div>
            <div className="font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{hazard.status}</div>
          </div>
        </div>

        {/* Description & Action Advice */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <div className="text-slate-700 dark:text-slate-300">
            <strong>Ground Status:</strong> {hazard.description}
          </div>
          {hazard.actionRequired && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span><strong>Advisory:</strong> {hazard.actionRequired}</span>
            </div>
          )}
        </div>

        {/* Coordinates and Timestamp */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
          <span className="flex items-center gap-1 font-mono">
            <MapPin className="w-3 h-3 text-blue-500" />
            {hazard.latitude.toFixed(4)}°N, {hazard.longitude.toFixed(4)}°E
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(hazard.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
        >
          Acknowledge Advisory
        </button>
      </div>
    </div>
  );
};
