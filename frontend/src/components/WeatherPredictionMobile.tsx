import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  RefreshCw,
  Bookmark,
  Sun,
  Moon,
  Mountain,
  CloudRain,
  Activity,
  Layers,
  Sliders,
  ChevronRight,
  TrendingUp,
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  ShieldAlert,
  Clock,
  Navigation,
  Bell,
  AlertTriangle,
  Info,
  Sparkles
} from 'lucide-react';
import { InteractiveMap } from '../map/InteractiveMap';
import { WeatherCard } from './WeatherCard';
import { LandslideRiskCard } from './LandslideRiskCard';
import { RiskTimeline } from './RiskTimeline';
import { WeatherCharts } from './WeatherCharts';
import { AlertBanner } from './AlertBanner';
import { LocationSearchBar } from './LocationSearchBar';
import { ErrorBoundary } from './ErrorBoundary';
import { useTheme } from '../context/ThemeContext';
import {
  WeatherForecastResponse,
  LandslidePredictionResponse,
  RiskMapResponse,
  PredictionTimelineResponse,
  AlertItem
} from '../types';

export type PredictionViewTab = 'overview' | 'weather' | 'landslide' | 'map' | 'charts';

interface WeatherPredictionMobileProps {
  currentLat: number;
  currentLon: number;
  locationName: string;
  weatherData: WeatherForecastResponse | null;
  predictionData: LandslidePredictionResponse | null;
  riskMapData: RiskMapResponse | null;
  timelineData: PredictionTimelineResponse | null;
  alerts: AlertItem[];
  isLoading: boolean;
  initialTab?: PredictionViewTab;
  onBackToNavigation: () => void;
  onSelectCoordinates: (lat: number, lon: number, name?: string) => void;
  onSimulate: (params: { rainfall_24h?: number; slope?: number; soil_moisture?: number }) => void;
  onRefresh: () => void;
  onOpenSavedLocations: () => void;
}

export const WeatherPredictionMobile: React.FC<WeatherPredictionMobileProps> = ({
  currentLat,
  currentLon,
  locationName,
  weatherData,
  predictionData,
  riskMapData,
  timelineData,
  alerts,
  isLoading,
  initialTab = 'overview',
  onBackToNavigation,
  onSelectCoordinates,
  onSimulate,
  onRefresh,
  onOpenSavedLocations
}) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<PredictionViewTab>(initialTab);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  // Sync initial tab when changed from props
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const currentRisk = predictionData?.risk_level || 'LOW';
  const probPercent = Math.round((predictionData?.landslide_probability || 0.1) * 100);

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-[#070E1A] text-slate-900 dark:text-slate-100 min-h-[calc(100vh-2rem)] transition-colors duration-300">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER with Location & Quick Utilities */}
      {/* ========================================================================= */}
      <header className="px-4 py-3 bg-white/95 dark:bg-[#091220] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2.5 sticky top-0 z-40 backdrop-blur-md transition-colors duration-300">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            onClick={onBackToNavigation}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 active:scale-95 transition-all shrink-0 flex items-center gap-1.5 text-xs font-bold"
            title="Return to Navigation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Nav</span>
          </button>

          {/* Location selector */}
          <div
            onClick={() => setShowSearchModal(true)}
            className="flex-1 min-w-0 cursor-pointer bg-slate-100 dark:bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400 shrink-0" />
            <div className="text-left truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {locationName.split(',')[0]}
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-normal truncate">
                {currentLat.toFixed(2)}°N, {currentLon.toFixed(2)}°E
              </span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-300 transition-colors active:scale-95"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-300" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>

          {/* Saved Locations */}
          <button
            onClick={onOpenSavedLocations}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-400 relative active:scale-95 transition-colors"
            title="Saved Locations"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 active:scale-95 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CRISP TOP NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="px-3 py-2 bg-slate-50 dark:bg-[#070E1A] border-b border-slate-200 dark:border-slate-800/80 sticky top-[57px] z-30 backdrop-blur-md">
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-200/80 dark:bg-[#0B1526] border border-slate-300/80 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('weather')}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'weather'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Weather</span>
          </button>

          <button
            onClick={() => setActiveTab('landslide')}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'landslide'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Landslide</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GIS Map</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN SPACIOUS CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 p-3.5 sm:p-4 space-y-4 overflow-y-auto pb-4 max-w-4xl mx-auto w-full">
        {/* Safety Alert Banner */}
        {predictionData && !isAlertDismissed && (
          <AlertBanner
            locationName={locationName}
            riskLevel={predictionData.risk_level}
            probability={predictionData.landslide_probability}
            factors={predictionData.factors}
            disclaimer={predictionData.disclaimer}
            onDismiss={() => setIsAlertDismissed(true)}
          />
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* VIEW 1: CLEAN & SPACIOUS OVERVIEW DASHBOARD */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Hero Live Status Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#0B1526] dark:via-[#0D1B32] dark:to-[#091220] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Current Atmospheric Condition
                  </span>
                  <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5 capitalize">
                    {weatherData?.current.weather_description || 'Clear conditions'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                    {weatherData ? `${weatherData.current.temperature.toFixed(1)}°C` : '--'}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">Ambient Temperature</span>
                </div>
              </div>

              {/* Hazard Risk Banner in Hero */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${
                    currentRisk === 'VERY HIGH'
                      ? 'bg-rose-500/15 text-rose-500'
                      : currentRisk === 'HIGH'
                      ? 'bg-orange-500/15 text-orange-500'
                      : currentRisk === 'MODERATE'
                      ? 'bg-amber-500/15 text-amber-500'
                      : 'bg-emerald-500/15 text-emerald-500'
                  }`}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      Landslide Risk Status
                    </div>
                    <div className={`text-sm font-black ${
                      currentRisk === 'VERY HIGH'
                        ? 'text-rose-600 dark:text-rose-400'
                        : currentRisk === 'HIGH'
                        ? 'text-orange-600 dark:text-orange-400'
                        : currentRisk === 'MODERATE'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {currentRisk} RISK ({probPercent}%)
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('landslide')}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1 active:scale-95"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4 Clean Key Driver Metric Cards (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                  <span>24h Rainfall</span>
                  <CloudRain className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-xl font-black font-mono text-blue-600 dark:text-blue-400">
                  {weatherData ? `${weatherData.current.rainfall_24h.toFixed(1)} mm` : '0 mm'}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Accumulated volume</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                  <span>Terrain Slope</span>
                  <Gauge className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                  {predictionData?.terrain?.slope || 18}°
                </div>
                <span className="text-[10px] text-slate-400 mt-1">DEM Slope gradient</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                  <span>Soil Moisture</span>
                  <Layers className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">
                  {weatherData ? `${(weatherData.current.soil_moisture * 100).toFixed(0)}%` : '35%'}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Subsurface saturation</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">
                  <span>Wind Velocity</span>
                  <Wind className="w-4 h-4 text-teal-500" />
                </div>
                <div className="text-xl font-black font-mono text-slate-900 dark:text-white">
                  {weatherData ? `${weatherData.current.wind_speed.toFixed(1)} km/h` : '12 km/h'}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Gust speed</span>
              </div>
            </div>

            {/* Quick Action Navigation Cards */}
            <div className="space-y-2.5">
              <div
                onClick={() => setActiveTab('weather')}
                className="p-4 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 shadow-sm cursor-pointer transition-all flex items-center justify-between group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                    <CloudRain className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Inspect Detailed Weather &amp; 24h Hourly Charts
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Precipitation, temperature curves, humidity, and 7-day outlook
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>

              <div
                onClick={() => setActiveTab('landslide')}
                className="p-4 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 shadow-sm cursor-pointer transition-all flex items-center justify-between group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <Mountain className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Assess Landslide Risk &amp; SHAP Factor Drivers
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Geotechnical model, 72h risk trajectory, and What-If simulation
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* VIEW 2: DEDICATED WEATHER FORECAST TAB */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'weather' && (
          <ErrorBoundary fallbackTitle="Weather Forecasting Module" onReset={onRefresh} onNavigateHome={onBackToNavigation}>
            <div className="space-y-4 animate-fadeIn">
              {weatherData ? (
                <>
                  <WeatherCard weather={weatherData.current} isLoading={isLoading} />
                  <WeatherCharts hourly={weatherData.hourly} daily={weatherData.daily} />
                </>
              ) : isLoading ? (
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                      <CloudRain className="w-5 h-5 animate-bounce" />
                    </div>
                    <div>
                      <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded-md mb-1.5" />
                      <div className="h-3 w-56 bg-slate-100 dark:bg-slate-800 rounded-md" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
                    <div className="h-20 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
                  </div>
                  <div className="h-48 bg-slate-100 dark:bg-slate-800/40 rounded-2xl" />
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                    <CloudRain className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Weather Forecast Synchronizing</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Retrieving high-resolution Open-Meteo meteorological telemetry for {locationName.split(',')[0]}.
                  </p>
                  <button
                    onClick={onRefresh}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                  >
                    Refresh Weather Telemetry
                  </button>
                </div>
              )}
            </div>
          </ErrorBoundary>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* VIEW 3: DEDICATED LANDSLIDE RISK TAB */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'landslide' && (
          <ErrorBoundary fallbackTitle="Landslide Geotechnical Module" onReset={onRefresh} onNavigateHome={onBackToNavigation}>
            <div className="space-y-4 animate-fadeIn">
              {predictionData ? (
                <>
                  <LandslideRiskCard
                    prediction={predictionData}
                    onSimulate={onSimulate}
                    isLoading={isLoading}
                  />

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white px-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>72-Hour Risk Trajectory Under Current Forecast</span>
                    </h4>
                    <RiskTimeline timeline={timelineData?.timeline || []} isLoading={isLoading} />
                  </div>
                </>
              ) : isLoading ? (
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1526] border border-amber-500/30 shadow-xl space-y-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
                      <Mountain className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="h-4 w-44 bg-slate-200 dark:bg-slate-700 rounded-md mb-1.5" />
                      <div className="h-3 w-60 bg-slate-100 dark:bg-slate-800 rounded-md" />
                    </div>
                  </div>
                  <div className="h-28 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
                  <div className="h-36 bg-slate-100 dark:bg-slate-800/40 rounded-2xl" />
                  <div className="text-center text-xs text-amber-600 dark:text-amber-400 font-mono font-semibold">
                    Calculating multi-factor geotechnical slope stability...
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                    <Mountain className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Geotechnical Risk Analysis</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Evaluate digital elevation slope angles, soil saturation profiles, and precipitation triggers.
                  </p>
                  <button
                    onClick={onRefresh}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-md active:scale-95"
                  >
                    Run Geotechnical Analysis
                  </button>
                </div>
              )}
            </div>
          </ErrorBoundary>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* VIEW 4: SPATIAL HAZARD MAP */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'map' && (
          <ErrorBoundary fallbackTitle="Spatial Hazard GIS Map" onReset={onRefresh} onNavigateHome={onBackToNavigation}>
            <div className="space-y-3 animate-fadeIn">
              <div className="h-[440px] sm:h-[500px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
                <InteractiveMap
                  latitude={currentLat}
                  longitude={currentLon}
                  riskLevel={predictionData?.risk_level || 'LOW'}
                  landslideProbability={predictionData?.landslide_probability || 0.1}
                  gridPoints={riskMapData?.grid_points || []}
                  onSelectLocation={onSelectCoordinates}
                  isLoading={isLoading}
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0B1526] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span>Elevation: <strong>{predictionData?.terrain?.elevation || 350}m</strong></span>
                  <span>Slope: <strong>{predictionData?.terrain?.slope || 15}°</strong></span>
                </div>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  GIS GRID ACTIVE
                </span>
              </div>
            </div>
          </ErrorBoundary>
        )}

        {/* ------------------------------------------------------------------------- */}
        {/* VIEW 5: DEDICATED CHARTS TAB (FALLBACK/EXPANDED) */}
        {/* ------------------------------------------------------------------------- */}
        {activeTab === 'charts' && (
          <ErrorBoundary fallbackTitle="Forecasting Charts" onReset={onRefresh} onNavigateHome={onBackToNavigation}>
            <div className="space-y-4 animate-fadeIn">
              {weatherData && (
                <WeatherCharts hourly={weatherData.hourly} daily={weatherData.daily} />
              )}
              <RiskTimeline timeline={timelineData?.timeline || []} isLoading={isLoading} />
            </div>
          </ErrorBoundary>
        )}
      </main>

      {/* Search Modal */}
      {showSearchModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md flex items-start justify-center p-4 pt-10 sm:pt-16"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-2xl transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Search Corridors &amp; Locations</span>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
            <LocationSearchBar
              onSelectCoordinates={(lat, lon, name) => {
                onSelectCoordinates(lat, lon, name);
                setShowSearchModal(false);
              }}
              currentLat={currentLat}
              currentLon={currentLon}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BOTTOM NAVIGATION BAR */}
      {/* ========================================================================= */}
      <nav className="px-3 py-2 bg-white dark:bg-[#060C16] border-t border-slate-200 dark:border-slate-800/80 sticky bottom-0 z-40 transition-colors duration-300">
        <div className="flex items-center justify-around relative max-w-md mx-auto">
          {/* Back to Navigation */}
          <button
            onClick={onBackToNavigation}
            className="flex flex-col items-center gap-1 py-1 px-3 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Navigation className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Nav View</span>
          </button>

          {/* Weather Prediction Tab */}
          <button
            onClick={() => setActiveTab('weather')}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-all relative ${
              activeTab === 'weather'
                ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600'
            }`}
          >
            <CloudRain className="w-5 h-5" />
            <span className="text-[10px] font-medium">Weather</span>
          </button>

          {/* Landslide Risk Tab */}
          <button
            onClick={() => setActiveTab('landslide')}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-all relative ${
              activeTab === 'landslide'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-amber-600'
            }`}
          >
            <Mountain className="w-5 h-5" />
            <span className="text-[10px] font-medium">Landslide</span>
          </button>

          {/* Spatial Map Tab */}
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
              activeTab === 'map'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-5 h-5" />
            <span className="text-[10px] font-medium">GIS Map</span>
          </button>
        </div>
      </nav>
    </div>
  );
};
