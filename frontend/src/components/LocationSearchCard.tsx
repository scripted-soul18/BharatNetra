import React from 'react';
import {
  MapPin,
  Navigation,
  ArrowUpDown,
  X,
  Crosshair,
  Search,
  CheckCircle2
} from 'lucide-react';
import { LocationSuggestion } from '../services/safeRouteEngine';

interface LocationSearchCardProps {
  origin: string;
  destination: string;
  onOriginChange: (val: string) => void;
  onDestChange: (val: string) => void;
  onSwap: () => void;
  activeInput: 'origin' | 'dest' | null;
  setActiveInput: (input: 'origin' | 'dest' | null) => void;
  originSuggestions: LocationSuggestion[];
  destSuggestions: LocationSuggestion[];
  onSelectOriginSuggestion: (sug: LocationSuggestion) => void;
  onSelectDestSuggestion: (sug: LocationSuggestion) => void;
  onUseCurrentLocationGPS?: () => void;
}

export const LocationSearchCard: React.FC<LocationSearchCardProps> = ({
  origin,
  destination,
  onOriginChange,
  onDestChange,
  onSwap,
  activeInput,
  setActiveInput,
  originSuggestions,
  destSuggestions,
  onSelectOriginSuggestion,
  onSelectDestSuggestion,
  onUseCurrentLocationGPS
}) => {
  return (
    <div className="relative z-30 px-3.5 pt-3 pb-2 bg-gradient-to-b from-slate-50 to-white dark:from-[#091222] dark:to-[#070E1A] transition-colors duration-300">
      {/* Outer Floating Rounded Card */}
      <div className="bg-white dark:bg-[#0B1527] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] p-3 transition-all">
        <div className="flex items-center justify-between gap-2.5">
          {/* Inputs Column */}
          <div className="flex-1 space-y-2 relative">
            {/* Origin Row */}
            <div className="relative flex items-center gap-2.5">
              {/* Green Origin Indicator */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 ring-2 ring-emerald-500/25 shadow-xs flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white" />
                </div>
              </div>

              {/* Origin Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => onOriginChange(e.target.value)}
                  onFocus={() => setActiveInput('origin')}
                  className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 truncate"
                  placeholder="Starting Location (e.g. Pune, Shimla)"
                />
                <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  Pickup / Starting Point
                </div>
              </div>

              {/* Right Action Icons for Origin */}
              <div className="flex items-center gap-1 shrink-0">
                {origin && (
                  <button
                    onClick={() => onOriginChange('')}
                    className="p-1 text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 rounded-md transition-colors"
                    title="Clear Origin"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                {onUseCurrentLocationGPS && (
                  <button
                    onClick={onUseCurrentLocationGPS}
                    className="p-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                    title="Use Current GPS Location"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Origin Autocomplete Dropdown */}
            {activeInput === 'origin' && originSuggestions.length > 0 && (
              <div className="absolute top-10 left-0 right-0 z-50 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-1.5 space-y-0.5 divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto">
                {originSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectOriginSuggestion(sug)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-emerald-50/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors group"
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold text-slate-900 dark:text-white block group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {sug.shortName}
                      </span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {sug.displayName}
                      </span>
                    </div>
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* Visual Dotted Track Separator */}
            <div className="pl-[5px] -my-1 flex items-center">
              <div className="w-0.5 h-3 border-l-2 border-dotted border-slate-300 dark:border-slate-700" />
            </div>

            {/* Destination Row */}
            <div className="relative flex items-center gap-2.5">
              {/* Red Destination Pin Indicator */}
              <div className="flex flex-col items-center justify-center shrink-0">
                <div className="w-3.5 h-3.5 rounded-sm bg-rose-500 border-2 border-white dark:border-slate-900 ring-2 ring-rose-500/25 shadow-xs flex items-center justify-center">
                  <div className="w-1 h-1 rounded-sm bg-white" />
                </div>
              </div>

              {/* Destination Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => onDestChange(e.target.value)}
                  onFocus={() => setActiveInput('dest')}
                  className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 truncate"
                  placeholder="Where to? (e.g. Talegaon, Manali, Mumbai)"
                />
                <div className="text-[9px] text-rose-500 dark:text-rose-400 font-semibold uppercase tracking-wider">
                  Dropoff Destination
                </div>
              </div>

              {/* Clear button for destination */}
              {destination && (
                <button
                  onClick={() => onDestChange('')}
                  className="p-1 text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300 rounded-md transition-colors shrink-0"
                  title="Clear Destination"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Destination Autocomplete Dropdown */}
            {activeInput === 'dest' && destSuggestions.length > 0 && (
              <div className="absolute top-20 left-0 right-0 z-50 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-1.5 space-y-0.5 divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto">
                {destSuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectDestSuggestion(sug)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-rose-50/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors group"
                  >
                    <div className="truncate pr-2">
                      <span className="font-bold text-slate-900 dark:text-white block group-hover:text-rose-600 dark:group-hover:text-rose-400">
                        {sug.shortName}
                      </span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {sug.displayName}
                      </span>
                    </div>
                    <MapPin className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Swap Origin & Destination Button */}
          <button
            onClick={onSwap}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 shadow-xs transition-all active:scale-95 flex flex-col items-center justify-center gap-0.5 shrink-0"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="text-[9px] font-bold">Swap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
