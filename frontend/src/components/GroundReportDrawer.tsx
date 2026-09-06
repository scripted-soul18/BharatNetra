/**
 * Ground Incident Reporting Drawer (from Bharat-Netra)
 * Allows drivers, locals, and disaster response teams to report real-time road hazards
 */

import React, { useState } from 'react';
import { HazardRegistry, HazardIncident } from '../engine/HazardRegistry';
import { AlertOctagon, MapPin, Camera, Check, ShieldAlert, X } from 'lucide-react';

interface GroundReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentLat: number;
  currentLon: number;
  onReportSubmitted: (incident: HazardIncident) => void;
}

export const GroundReportDrawer: React.FC<GroundReportDrawerProps> = ({
  isOpen,
  onClose,
  currentLat,
  currentLon,
  onReportSubmitted
}) => {
  const [type, setType] = useState<HazardIncident['type']>('LANDSLIDE');
  const [severity, setSeverity] = useState<HazardIncident['severity']>('HIGH');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [radiusMeters, setRadiusMeters] = useState(500);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const incident = HazardRegistry.addHazardReport({
      type,
      severity,
      title: title || `${type.replace('_', ' ')} Incident at Corridor`,
      description: description || 'Reported by motorist on site. Emergency clearing pending.',
      latitude: currentLat + (Math.random() * 0.006 - 0.003),
      longitude: currentLon + (Math.random() * 0.006 - 0.003),
      radiusMeters,
      source: 'CITIZEN_REPORT',
      actionRequired: 'Warning broadcasted to nearby vehicles navigating this route.'
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onReportSubmitted(incident);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                Report Ground Hazard
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Broadcast real-time incident to Bharat Netra alert network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Incident Broadcasted!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thank you for keeping fellow travelers and first responders safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Location Tag */}
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="font-mono truncate">
                GPS: {currentLat.toFixed(4)}°N, {currentLon.toFixed(4)}°E
              </span>
            </div>

            {/* Hazard Type Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Hazard Type</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    ['LANDSLIDE', 'Landslide'],
                    ['ROCKFALL', 'Rockfall'],
                    ['FLASH_FLOOD', 'Flash Flood'],
                    ['ROAD_BLOCK', 'Road Block'],
                    ['BRIDGE_DAMAGE', 'Bridge Fault']
                  ] as const
                ).map(([t, label]) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 px-1 rounded-xl text-center font-bold border transition-all ${
                      type === t
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Level */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">Severity Level</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={`py-1.5 rounded-xl font-bold border text-[11px] transition-all ${
                      severity === s
                        ? s === 'CRITICAL'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : s === 'HIGH'
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Title / Landmark */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Incident Title / Highway Marker
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Slump near KM-42 milestone"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Description &amp; Passage Status</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Can 2-wheelers pass? How severe is the mud flow?"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            {/* Impact Radius Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Estimated Impact Radius:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">{radiusMeters}m</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>SUBMIT &amp; BROADCAST HAZARD REPORT</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
