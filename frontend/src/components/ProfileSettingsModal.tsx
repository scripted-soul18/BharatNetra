import React, { useState } from 'react';
import {
  User,
  Shield,
  Car,
  Bike,
  Truck,
  Globe,
  Moon,
  Sun,
  LogOut,
  X,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { VehicleType } from '../services/safeRouteEngine';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; role: string; emailOrPhone: string; language?: string; vehicle?: string } | null;
  onUpdatePreferences: (prefs: { language: string; vehicle: VehicleType }) => void;
  onLogout: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdatePreferences,
  onLogout
}) => {
  const { theme, toggleTheme } = useTheme();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(
    (user?.vehicle as VehicleType) || 'car'
  );
  const [selectedLang, setSelectedLang] = useState<string>(user?.language || 'en');

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdatePreferences({ language: selectedLang, vehicle: selectedVehicle });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-2xl transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Navigator Profile</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Bharat Netra Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white">{user?.name || 'Authorized Driver'}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{user?.role || 'Citizen Navigator'}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{user?.emailOrPhone || 'driver@bharatnetra.gov.in'}</div>
          </div>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Shield className="w-4 h-4" />
          </div>
        </div>

        {/* Vehicle Preference */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Default Vehicle Type</label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['car', 'bike', 'truck', 'ambulance'] as VehicleType[]).map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVehicle(v)}
                className={`py-2 px-1.5 rounded-xl border text-[10px] font-bold capitalize flex flex-col items-center gap-1 transition-all ${
                  selectedVehicle === v
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {v === 'car' && <Car className="w-3.5 h-3.5" />}
                {v === 'bike' && <Bike className="w-3.5 h-3.5" />}
                {v === 'truck' && <Truck className="w-3.5 h-3.5" />}
                {v === 'ambulance' && <Truck className="w-3.5 h-3.5 text-rose-500" />}
                <span>{v}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Language / भाषा</label>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'en', label: 'English' },
              { id: 'hi', label: 'हिंदी (Hindi)' },
              { id: 'mr', label: 'मराठी (Marathi)' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
                className={`py-2 px-2 rounded-xl border text-xs font-bold transition-all ${
                  selectedLang === lang.id
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-xs"
          >
            Switch
          </button>
        </div>

        {/* Buttons: Save & Logout */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            Save Preferences
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1 transition-colors"
            title="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
