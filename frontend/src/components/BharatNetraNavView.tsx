import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useTheme } from '../context/ThemeContext';
import { WeatherForecastResponse, LandslidePredictionResponse } from '../types';
import {
  safeRouteEngine,
  VehicleType,
  SafeRouteAnalysisResult,
  LocationSuggestion,
  Coordinate
} from '../services/safeRouteEngine';
import {
  generateMultiRouteEvaluation,
  EvaluatedRouteOption
} from '../engine/SafeRouteEngine';
import { HazardIncident, HazardRegistry } from '../engine/HazardRegistry';
import { searchLocationsPanIndia } from '../engine/GeocodingService';
import { BharatPathHeader } from './BharatPathHeader';
import { LocationSearchCard } from './LocationSearchCard';
import { QuickActionButtons } from './QuickActionButtons';
import { MapControls, MapTileType } from './MapControls';
import { RouteSummaryBottomCard } from './RouteSummaryBottomCard';
import { BottomNavBar, MainNavTab } from './BottomNavBar';
import { NotificationToast, ToastMessage } from './NotificationToast';
import { HazardAdvisoryModal } from './HazardAdvisoryModal';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { RouteComparisonPanel } from './RouteComparisonPanel';
import { GroundReportDrawer } from './GroundReportDrawer';
import { IncidentEvidenceModal } from './IncidentEvidenceModal';
import { AgentChatModal } from './AgentChatModal';
import { NearbyServicesDrawer } from './NearbyServicesDrawer';
import { SavedLocationsDrawer } from './SavedLocationsDrawer';

interface BharatNetraNavViewProps {
  user: { name: string; role: string; emailOrPhone: string; language?: string; vehicle?: string } | null;
  weatherData: WeatherForecastResponse | null;
  predictionData: LandslidePredictionResponse | null;
  onOpenWeatherPrediction: (tab?: 'overview' | 'weather' | 'landslide' | 'map' | 'charts') => void;
  onLogout: () => void;
  onSelectCoordinates?: (lat: number, lon: number, name: string) => void;
  onUpdateUserPreferences?: (prefs: { language: string; vehicle: VehicleType }) => void;
}

export const BharatNetraNavView: React.FC<BharatNetraNavViewProps> = ({
  user,
  weatherData,
  predictionData,
  onOpenWeatherPrediction,
  onLogout,
  onSelectCoordinates,
  onUpdateUserPreferences
}) => {
  const { theme } = useTheme();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(
    (user?.vehicle as VehicleType) || 'truck'
  );
  const [activeBottomTab, setActiveBottomTab] = useState<MainNavTab>('home');

  // Locations state (Default: Pune to Talegaon)
  const [origin, setOrigin] = useState('Pune');
  const [destination, setDestination] = useState('Talegaon');
  const [originCoords, setOriginCoords] = useState<Coordinate>({ lat: 18.5204, lon: 73.8567 });
  const [destCoords, setDestCoords] = useState<Coordinate>({ lat: 18.7297, lon: 73.6749 });

  // Autocomplete search suggestions
  const [originSuggestions, setOriginSuggestions] = useState<LocationSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);
  const [activeInput, setActiveInput] = useState<'origin' | 'dest' | null>(null);

  // Safe Route Analysis & Multi-Route Options
  const [analysisResult, setAnalysisResult] = useState<SafeRouteAnalysisResult | null>(null);
  const [multiRoutes, setMultiRoutes] = useState<EvaluatedRouteOption[]>([]);
  const [selectedMultiRouteId, setSelectedMultiRouteId] = useState<string>('route-safest');
  const [selectedRouteType, setSelectedRouteType] = useState<'safe' | 'alternate'>('safe');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  // Map Tile Type: roadmap, satellite, terrain
  const [currentTileType, setCurrentTileType] = useState<MapTileType>('roadmap');

  // Modals & Drawers
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showRouteComparison, setShowRouteComparison] = useState(false);
  const [showGroundReport, setShowGroundReport] = useState(false);
  const [showAgentChat, setShowAgentChat] = useState(false);
  const [showNearbyServices, setShowNearbyServices] = useState(false);
  const [showSavedLocations, setShowSavedLocations] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedHazardForEvidence, setSelectedHazardForEvidence] = useState<HazardIncident | null>(null);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState<ToastMessage | null>({
    id: 'welcome',
    type: 'success',
    title: 'Bharat Netra Navigation Ready',
    message: 'Calculated optimal hazard-safe route from Pune to Talegaon via NH 48.',
    actionLabel: 'Inspect Safety Score',
    onAction: () => setShowRouteComparison(true)
  });

  // Leaflet Map Refs
  const navMapContainerRef = useRef<HTMLDivElement>(null);
  const navMapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!navMapContainerRef.current || navMapRef.current) return;

    const map = L.map(navMapContainerRef.current, {
      center: [originCoords.lat, originCoords.lon],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      maxZoom: 19
    });

    // Tile Layer based on currentTileType
    const tileUrl =
      currentTileType === 'satellite'
        ? 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        : currentTileType === 'terrain'
        ? 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
        : 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    const tileLayer = L.tileLayer(tileUrl, {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    routeLayerGroupRef.current = L.layerGroup().addTo(map);
    navMapRef.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      navMapRef.current = null;
    };
  }, []);

  // Update Tile Layer when tile type changes
  useEffect(() => {
    if (!navMapRef.current || !tileLayerRef.current) return;

    const tileUrl =
      currentTileType === 'satellite'
        ? 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
        : currentTileType === 'terrain'
        ? 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
        : 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

    tileLayerRef.current.setUrl(tileUrl);
  }, [currentTileType]);

  // 2. Perform Safe Route Analysis
  useEffect(() => {
    let isMounted = true;
    setIsCalculatingRoute(true);

    safeRouteEngine
      .analyzeRoute(
        origin,
        destination,
        selectedVehicle,
        predictionData?.risk_level || 'MODERATE',
        originCoords,
        destCoords
      )
      .then((res) => {
        if (isMounted) {
          setAnalysisResult(res);
          setIsCalculatingRoute(false);

          const evaluated = generateMultiRouteEvaluation(
            originCoords.lat,
            originCoords.lon,
            destCoords.lat,
            destCoords.lon,
            res.recommendedRoute.path
          );
          setMultiRoutes(evaluated);
        }
      })
      .catch((err) => {
        console.error('Failed to compute safe route:', err);
        if (isMounted) setIsCalculatingRoute(false);
      });

    return () => {
      isMounted = false;
    };
  }, [origin, destination, selectedVehicle, originCoords, destCoords, predictionData?.risk_level]);

  // 3. Render Route & Hazard Overlays on Leaflet Map
  useEffect(() => {
    if (!navMapRef.current || !routeLayerGroupRef.current || !analysisResult) return;

    const layerGroup = routeLayerGroupRef.current;
    layerGroup.clearLayers();

    const currentRoute =
      selectedRouteType === 'safe'
        ? analysisResult.recommendedRoute
        : analysisResult.alternateRoutes[0] || analysisResult.recommendedRoute;

    // Draw Alternate Route (dashed amber path)
    if (analysisResult.alternateRoutes.length > 0 && selectedRouteType === 'safe') {
      const altPolyline = L.polyline(analysisResult.alternateRoutes[0].path, {
        color: '#f59e0b',
        weight: 4,
        opacity: 0.55,
        dashArray: '8, 8'
      });
      layerGroup.addLayer(altPolyline);
    }

    // Draw Primary Selected Route (vibrant green with outer halo)
    const routeColor = selectedRouteType === 'safe' ? '#10b981' : '#f59e0b';

    // Outer Glow / Halo line
    const glowPolyline = L.polyline(currentRoute.path, {
      color: routeColor,
      weight: 7,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round'
    });

    // Inner White dashed core
    const innerPolyline = L.polyline(currentRoute.path, {
      color: '#ffffff',
      weight: 2,
      opacity: 0.85,
      dashArray: '6, 6'
    });

    layerGroup.addLayer(glowPolyline);
    layerGroup.addLayer(innerPolyline);

    // Draw Active Hazards from Registry
    const activeHazards = HazardRegistry.getAllHazards();
    activeHazards.forEach((hazard) => {
      const isCritical = hazard.severity === 'CRITICAL';
      const hazardCircle = L.circleMarker([hazard.latitude, hazard.longitude], {
        radius: isCritical ? 13 : 10,
        fillColor: isCritical ? '#ef4444' : '#f59e0b',
        color: '#ffffff',
        weight: 2,
        opacity: 0.95,
        fillOpacity: 0.85
      });

      hazardCircle.bindTooltip(
        `<div style="font-family: Inter, sans-serif; font-size: 11px; padding: 2px;">
          <strong style="color: ${isCritical ? '#ef4444' : '#f59e0b'};">⚠️ ${hazard.title}</strong><br/>
          <span>${hazard.description}</span><br/>
          <span style="color: #10b981; font-weight: bold;">Click to inspect evidence</span>
        </div>`,
        { direction: 'top', offset: [0, -10] }
      );

      hazardCircle.on('click', () => {
        setSelectedHazardForEvidence(hazard);
      });

      layerGroup.addLayer(hazardCircle);
    });

    // Draw Origin Marker (Green & Blue pulsing dot)
    const origIcon = L.divIcon({
      className: 'nav-origin-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="width: 22px; height: 22px; border-radius: 50%; background: #10b981; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(16,185,129,0.9); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
          </div>
          <span style="margin-top: 3px; background: rgba(15,23,42,0.95); color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 1px solid #10b981; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.4); font-family: Inter, sans-serif;">
            ${origin.split(',')[0]}
          </span>
        </div>
      `,
      iconSize: [30, 45],
      iconAnchor: [15, 11]
    });

    const origMarker = L.marker([analysisResult.originCoords.lat, analysisResult.originCoords.lon], {
      icon: origIcon
    });
    layerGroup.addLayer(origMarker);

    // Draw Destination Marker (Red pin)
    const destIcon = L.divIcon({
      className: 'nav-dest-marker',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <div style="width: 22px; height: 22px; border-radius: 50%; background: #ef4444; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(239,68,68,0.9); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; border-radius: 2px; background: #ffffff;"></div>
          </div>
          <span style="margin-top: 3px; background: rgba(15,23,42,0.95); color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 1px solid #ef4444; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.4); font-family: Inter, sans-serif;">
            ${destination.split(',')[0]}
          </span>
        </div>
      `,
      iconSize: [30, 45],
      iconAnchor: [15, 11]
    });

    const destMarker = L.marker([analysisResult.destCoords.lat, analysisResult.destCoords.lon], {
      icon: destIcon
    });
    layerGroup.addLayer(destMarker);

    // Fit map bounds to view route cleanly
    if (currentRoute.path.length > 0) {
      navMapRef.current.fitBounds(glowPolyline.getBounds(), {
        padding: [45, 45],
        maxZoom: 14
      });
    }
  }, [analysisResult, selectedRouteType]);

  // Pan-India Autocomplete Search Handlers
  const handleOriginChange = (val: string) => {
    setOrigin(val);
    setActiveInput('origin');
    if (val.length >= 2) {
      searchLocationsPanIndia(val).then((locs) => {
        setOriginSuggestions(
          locs.map((l) => ({
            displayName: l.display_name,
            shortName: l.name,
            lat: l.latitude,
            lon: l.longitude
          }))
        );
      });
    } else {
      setOriginSuggestions([]);
    }
  };

  const handleDestChange = (val: string) => {
    setDestination(val);
    setActiveInput('dest');
    if (val.length >= 2) {
      searchLocationsPanIndia(val).then((locs) => {
        setDestSuggestions(
          locs.map((l) => ({
            displayName: l.display_name,
            shortName: l.name,
            lat: l.latitude,
            lon: l.longitude
          }))
        );
      });
    } else {
      setDestSuggestions([]);
    }
  };

  const selectOriginSuggestion = (sug: LocationSuggestion) => {
    setOrigin(sug.shortName);
    setOriginCoords({ lat: sug.lat, lon: sug.lon });
    setOriginSuggestions([]);
    setActiveInput(null);
    if (onSelectCoordinates) {
      onSelectCoordinates(sug.lat, sug.lon, sug.displayName);
    }
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: 'Origin Updated',
      message: `Starting from ${sug.shortName}`
    });
  };

  const selectDestSuggestion = (sug: LocationSuggestion) => {
    setDestination(sug.shortName);
    setDestCoords({ lat: sug.lat, lon: sug.lon });
    setDestSuggestions([]);
    setActiveInput(null);
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: 'Destination Set',
      message: `Routing to ${sug.shortName}`
    });
  };

  const handleSwap = () => {
    const tempName = origin;
    const tempCoords = originCoords;
    setOrigin(destination);
    setOriginCoords(destCoords);
    setDestination(tempName);
    setDestCoords(tempCoords);
    setToast({
      id: Date.now().toString(),
      type: 'info',
      title: 'Route Inverted',
      message: `Swapped origin & destination.`
    });
  };

  const handleUseCurrentGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lon = Number(pos.coords.longitude.toFixed(5));
          setOrigin('Current GPS Location');
          setOriginCoords({ lat, lon });
          if (onSelectCoordinates) {
            onSelectCoordinates(lat, lon, 'Current GPS Location');
          }
          if (navMapRef.current) {
            navMapRef.current.flyTo([lat, lon], 14, { duration: 1 });
          }
          setToast({
            id: Date.now().toString(),
            type: 'success',
            title: 'GPS Location Locked',
            message: `Lat: ${lat}, Lon: ${lon}`
          });
        },
        (err) => {
          console.warn('GPS location unavailable:', err);
          setToast({
            id: Date.now().toString(),
            type: 'warning',
            title: 'GPS Permission Needed',
            message: 'Defaulting to selected location.'
          });
        }
      );
    }
  };

  const handlePresetSelect = (pOrigin: string, pDest: string) => {
    const origC = safeRouteEngine.resolveCoordinates(pOrigin);
    const destC = safeRouteEngine.resolveCoordinates(pDest);
    setOrigin(pOrigin);
    setDestination(pDest);
    setOriginCoords(origC);
    setDestCoords(destC);
    if (onSelectCoordinates) {
      onSelectCoordinates(origC.lat, origC.lon, pOrigin);
    }
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: 'Corridor Loaded',
      message: `${pOrigin} ⇄ ${pDest}`
    });
  };

  const handleBottomTabClick = (tab: MainNavTab) => {
    setActiveBottomTab(tab);
    if (tab === 'explore') {
      setShowNearbyServices(true);
    } else if (tab === 'alerts') {
      setShowGroundReport(true);
    } else if (tab === 'profile') {
      setShowProfileModal(true);
    } else if (tab === 'navigation') {
      setIsJourneyStarted(true);
      setToast({
        id: Date.now().toString(),
        type: 'success',
        title: 'Turn-by-Turn Navigation Started',
        message: 'Live voice & road hazard guidance activated.'
      });
    }
  };

  const activeRoute =
    analysisResult && selectedRouteType === 'safe'
      ? analysisResult.recommendedRoute
      : analysisResult?.alternateRoutes[0] || analysisResult?.recommendedRoute;

  return (
    <div className="w-full flex-1 flex flex-col justify-between bg-white dark:bg-[#070E1A] text-slate-900 dark:text-slate-100 relative font-sans transition-colors duration-300">
      {/* 1. TOP HEADER */}
      <BharatPathHeader
        user={user}
        alertCount={analysisResult?.detectedHazards.length || 0}
        onOpenCopilot={() => setShowAgentChat(true)}
        onOpenRouteComparison={() => setShowRouteComparison(true)}
        onOpenWeatherPrediction={onOpenWeatherPrediction}
        onOpenGroundReport={() => setShowGroundReport(true)}
        onOpenProfile={() => setShowProfileModal(true)}
        onPresetSelect={handlePresetSelect}
        onLogout={onLogout}
      />

      {/* Toast Notification */}
      <NotificationToast toast={toast} onDismiss={() => setToast(null)} />

      {/* 2. LOCATION / SEARCH PANEL CARD */}
      <LocationSearchCard
        origin={origin}
        destination={destination}
        onOriginChange={handleOriginChange}
        onDestChange={handleDestChange}
        onSwap={handleSwap}
        activeInput={activeInput}
        setActiveInput={setActiveInput}
        originSuggestions={originSuggestions}
        destSuggestions={destSuggestions}
        onSelectOriginSuggestion={selectOriginSuggestion}
        onSelectDestSuggestion={selectDestSuggestion}
        onUseCurrentLocationGPS={handleUseCurrentGPS}
      />

      {/* 3. QUICK ACTION BUTTONS ROW */}
      <QuickActionButtons
        onNavigateClick={() => {
          setIsJourneyStarted(true);
          setToast({
            id: Date.now().toString(),
            type: 'success',
            title: 'Live Guidance Started',
            message: `Navigating towards ${destination.split(',')[0]} via ${activeRoute?.highway || 'Expressway'}.`
          });
        }}
        onRouteClick={() => setShowRouteComparison(true)}
        onSavedClick={() => setShowSavedLocations(true)}
        onEmergencyClick={() => setShowNearbyServices(true)}
        selectedVehicle={selectedVehicle}
        onSelectVehicle={(veh) => {
          setSelectedVehicle(veh);
          if (onUpdateUserPreferences) {
            onUpdateUserPreferences({ language: user?.language || 'en', vehicle: veh });
          }
        }}
        isNavigatingActive={isJourneyStarted}
      />

      {/* 4. MAIN LEAFLET MAP AREA */}
      <section className="relative flex-1 min-h-[220px] sm:min-h-[250px] bg-slate-100 dark:bg-[#0A1322] overflow-hidden flex flex-col justify-between p-3">
        {/* Leaflet Map Canvas */}
        <div
          ref={navMapContainerRef}
          className="absolute inset-0 w-full h-full z-0"
          id="bharat-path-leaflet-map"
        />

        {/* Top Floating Badge & Route Switcher */}
        <div className="relative z-20 flex items-center justify-between w-full pointer-events-none">
          {/* Live Safe Traffic Indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-[#07111E]/90 border border-slate-200/90 dark:border-slate-700/80 text-[11px] font-extrabold text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-md pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isCalculatingRoute ? 'Calculating Live Route...' : 'Live Safe Traffic'}</span>
          </div>

          {/* Safe Route vs Shortcut Toggle */}
          {analysisResult && analysisResult.alternateRoutes.length > 0 && (
            <div className="flex items-center gap-1 bg-white/95 dark:bg-[#091322]/90 border border-slate-200/90 dark:border-slate-700/80 p-0.5 rounded-xl backdrop-blur-md pointer-events-auto shadow-md">
              <button
                onClick={() => setSelectedRouteType('safe')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  selectedRouteType === 'safe'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Safe Route
              </button>
              <button
                onClick={() => setSelectedRouteType('alternate')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  selectedRouteType === 'alternate'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Shortcut
              </button>
            </div>
          )}
        </div>

        {/* Floating Route Info Badge on Map */}
        {activeRoute && !isJourneyStarted && (
          <div className="absolute top-[40%] left-[12%] z-20 flex flex-col items-start gap-1 pointer-events-auto">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-900/95 dark:bg-emerald-950/95 border border-emerald-500 text-emerald-200 dark:text-emerald-300 font-extrabold text-xs shadow-xl backdrop-blur-md flex flex-col leading-tight">
              <span>{activeRoute.durationMin} min</span>
              <span className="text-[10px] font-normal text-emerald-300">
                {activeRoute.distanceKm} km
              </span>
            </div>
            <div className="px-1.5 py-0.5 rounded bg-slate-900/90 border border-emerald-500/40 text-[9px] font-bold text-emerald-300 shadow-sm">
              {activeRoute.highway}
            </div>
          </div>
        )}

        {/* Right Floating Map Controls */}
        <MapControls
          onZoomIn={() => navMapRef.current?.zoomIn()}
          onZoomOut={() => navMapRef.current?.zoomOut()}
          onRecenter={() => {
            if (navMapRef.current && analysisResult) {
              navMapRef.current.flyTo(
                [analysisResult.originCoords.lat, analysisResult.originCoords.lon],
                13,
                { duration: 1 }
              );
            }
          }}
          currentTileType={currentTileType}
          onChangeTileType={setCurrentTileType}
        />
      </section>

      {/* 5. ROUTE SUMMARY & START BUTTON CARD */}
      <RouteSummaryBottomCard
        activeRoute={activeRoute || null}
        selectedRouteType={selectedRouteType}
        onToggleRouteType={setSelectedRouteType}
        isJourneyStarted={isJourneyStarted}
        onToggleJourney={() => setIsJourneyStarted(!isJourneyStarted)}
        onOpenWeatherPrediction={() => onOpenWeatherPrediction('overview')}
        weatherData={weatherData}
        predictionData={predictionData}
      />

      {/* 6. BOTTOM NAVIGATION BAR */}
      <BottomNavBar
        activeTab={activeBottomTab}
        onSelectTab={handleBottomTabClick}
        alertCount={analysisResult?.detectedHazards.length || 0}
        isJourneyActive={isJourneyStarted}
      />

      {/* ========================================================================= */}
      {/* EXTENDED DRAWERS & MODALS */}
      {/* ========================================================================= */}

      {/* Multi-Route Comparison Modal */}
      {showRouteComparison && multiRoutes.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <RouteComparisonPanel
              routes={multiRoutes}
              selectedRouteId={selectedMultiRouteId}
              onSelectRoute={(id) => {
                setSelectedMultiRouteId(id);
                const match = multiRoutes.find((m) => m.id === id);
                if (match) {
                  setSelectedRouteType(match.label === 'FASTEST_ROUTE' ? 'alternate' : 'safe');
                }
              }}
              onStartNavigation={() => {
                setShowRouteComparison(false);
                setIsJourneyStarted(true);
              }}
              onClose={() => setShowRouteComparison(false)}
            />
          </div>
        </div>
      )}

      {/* Citizen Ground Hazard Report Drawer */}
      <GroundReportDrawer
        isOpen={showGroundReport}
        onClose={() => setShowGroundReport(false)}
        currentLat={originCoords.lat}
        currentLon={originCoords.lon}
        onReportSubmitted={(incident) => {
          setSelectedHazardForEvidence(incident);
        }}
      />

      {/* Incident Photographic Evidence & Verification Modal */}
      <IncidentEvidenceModal
        hazard={selectedHazardForEvidence}
        onClose={() => setSelectedHazardForEvidence(null)}
      />

      {/* AI Disaster & Navigation Copilot Chat */}
      <AgentChatModal
        isOpen={showAgentChat}
        onClose={() => setShowAgentChat(false)}
        currentLocationName={origin}
        currentRiskLevel={predictionData?.risk_level || 'MODERATE HAZARD RISK'}
      />

      {/* Nearby Services & Shelters Drawer */}
      <NearbyServicesDrawer
        isOpen={showNearbyServices}
        onClose={() => setShowNearbyServices(false)}
        currentLat={originCoords.lat}
        currentLon={originCoords.lon}
        onNavigateToPOI={(pLat, pLon, pName) => {
          setDestination(pName.split(',')[0]);
          setDestCoords({ lat: pLat, lon: pLon });
          setShowNearbyServices(false);
        }}
      />

      {/* Saved Locations & Bookmarks Drawer */}
      <SavedLocationsDrawer
        isOpen={showSavedLocations}
        onClose={() => setShowSavedLocations(false)}
        currentLat={originCoords.lat}
        currentLon={originCoords.lon}
        currentLocationName={origin}
        onSelectLocation={(sLat, sLon, sName) => {
          if (sName) {
            setDestination(sName.split(',')[0]);
            setDestCoords({ lat: sLat, lon: sLon });
          }
          setShowSavedLocations(false);
        }}
      />

      {/* Profile & Settings Modal */}
      <ProfileSettingsModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        onUpdatePreferences={(prefs) => {
          setSelectedVehicle(prefs.vehicle);
          if (onUpdateUserPreferences) {
            onUpdateUserPreferences(prefs);
          }
        }}
        onLogout={onLogout}
      />

      {/* Active Road Hazard Advisory Modal */}
      <HazardAdvisoryModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        highwayName={activeRoute?.highway || 'Highway'}
        hazards={analysisResult?.detectedHazards || []}
        onInspectWeatherForecast={() => onOpenWeatherPrediction('overview')}
      />
    </div>
  );
};
