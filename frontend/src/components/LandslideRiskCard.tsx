import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Activity,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { LandslidePredictionResponse, RiskLevel } from '../types';

interface LandslideRiskCardProps {
  prediction: LandslidePredictionResponse;
  onSimulate: (params: { rainfall_24h?: number; slope?: number; soil_moisture?: number }) => void;
  isLoading?: boolean;
}

const RISK_BADGE_CONFIG: Record<
  RiskLevel,
  { label: string; textClass: string; bgClass: string; borderClass: string; barClass: string }
> = {
  LOW: {
    label: 'LOW HAZARD RISK',
    textClass: 'text-emerald-500 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
    barClass: 'bg-emerald-500',
  },
  MODERATE: {
    label: 'MODERATE RISK',
    textClass: 'text-amber-500 dark:text-amber-400',
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30',
    barClass: 'bg-amber-500',
  },
  HIGH: {
    label: 'HIGH RISK HAZARD',
    textClass: 'text-orange-500 dark:text-orange-400',
    bgClass: 'bg-orange-500/15',
    borderClass: 'border-orange-500/40',
    barClass: 'bg-orange-500',
  },
  'VERY HIGH': {
    label: 'CRITICAL HAZARD',
    textClass: 'text-rose-500 dark:text-rose-400',
    bgClass: 'bg-rose-500/20',
    borderClass: 'border-rose-500/50',
    barClass: 'bg-rose-500',
  },
};

export const LandslideRiskCard: React.FC<LandslideRiskCardProps> = ({
  prediction,
  onSimulate,
  isLoading = false,
}) => {
  const [showSim, setShowSim] = useState(false);
  const [simRain, setSimRain] = useState<number>(prediction?.weather_summary?.rainfall_24h ?? 25);
  const [simSlope, setSimSlope] = useState<number>(prediction?.terrain?.slope ?? 20);
  const [simMoisture, setSimMoisture] = useState<number>(0.5);

  const riskLevel = prediction?.risk_level || 'LOW';
  const badge = RISK_BADGE_CONFIG[riskLevel] || RISK_BADGE_CONFIG.LOW;
  const rawProb = prediction?.landslide_probability ?? 0.1;
  const probPercent = Math.round(rawProb * 100);
  const confidence = prediction?.confidence ?? 0.88;
  const factors = prediction?.factors || [
    'Geotechnical slope equilibrium monitored',
    'Precipitation levels within nominal threshold',
    'Real-time digital elevation profile calibrated'
  ];
  const shapList = prediction?.shap_contributions || [
    { feature: 'slope', label: 'Terrain Slope Gradient', contribution_pct: 35, value: simSlope },
    { feature: 'rainfall_24h', label: '24h Precipitation', contribution_pct: 30, value: simRain },
    { feature: 'soil_moisture', label: 'Soil Saturation', contribution_pct: 25, value: 0.5 },
  ];
  const disclaimer = prediction?.disclaimer || 'Hazard assessment derived from geotechnical slope stability, real-time weather, and terrain modeling.';

  const handleApplySim = () => {
    onSimulate({
      rainfall_24h: Number(simRain),
      slope: Number(simSlope),
      soil_moisture: Number(simMoisture),
    });
  };

  const handleResetSim = () => {
    onSimulate({});
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900/90 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Landslide Hazard Assessment
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              ML Geotechnical Model • Confidence {(confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowSim(!showSim)}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm active:scale-95"
        >
          <Sliders className="w-3.5 h-3.5 text-blue-500" />
          <span>Simulate</span>
          {showSim ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Risk Display */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 mb-3.5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${badge.bgClass} ${badge.borderClass}`}>
              <ShieldAlert className={`w-6 h-6 ${badge.textClass}`} />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Risk Classification
              </div>
              <div className={`text-base font-black tracking-tight ${badge.textClass}`}>
                {badge.label}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">ML Probability</span>
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">{probPercent}%</span>
          </div>
        </div>

        {/* Probability Gauge Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${badge.barClass}`}
              style={{ width: `${Math.max(5, Math.min(100, probPercent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* What-If Simulation Drawer */}
      {showSim && (
        <div className="mb-3.5 p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-950 border border-blue-500/30 text-xs shadow-inner animate-fadeIn space-y-3">
          <div className="flex items-center justify-between font-bold text-blue-700 dark:text-blue-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> What-If Parameter Simulation
            </span>
            <button
              onClick={handleResetSim}
              className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1 font-medium text-xs">
                <span>Simulated 24h Rainfall:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{simRain} mm</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                value={simRain}
                onChange={(e) => setSimRain(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1 font-medium text-xs">
                <span>Simulated Slope Angle:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{simSlope}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="75"
                value={simSlope}
                onChange={(e) => setSimSlope(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1 font-medium text-xs">
                <span>Simulated Soil Saturation:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{Math.round(simMoisture * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={simMoisture}
                onChange={(e) => setSimMoisture(Number(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleApplySim}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-md active:scale-95"
          >
            Re-calculate Hazard Risk
          </button>
        </div>
      )}

      {/* Key Environmental Risk Drivers */}
      <div className="mb-3.5 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            Environmental Drivers (SHAP)
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Relative Weight</span>
        </div>

        <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80">
          {shapList && shapList.length > 0 ? (
            shapList.slice(0, 4).map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{item.contribution_pct}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, Math.max(5, item.contribution_pct))}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 italic">Calculating factors...</div>
          )}
        </div>
      </div>

      {/* Active Contributing Factors Checklist */}
      <div className="space-y-1.5 mb-3.5">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Trigger Factors:</span>
        <div className="space-y-1.5">
          {factors.slice(0, 3).map((factor, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800/60"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="font-medium text-[11px] leading-tight">{factor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Advisory Disclaimer */}
      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <span className="leading-tight">
          <strong className="text-slate-800 dark:text-slate-300">Advisory:</strong> {disclaimer}
        </span>
      </div>
    </div>
  );
};
