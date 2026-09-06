import React from 'react';
import {
  Navigation,
  Sliders,
  Bookmark,
  ShieldAlert,
  Car,
  Bike,
  Truck,
  Sparkles
} from 'lucide-react';
import { VehicleType } from '../services/safeRouteEngine';

interface QuickActionButtonsProps {
  onNavigateClick: () => void;
  onRouteClick: () => void;
  onSavedClick: () => void;
  onEmergencyClick: () => void;
  selectedVehicle: VehicleType;
  onSelectVehicle: (vehicle: VehicleType) => void;
  isNavigatingActive?: boolean;
}

export const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({
  onNavigateClick,
  onRouteClick,
  onSavedClick,
  onEmergencyClick,
  selectedVehicle,
  onSelectVehicle,
  isNavigatingActive = false
}) => {
  return (
    <div className="px-3.5 pt-1 pb-2 space-y-2 bg-white dark:bg-[#070E1A] transition-colors duration-300">
      {/* 4 Main Action Cards Row */}
      <div className="grid grid-cols-4 gap-2">
        {/* 1. Navigate */}
        <button
          onClick={onNavigateClick}
          className={`p-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs group ${
            isNavigatingActive
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/25'
              : 'bg-slate-50 hover:bg-emerald-50 dark:bg-slate-900/90 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300'
          }`}
          title="Start Live Guidance / Navigation"
        >
          <div className={`p-1.5 rounded-xl transition-all ${
            isNavigatingActive
              ? 'bg-white/20 text-white'
              : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 group-hover:scale-110'
          }`}>
            <Navigation className="w-4 h-4 fill-current" />
          </div>
          <span className="text-[11px] font-bold tracking-tight">
            {isNavigatingActive ? 'Active' : 'Navigate'}
          </span>
        </button>

        {/* 2. Route (Comparison) */}
        <button
          onClick={onRouteClick}
          className="p-2 rounded-2xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs group"
          title="Compare Safe Route vs Fast Shortcut"
        >
          <div className="p-1.5 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-all">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold tracking-tight">Route</span>
        </button>

        {/* 3. Saved Locations */}
        <button
          onClick={onSavedClick}
          className="p-2 rounded-2xl bg-slate-50 hover:bg-amber-50 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-300 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs group"
          title="Saved Bookmarks & Trips History"
        >
          <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-all">
            <Bookmark className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold tracking-tight">Saved</span>
        </button>

        {/* 4. Emergency / SOS */}
        <button
          onClick={onEmergencyClick}
          className="p-2 rounded-2xl bg-slate-50 hover:bg-rose-50 dark:bg-slate-900/90 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-300 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs group"
          title="Emergency Shelters & Road Hazard SOS"
        >
          <div className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-all">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold tracking-tight">Emergency</span>
        </button>
      </div>

      {/* Vehicle Type Pill Row */}
      <div className="flex items-center justify-between gap-1.5 bg-slate-100/80 dark:bg-slate-900/60 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800">
        {/* Car */}
        <button
          onClick={() => onSelectVehicle('car')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            selectedVehicle === 'car'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Car</span>
        </button>

        {/* Bike */}
        <button
          onClick={() => onSelectVehicle('bike')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            selectedVehicle === 'bike'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Bike className="w-3.5 h-3.5" />
          <span>Bike</span>
        </button>

        {/* Truck */}
        <button
          onClick={() => onSelectVehicle('truck')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            selectedVehicle === 'truck'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Truck</span>
        </button>

        {/* Ambulance */}
        <button
          onClick={() => onSelectVehicle('ambulance')}
          className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            selectedVehicle === 'ambulance'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Truck className="w-3.5 h-3.5 text-rose-500" />
            <span className="absolute -top-1 -right-1 text-[7px] text-rose-600 font-extrabold">+</span>
          </div>
          <span>Ambulance</span>
        </button>
      </div>
    </div>
  );
};
