import React from 'react';
import {
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Layers,
  CloudSun
} from 'lucide-react';
import { CurrentWeather } from '../types';

interface WeatherCardProps {
  weather: CurrentWeather;
  isLoading?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, isLoading = false }) => {
  const temp = weather?.temperature ?? 24.0;
  const rain24 = weather?.rainfall_24h ?? 0.0;
  const rain1 = weather?.rainfall_1h ?? 0.0;
  const rain7d = weather?.rainfall_7d ?? 0.0;
  const humidity = weather?.humidity ?? 60;
  const windSpeed = weather?.wind_speed ?? 12.0;
  const windDir = weather?.wind_direction ?? 180;
  const soilM = weather?.soil_moisture ?? 0.38;
  const desc = weather?.weather_description || 'Clear sky';

  return (
    <div className="w-full bg-white dark:bg-slate-900/90 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Live Weather Conditions</h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium capitalize">
              {desc}
            </span>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-bold font-mono">
          {temp.toFixed(1)}°C
        </span>
      </div>

      {/* Main Temperature & 24h Rainfall Highlights */}
      <div className="grid grid-cols-2 gap-3 mb-3.5">
        {/* Temperature */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/70 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-medium mb-1">
            <span>Ambient Temp</span>
            <Thermometer className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">
            {temp.toFixed(1)}°C
          </div>
        </div>

        {/* 24h Rainfall */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/70 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-medium mb-1">
            <span>24h Rainfall</span>
            <CloudRain className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
            {rain24.toFixed(1)} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">mm</span>
          </div>
        </div>
      </div>

      {/* Clean 2x2 Sub-grid of detailed environmental metrics */}
      <div className="grid grid-cols-2 gap-3">
        {/* Rainfall Windows */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span>Rainfall Rate</span>
          </div>
          <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
            {rain1.toFixed(1)} mm <span className="text-[10px] text-slate-500 font-normal">/ 1h</span>
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            7-day: {rain7d.toFixed(1)} mm
          </span>
        </div>

        {/* Humidity */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <Droplets className="w-3.5 h-3.5 text-cyan-500" />
            <span>Relative Humidity</span>
          </div>
          <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
            {humidity.toFixed(0)}%
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">Atmospheric</span>
        </div>

        {/* Wind */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <Wind className="w-3.5 h-3.5 text-teal-500" />
            <span>Wind Speed</span>
          </div>
          <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200">
            {windSpeed.toFixed(1)} km/h
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1">
            <Compass className="w-3 h-3 text-slate-400" /> Direction: {windDir.toFixed(0)}°
          </span>
        </div>

        {/* Soil Moisture */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Soil Moisture</span>
          </div>
          <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
            {(soilM * 100).toFixed(0)}% Saturation
          </span>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                soilM > 0.65
                  ? 'bg-rose-500'
                  : soilM > 0.45
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, soilM * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
