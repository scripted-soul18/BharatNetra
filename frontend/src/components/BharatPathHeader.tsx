import React, { useState } from 'react';
import {
  Menu,
  Moon,
  Sun,
  Bot,
  Sliders,
  AlertOctagon,
  CloudRain,
  ChevronRight,
  Navigation,
  Sparkles,
  MapPin,
  X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BharatPathHeaderProps {
  user: { name: string; role: string; emailOrPhone: string } | null;
  alertCount: number;
  onOpenCopilot: () => void;
  onOpenRouteComparison: () => void;
  onOpenWeatherPrediction: (tab?: 'overview' | 'weather' | 'landslide' | 'map' | 'charts') => void;
  onOpenGroundReport: () => void;
  onOpenProfile: () => void;
  onPresetSelect: (origin: string, destination: string) => void;
  onLogout: () => void;
}

export const BharatPathHeader: React.FC<BharatPathHeaderProps> = ({
  user,
  alertCount,
  onOpenCopilot,
  onOpenRouteComparison,
  onOpenWeatherPrediction,
  onOpenGroundReport,
  onOpenProfile,
  onPresetSelect,
  onLogout
}) => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="px-3.5 pt-3 pb-2.5 flex flex-col border-b border-slate-100 dark:border-slate-800/60 bg-white/95 dark:bg-[#070E1A]/95 backdrop-blur-md sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center justify-between">
        {/* Left: Hamburger & BharatPath Branding */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"
            title="Menu & Corridors"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Bharat Netra Brand */}
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/25">
              <Navigation className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="font-extrabold text-[15px] tracking-tight text-slate-900 dark:text-white">
                  Bharat
                </span>
                <span className="font-extrabold text-[15px] tracking-tight text-emerald-600 dark:text-emerald-400">
                  Netra
                </span>
                <span className="ml-0.5 px-1 py-0.2 rounded text-[8px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                  LIVE
                </span>
              </div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-medium tracking-tight mt-0.5">
                Safe Road Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Utility Actions */}
        <div className="flex items-center gap-1.5">
          {/* AI Copilot */}
          <button
            onClick={onOpenCopilot}
            className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/60 dark:border-slate-800 transition-all shadow-xs active:scale-95"
            title="AI Route & Safety Copilot"
          >
            <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Route Comparison */}
          <button
            onClick={onOpenRouteComparison}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-800 transition-all shadow-xs active:scale-95"
            title="Compare Safe vs Fastest Route"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-300 border border-slate-200/60 dark:border-slate-800 transition-all shadow-xs active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 text-cyan-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>

          {/* Alerts Bell */}
          <button
            onClick={onOpenGroundReport}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 border border-slate-200/60 dark:border-slate-800 relative transition-all shadow-xs active:scale-95"
            title="Report Road Hazard / View Alerts"
          >
            <AlertOctagon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center animate-pulse">
                {alertCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hamburger Dropdown Menu */}
      {isMenuOpen && (
        <div className="mt-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-3 animate-fadeIn shadow-xl z-50">
          {/* User Profile Bar */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {user?.name || 'Commercial Driver'}
                </div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {user?.role || 'Authorized Navigator'}
                </div>
              </div>
            </div>
            <button
              onClick={() => { setIsMenuOpen(false); onOpenProfile(); }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Settings
            </button>
          </div>

          {/* Weather & Hazard Intelligence Link */}
          <button
            onClick={() => { setIsMenuOpen(false); onOpenWeatherPrediction('overview'); }}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-teal-500/10 hover:from-blue-500/20 hover:to-teal-500/20 border border-blue-500/25 text-slate-800 dark:text-slate-100 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-blue-500 text-white shadow-sm">
                <CloudRain className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Weather &amp; Landslide Intelligence
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Live Radar • ML Risk Models • GIS Forecast
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Popular Corridors */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Quick Highway Corridors
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => { onPresetSelect('Pune', 'Talegaon'); setIsMenuOpen(false); }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs text-left truncate transition-colors border border-slate-200/60 dark:border-slate-700/60 font-medium"
              >
                Pune ⇄ Talegaon (NH 48)
              </button>
              <button
                onClick={() => { onPresetSelect('Shimla', 'Manali'); setIsMenuOpen(false); }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs text-left truncate transition-colors border border-slate-200/60 dark:border-slate-700/60 font-medium"
              >
                Shimla ⇄ Manali (NH 5)
              </button>
              <button
                onClick={() => { onPresetSelect('Mumbai', 'Pune'); setIsMenuOpen(false); }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs text-left truncate transition-colors border border-slate-200/60 dark:border-slate-700/60 font-medium"
              >
                Mumbai ⇄ Pune Expressway
              </button>
              <button
                onClick={() => { onPresetSelect('Dehradun', 'Mussoorie'); setIsMenuOpen(false); }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 text-xs text-left truncate transition-colors border border-slate-200/60 dark:border-slate-700/60 font-medium"
              >
                Dehradun ⇄ Mussoorie
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
