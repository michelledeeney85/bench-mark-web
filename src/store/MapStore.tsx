import { create } from "zustand";
import { OverpassElement } from "../types/OverpassTypes";

/**
 * Store for managing map-related state
 * This store holds the user's geolocation, bench locations, map center,
 * and other related states for the map component.
 */
export interface MapStore {

  userGeoLocation: [number, number] | null;
  setUserGeoLocation: (coords: [number, number] | null) => void;

  userLocation: [number, number] | null;
  setUserLocation: (coords: [number, number] | null) => void;

  benchLocations: OverpassElement[];
  setBenchLocations: (benches: OverpassElement[]) => void;

  mapCenter: [number, number] | null;
  setMapCenter: (coords: [number, number] | null) => void;

  addBenchMode: boolean;
  setAddBenchMode: (mode: boolean) => void;

  newBenchCoords: [number, number] | null;
  setNewBenchCoords: (coords: [number, number] | null) => void;

  showAddBenchPopup: boolean;
  setShowAddBenchPopup: (show: boolean) => void;

  DEFAULT_ZOOM :number;

  mapRef: L.Map | null;
  setMapRef: (ref: L.Map | null) => void;

  debounceRef : NodeJS.Timeout | null;
  setDebounceRef: (ref: NodeJS.Timeout | null) => void;

  lastBoundsRef : string | null;
  setLastBoundsRef: (bounds: string | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  userGeoLocation: null,
  setUserGeoLocation: (coords) => set({ userGeoLocation: coords }),

  userLocation: null,
  setUserLocation: (coords) => set({ userLocation: coords }),

  benchLocations: [],
  setBenchLocations: (benches) => set({ benchLocations: benches }),

  mapCenter: null,
  setMapCenter: (coords) => set({ mapCenter: coords }),

  addBenchMode: false,
  setAddBenchMode: (mode) => set({ addBenchMode: mode }),

  newBenchCoords: null,
  setNewBenchCoords: (coords) => set({ newBenchCoords: coords }),

  showAddBenchPopup: false,
  setShowAddBenchPopup: (show) => set({ showAddBenchPopup: show }),

  DEFAULT_ZOOM: 15,

  mapRef: null,
  setMapRef: (ref) => set({ mapRef: ref }),

  debounceRef: null,
  setDebounceRef: (ref) => set({ debounceRef: ref }),

  lastBoundsRef: null,
  setLastBoundsRef: (bounds) => set({ lastBoundsRef: bounds})
}));