import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Loader2, X, Globe, Mountain, Sparkles } from 'lucide-react';
import { searchGlobalLocations, GeocodedLocation } from '../engine/GeocodingService';

interface LocationSearchBarProps {
  onSelectCoordinates: (lat: number, lon: number, name?: string) => void;
  currentLat: number;
  currentLon: number;
}

const POPULAR_QUICK_REGIONS = [
  { name: 'Nepal (Himalayas)', lat: 28.3949, lon: 84.1240, desc: 'High-Altitude Landslide Hazard Corridor' },
  { name: 'Kathmandu, Nepal', lat: 27.7172, lon: 85.3240, desc: 'Bagmati Basin Valley & Mountain Foothills' },
  { name: 'Shimla (Himachal)', lat: 31.1048, lon: 77.1734, desc: 'NH-5 Himalayan Mountain Corridor' },
  { name: 'Interlaken (Swiss Alps)', lat: 46.6863, lon: 7.8632, desc: 'Bernese Oberland Alpine Slopes' },
  { name: 'Wayanad (Western Ghats)', lat: 11.6854, lon: 76.1320, desc: 'Kerala High-Precipitation Geohazard Zone' },
  { name: 'Talegaon / Pune', lat: 18.7297, lon: 73.6749, desc: 'Mumbai-Pune Expressway Western Ghats' },
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, desc: 'Pacific Ring of Fire Steep Ridge System' },
];

export const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
  onSelectCoordinates,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchGlobalLocations(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lat: number, lon: number, name: string) => {
    onSelectCoordinates(lat, lon, name);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        const top = suggestions[0];
        handleSelect(top.latitude, top.longitude, top.display_name || top.name);
      } else if (query.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchGlobalLocations(query);
          if (results.length > 0) {
            handleSelect(results[0].latitude, results[0].longitude, results[0].display_name || results[0].name);
          }
        } finally {
          setIsSearching(false);
        }
      }
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleSelect(
            Number(pos.coords.latitude.toFixed(5)),
            Number(pos.coords.longitude.toFixed(5)),
            'Current GPS Location'
          );
        },
        (err) => {
          console.warn('Geolocation denied, keeping current:', err);
        }
      );
    }
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-blue-500 dark:text-cyan-400 pointer-events-none" />
        <input
          ref={inputRef}
          id="location-search-input"
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search any country, city, mountain or corridor (e.g. Nepal)..."
          className="w-full bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs sm:text-sm pl-9 pr-20 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm font-medium"
          autoFocus
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {query.length > 0 && (
            <button
              onClick={() => { setQuery(''); setSuggestions([]); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {isSearching && <Loader2 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400 animate-spin mr-1" />}
          <button
            onClick={handleUseCurrentLocation}
            className="flex items-center gap-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 text-xs px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 transition-all shadow-xs active:scale-95 font-semibold"
            title="Use My Current GPS Location"
          >
            <Navigation className="w-3 h-3" />
            <span className="hidden sm:inline">GPS</span>
          </button>
        </div>
      </div>

      {/* Autocomplete / Suggested Corridors Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#0A1220] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[1300] max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/70">
          {suggestions.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-500" />
                <span>Search Results (Worldwide)</span>
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.latitude, item.longitude, item.display_name || item.name)}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-cyan-50/60 dark:hover:bg-cyan-950/30 flex items-center justify-between gap-2.5 transition-all text-slate-800 dark:text-slate-200 group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {item.name}
                        </span>
                        {item.country && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                            {item.country}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.display_name}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                    {item.latitude.toFixed(2)}°, {item.longitude.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 && !isSearching ? (
            <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">
              No matching locations found for "{query}". Try a country or city name.
            </div>
          ) : (
            <div>
              <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Mountain className="w-3 h-3 text-amber-500" />
                <span>Featured Mountain & Hazard Corridors</span>
              </div>
              {POPULAR_QUICK_REGIONS.map((region, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(region.lat, region.lon, region.name)}
                  className="w-full px-3.5 py-2.5 text-left hover:bg-amber-50/50 dark:hover:bg-amber-950/20 flex items-center justify-between gap-2.5 transition-all text-slate-800 dark:text-slate-200 group"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <MapPin className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {region.name}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {region.desc}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                    {region.lat.toFixed(2)}°, {region.lon.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
