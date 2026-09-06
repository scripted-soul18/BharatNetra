import React, { useState } from 'react';
import {
  Plus,
  Minus,
  Crosshair,
  Layers,
  Compass,
  Check
} from 'lucide-react';

export type MapTileType = 'roadmap' | 'satellite' | 'terrain';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRecenter: () => void;
  currentTileType: MapTileType;
  onChangeTileType: (type: MapTileType) => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onRecenter,
  currentTileType,
  onChangeTileType
}) => {
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  return (
    <div className="relative z-20 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Layer Switcher Dropdown */}
      {showLayerMenu && (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-2 space-y-1 mb-1 min-w-[130px] animate-fadeIn">
          <button
            onClick={() => { onChangeTileType('roadmap'); setShowLayerMenu(false); }}
            className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors ${
              currentTileType === 'roadmap'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Road Map</span>
            {currentTileType === 'roadmap' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
          <button
            onClick={() => { onChangeTileType('satellite'); setShowLayerMenu(false); }}
            className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors ${
              currentTileType === 'satellite'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Satellite</span>
            {currentTileType === 'satellite' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
          <button
            onClick={() => { onChangeTileType('terrain'); setShowLayerMenu(false); }}
            className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition-colors ${
              currentTileType === 'terrain'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>Terrain</span>
            {currentTileType === 'terrain' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        </div>
      )}

      {/* Layer Toggle Button */}
      <button
        onClick={() => setShowLayerMenu(!showLayerMenu)}
        className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-slate-50 dark:bg-[#0B1527]/90 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md active:scale-95 transition-all"
        title="Toggle Map Layers"
      >
        <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      </button>

      {/* Zoom In (+) */}
      <button
        onClick={onZoomIn}
        className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-slate-50 dark:bg-[#0B1527]/90 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md active:scale-95 transition-all"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Zoom Out (-) */}
      <button
        onClick={onZoomOut}
        className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-slate-50 dark:bg-[#0B1527]/90 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-md backdrop-blur-md active:scale-95 transition-all"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>

      {/* Recenter Origin/Location */}
      <button
        onClick={onRecenter}
        className="w-10 h-10 rounded-2xl bg-white/95 hover:bg-slate-50 dark:bg-[#0B1527]/90 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md backdrop-blur-md active:scale-95 transition-all"
        title="Recenter Map on Target"
      >
        <Crosshair className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      </button>
    </div>
  );
};
