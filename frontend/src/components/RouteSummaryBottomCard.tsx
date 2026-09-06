import React from 'react';
import {
  Shield,
  ShieldAlert,
  Navigation,
  CloudRain,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  AlertTriangle,
  Info,
  Clock,
  Compass
} from 'lucide-react';
import { SafeRouteOption } from '../services/safeRouteEngine';
import { WeatherForecastResponse, LandslidePredictionResponse } from '../types';

interface RouteSummaryBottomCardProps {
  activeRoute: SafeRouteOption | null;
  selectedRouteType: 'safe' | 'alternate';
  onToggleRouteType: (type: 'safe' | 'alternate') => void;
  isJourneyStarted: boolean;
  onToggleJourney: () => void;
  onOpenWeatherPrediction: () => void;
  weatherData: WeatherForecastResponse | null;
  predictionData: LandslidePredictionResponse | null;
}

export const RouteSummaryBottomCard: React.FC<RouteSummaryBottomCardProps> = ({
  activeRoute,
  selectedRouteType,
  onToggleRouteType,
  isJourneyStarted,
  onToggleJourney,
  onOpenWeatherPrediction,
  weatherData,
  predictionData
}) => {
  const [isMuted, setIsMuted] = React.useState(false);

  // If Live Navigation is Active, show the Guidance Turn-by-Turn HUD
  if (isJourneyStarted) {
    return (
      <div className="px-3.5 py-3 bg-white dark:bg-[#08101C] border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] space-y-2.5 animate-fadeIn z-30 transition-colors duration-300">
        {/* Active Navigation HUD Banner */}
        <div className="bg-emerald-600 dark:bg-emerald-700 text-white p-3.5 rounded-2xl shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
              <Navigation className="w-6 h-6 fill-white text-white transform -rotate-45" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-emerald-100 flex items-center gap-1.5 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                Live Guidance Active
              </div>
              <div className="text-sm font-extrabold leading-tight">
                In 450 m, Keep Right on {activeRoute?.highway || 'Expressway'}
              </div>
            </div>
          </div>

          {/* Voice Mute & Sound Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all active:scale-95"
            title={isMuted ? 'Unmute Voice Guidance' : 'Mute Voice Guidance'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Speedometer, Time Remaining & Stop Controls */}
        <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* Speed & ETA */}
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">Speed</div>
              <div className="text-base font-black text-slate-900 dark:text-white font-mono">
                54 <span className="text-xs font-medium text-slate-500">km/h</span>
              </div>
            </div>
            <div className="w-px h-7 bg-slate-200 dark:bg-slate-800" />
            <div>
              <div className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">Remaining</div>
              <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {activeRoute?.durationMin || 32} <span className="text-xs font-normal">min</span>
                <span className="text-xs font-normal text-slate-400 ml-1">({activeRoute?.distanceKm || 34.5} km)</span>
              </div>
            </div>
          </div>

          {/* Stop / End Navigation Button */}
          <button
            onClick={onToggleJourney}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 active:scale-95 transition-all"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>End</span>
          </button>
        </div>
      </div>
    );
  }

  // Standard Route Overview Card
  return (
    <div className="px-3.5 pt-2.5 pb-2 bg-white dark:bg-[#070E1A] border-t border-slate-200/80 dark:border-slate-800/80 space-y-2.5 z-30 transition-colors duration-300">
      {/* Route Card with START Button */}
      <div className="flex items-center justify-between gap-3 bg-slate-50/90 dark:bg-[#0C1728] p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
        {/* Left: Shield & Route Stats */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100/90 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 shadow-xs">
            <Shield className="w-6 h-6 fill-emerald-500/20 stroke-emerald-600 dark:stroke-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                {selectedRouteType === 'safe' ? 'Optimal Safe Route' : 'Direct Shortcut'}
              </span>
              {activeRoute && activeRoute.safetyGainPercent > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  +{activeRoute.safetyGainPercent}% Safer
                </span>
              )}
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white font-mono mt-0.5">
              {activeRoute?.durationMin || 35} min{' '}
              <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                • {activeRoute?.distanceKm || 35.1} km
              </span>
            </div>
          </div>
        </div>

        {/* Right: Prominent Green START Navigation Action Button */}
        <button
          onClick={onToggleJourney}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 active:scale-95 transition-all text-center flex flex-col items-center justify-center leading-tight shrink-0 group"
          title="Start Live Guidance Navigation"
        >
          <div className="flex items-center gap-1.5">
            <Navigation className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black">START</span>
          </div>
          <span className="text-[8px] font-medium text-emerald-100 mt-0.5">Live Guidance</span>
        </button>
      </div>

      {/* Weather & Landslide Corridor Intelligence Snippet */}
      <div
        onClick={onOpenWeatherPrediction}
        className="cursor-pointer bg-white hover:bg-slate-50 dark:bg-[#091322] dark:hover:bg-[#0D1A30] p-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 transition-all shadow-xs group flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shrink-0">
            <CloudRain className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {weatherData ? `${weatherData.current.weather_description || 'Clear'} • ${Math.round(weatherData.current.temperature)}°C` : '24°C • Clear Weather'}
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                predictionData?.risk_level === 'VERY HIGH' || predictionData?.risk_level === 'HIGH'
                  ? 'bg-rose-500/15 text-rose-600'
                  : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
              }`}>
                {predictionData?.risk_level || 'LOW RISK'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
              {activeRoute?.highway || 'Highway'} Corridor Forecast &amp; Risk ML
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </div>
    </div>
  );
};
