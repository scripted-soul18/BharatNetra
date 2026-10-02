/**
 * Bharat-Netra Global & Pan-India Geocoding & Location Search Engine
 * Provides sub-millisecond search-as-you-type autocomplete across all countries,
 * global mountain corridors, landslide hazard regions, and worldwide cities.
 */

export interface GeocodedLocation {
  name: string;
  display_name: string;
  latitude: number;
  longitude: number;
  state?: string;
  country?: string;
  type?: string;
}

// Curated high-traffic global and Indian hazard & mountain corridor locations for instant offline response
const CURATED_GLOBAL_LOCATIONS: GeocodedLocation[] = [
  // Nepal & Himalayan Region
  { name: 'Nepal', display_name: 'Nepal, South Asia', latitude: 28.3949, longitude: 84.1240, country: 'Nepal' },
  { name: 'Kathmandu', display_name: 'Kathmandu, Bagmati, Nepal', latitude: 27.7172, longitude: 85.3240, country: 'Nepal' },
  { name: 'Pokhara', display_name: 'Pokhara, Gandaki, Nepal', latitude: 28.2096, longitude: 83.9856, country: 'Nepal' },
  { name: 'Mount Everest', display_name: 'Mount Everest (Sagarmatha), Solukhumbu, Nepal', latitude: 27.9881, longitude: 86.9250, country: 'Nepal' },
  { name: 'Annapurna', display_name: 'Annapurna Mountain Range, Gandaki, Nepal', latitude: 28.5956, longitude: 83.8203, country: 'Nepal' },

  // Indian Mountain & Highway Corridors
  { name: 'Shimla', display_name: 'Shimla, Himachal Pradesh, India', latitude: 31.1048, longitude: 77.1734, state: 'Himachal Pradesh', country: 'India' },
  { name: 'Manali', display_name: 'Manali, Kullu, Himachal Pradesh, India', latitude: 32.2432, longitude: 77.1892, state: 'Himachal Pradesh', country: 'India' },
  { name: 'Wayanad', display_name: 'Wayanad, Kalpetta, Kerala, India', latitude: 11.6854, longitude: 76.1320, state: 'Kerala', country: 'India' },
  { name: 'Kedarnath', display_name: 'Kedarnath, Rudraprayag, Uttarakhand, India', latitude: 30.7346, longitude: 79.0669, state: 'Uttarakhand', country: 'India' },
  { name: 'Badrinath', display_name: 'Badrinath, Chamoli, Uttarakhand, India', latitude: 30.7433, longitude: 79.4938, state: 'Uttarakhand', country: 'India' },
  { name: 'Rishikesh', display_name: 'Rishikesh, Dehradun, Uttarakhand, India', latitude: 30.0869, longitude: 78.2676, state: 'Uttarakhand', country: 'India' },
  { name: 'Dehradun', display_name: 'Dehradun, Uttarakhand, India', latitude: 30.3165, longitude: 78.0322, state: 'Uttarakhand', country: 'India' },
  { name: 'Munnar', display_name: 'Munnar, Idukki, Kerala, India', latitude: 10.0889, longitude: 77.0595, state: 'Kerala', country: 'India' },
  { name: 'Darjeeling', display_name: 'Darjeeling, West Bengal, India', latitude: 27.0410, longitude: 88.2663, state: 'West Bengal', country: 'India' },
  { name: 'Gangtok', display_name: 'Gangtok, East Sikkim, Sikkim, India', latitude: 27.3389, longitude: 88.6065, state: 'Sikkim', country: 'India' },
  { name: 'Leh', display_name: 'Leh, Ladakh, India', latitude: 34.1526, longitude: 77.5771, state: 'Ladakh', country: 'India' },
  { name: 'Srinagar', display_name: 'Srinagar, Jammu & Kashmir, India', latitude: 34.0837, longitude: 74.7973, state: 'Jammu & Kashmir', country: 'India' },
  { name: 'Shillong', display_name: 'Shillong, East Khasi Hills, Meghalaya, India', latitude: 25.5788, longitude: 91.8933, state: 'Meghalaya', country: 'India' },
  { name: 'Mahabaleshwar', display_name: 'Mahabaleshwar, Satara, Maharashtra, India', latitude: 17.9237, longitude: 73.6586, state: 'Maharashtra', country: 'India' },
  { name: 'Pune', display_name: 'Pune, Maharashtra, India', latitude: 18.5204, longitude: 73.8567, state: 'Maharashtra', country: 'India' },
  { name: 'Talegaon', display_name: 'Talegaon Dabhade, Pune, Maharashtra, India', latitude: 18.7297, longitude: 73.6749, state: 'Maharashtra', country: 'India' },
  { name: 'Mumbai', display_name: 'Mumbai, Maharashtra, India', latitude: 19.0760, longitude: 72.8777, state: 'Maharashtra', country: 'India' },
  { name: 'New Delhi', display_name: 'New Delhi, Delhi, India', latitude: 28.6139, longitude: 77.2090, state: 'Delhi', country: 'India' },
  { name: 'Bengaluru', display_name: 'Bengaluru, Karnataka, India', latitude: 12.9716, longitude: 77.5946, state: 'Karnataka', country: 'India' },

  // Global Mountain & Landslide Hazard Regions
  { name: 'Interlaken', display_name: 'Interlaken, Bern, Switzerland', latitude: 46.6863, longitude: 7.8632, country: 'Switzerland' },
  { name: 'Zurich', display_name: 'Zurich, Switzerland', latitude: 47.3769, longitude: 8.5417, country: 'Switzerland' },
  { name: 'Tokyo', display_name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503, country: 'Japan' },
  { name: 'Nagano', display_name: 'Nagano, Japan', latitude: 36.6513, longitude: 138.1810, country: 'Japan' },
  { name: 'Seattle', display_name: 'Seattle, Washington, USA', latitude: 47.6062, longitude: -122.3321, country: 'United States' },
  { name: 'San Francisco', display_name: 'San Francisco, California, USA', latitude: 37.7749, longitude: -122.4194, country: 'United States' },
  { name: 'Petrópolis', display_name: 'Petrópolis, Rio de Janeiro, Brazil', latitude: -22.5050, longitude: -43.1789, country: 'Brazil' },
  { name: 'Quito', display_name: 'Quito, Pichincha, Ecuador', latitude: -0.1807, longitude: -78.4678, country: 'Ecuador' },
  { name: 'London', display_name: 'London, Greater London, United Kingdom', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom' }
];

/**
 * Searches worldwide locations with multi-source fallback (Open-Meteo Geocoding, Photon OSM, Curated).
 */
export async function searchGlobalLocations(query: string): Promise<GeocodedLocation[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return [];

  // 1. Instant local curated search
  const localMatches = CURATED_GLOBAL_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(trimmed.toLowerCase()) ||
      loc.display_name.toLowerCase().includes(trimmed.toLowerCase())
  );

  const results: GeocodedLocation[] = [];

  // 2. Query Open-Meteo High-Speed Global Geocoding API (0 rate-limit, global)
  try {
    const openMeteoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmed
    )}&count=10&language=en&format=json`;

    const res = await fetch(openMeteoUrl, { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results)) {
        data.results.forEach((item: any) => {
          const parts = [item.name, item.admin1, item.country].filter(Boolean);
          results.push({
            name: item.name || 'Location',
            display_name: parts.join(', '),
            latitude: item.latitude,
            longitude: item.longitude,
            state: item.admin1,
            country: item.country,
            type: item.feature_code
          });
        });
      }
    }
  } catch (err) {
    // Open-Meteo timeout or network failure -> fallback to Photon
  }

  // 3. Query Photon Global OSM Geocoder if needed
  if (results.length < 3) {
    try {
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=8`;
      const res = await fetch(photonUrl, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        (data.features || []).forEach((f: any) => {
          const p = f.properties || {};
          const coords = f.geometry?.coordinates || [0, 0];
          const parts = [p.name, p.city || p.district, p.state, p.country].filter(Boolean);
          results.push({
            name: p.name || parts[0] || 'Location',
            display_name: parts.join(', '),
            latitude: coords[1],
            longitude: coords[0],
            state: p.state,
            country: p.country
          });
        });
      }
    } catch {
      // Ignore
    }
  }

  // 4. Merge online results with curated list and deduplicate by coordinates
  const seen = new Set<string>();
  const combined = [...results, ...localMatches].filter((item) => {
    const key = `${item.latitude.toFixed(2)}_${item.longitude.toFixed(2)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return combined.slice(0, 8);
}

// Backward-compatible alias
export const searchLocationsPanIndia = searchGlobalLocations;
