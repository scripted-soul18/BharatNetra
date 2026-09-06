/**
 * Bharat-Netra Spatial Hazard Registry & Incident Store
 * Manages active real-time hazards: Landslides, Flash Floods, Roadblocks, and Bridge Damages
 */

export interface HazardIncident {
  id: string;
  type: 'LANDSLIDE' | 'FLASH_FLOOD' | 'ROAD_BLOCK' | 'ROCKFALL' | 'BRIDGE_DAMAGE';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  reportedAt: string;
  source: 'NDMA' | 'SDMA' | 'BRO' | 'CITIZEN_REPORT' | 'SATELLITE_RADAR' | 'IOT_SENSOR';
  verified: boolean;
  status: 'ACTIVE' | 'RESOLVING' | 'CLEARED';
  imageUrl?: string;
  actionRequired?: string;
}

// Default high-risk active hazard registry across major mountain corridors in India
const DEFAULT_HAZARDS: HazardIncident[] = [
  {
    id: 'HAZ-2026-0901',
    type: 'LANDSLIDE',
    severity: 'CRITICAL',
    title: 'Major Slump & Debris Flow - NH-5',
    description: 'Active slope failure near Kalka-Shimla highway (Sector 4). Debris blocks both lanes.',
    latitude: 31.0548,
    longitude: 77.0834,
    radiusMeters: 650,
    reportedAt: '2026-09-03T05:30:00Z',
    source: 'SDMA',
    verified: true,
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
    actionRequired: 'Divert light vehicles via Solan bypass; heavy vehicles halted.'
  },
  {
    id: 'HAZ-2026-0902',
    type: 'ROCKFALL',
    severity: 'HIGH',
    title: 'Unstable Boulder Roll - Chamoli Highway',
    description: 'Continuous rock detachment triggered by overnight 65mm precipitation.',
    latitude: 30.4045,
    longitude: 79.3245,
    radiusMeters: 450,
    reportedAt: '2026-09-03T06:15:00Z',
    source: 'BRO',
    verified: true,
    status: 'ACTIVE',
    actionRequired: 'Single-lane controlled convoy transit with spotters.'
  },
  {
    id: 'HAZ-2026-0903',
    type: 'FLASH_FLOOD',
    severity: 'HIGH',
    title: 'River Spillover - Kullu Valley Route',
    description: 'Beas River tributaries breached culvert 14; 0.8m standing water on asphalt.',
    latitude: 31.9578,
    longitude: 77.1095,
    radiusMeters: 800,
    reportedAt: '2026-09-03T04:45:00Z',
    source: 'NDMA',
    verified: true,
    status: 'ACTIVE',
    actionRequired: 'Avoid low-clearance vehicles; heavy AWD only.'
  },
  {
    id: 'HAZ-2026-0904',
    type: 'ROAD_BLOCK',
    severity: 'MODERATE',
    title: 'Uprooted Conifer Trees - Munnar Ghat Road',
    description: 'High gusts uprooted 4 pine trees blocking descending lane.',
    latitude: 10.0889,
    longitude: 77.0595,
    radiusMeters: 300,
    reportedAt: '2026-09-03T07:10:00Z',
    source: 'CITIZEN_REPORT',
    verified: true,
    status: 'ACTIVE',
    actionRequired: 'Clearing team on site; 25 min expected delay.'
  },
  {
    id: 'HAZ-2026-0905',
    type: 'LANDSLIDE',
    severity: 'CRITICAL',
    title: 'Mudslide & Soil Liquefaction - Wayanad Ghat',
    description: 'Intense 24h rainfall triggered soil saturation >85% causing slope collapse.',
    latitude: 11.5345,
    longitude: 76.0125,
    radiusMeters: 900,
    reportedAt: '2026-09-03T08:00:00Z',
    source: 'SDMA',
    verified: true,
    status: 'ACTIVE',
    actionRequired: 'Complete road closure. Use alternative Kozhikode-Gudalur pass.'
  }
];

class HazardRegistryStore {
  private hazards: HazardIncident[] = [];
  private readonly STORAGE_KEY = 'bharat_netra_hazard_registry';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.hazards = parsed;
          return;
        }
      }
    } catch {
      // Fallback to defaults if local storage parsing fails
    }
    this.hazards = [...DEFAULT_HAZARDS];
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.hazards));
    } catch {
      // Ignore storage errors
    }
  }

  public getAllHazards(): HazardIncident[] {
    return this.hazards.filter((h) => h.status === 'ACTIVE');
  }

  public getHazardById(id: string): HazardIncident | undefined {
    return this.hazards.find((h) => h.id === id);
  }

  public addHazardReport(report: Omit<HazardIncident, 'id' | 'reportedAt' | 'verified' | 'status'>): HazardIncident {
    const newIncident: HazardIncident = {
      ...report,
      id: `HAZ-CITIZEN-${Date.now().toString().slice(-6)}`,
      reportedAt: new Date().toISOString(),
      verified: false,
      status: 'ACTIVE'
    };

    this.hazards.unshift(newIncident);
    this.saveToStorage();
    return newIncident;
  }

  public verifyHazard(id: string) {
    const item = this.hazards.find((h) => h.id === id);
    if (item) {
      item.verified = true;
      this.saveToStorage();
    }
  }

  public clearHazard(id: string) {
    const item = this.hazards.find((h) => h.id === id);
    if (item) {
      item.status = 'CLEARED';
      this.saveToStorage();
    }
  }

  public resetToDefaults() {
    this.hazards = [...DEFAULT_HAZARDS];
    this.saveToStorage();
  }
}

export const HazardRegistry = new HazardRegistryStore();
