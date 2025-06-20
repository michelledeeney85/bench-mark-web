import { useMapEvents } from "react-leaflet";
import { useMapStore, MapStore } from "../../store/MapStore";
import { useEffect } from "react";
import { fetchBenchLocations } from "../../utils/fetchBenchLocations";

  /** Component to handle map events and fetch benches within bounds
  * This component uses the useMapEvents hook from react-leaflet to listen for map events
  * and fetch bench locations within the current map bounds */
export const MapEventHandler = () => {
    const debounceRef = useMapStore((state: MapStore) => state.debounceRef);
    const setDebounceRef = useMapStore((state: MapStore) => state.setDebounceRef);
    const map = useMapEvents({
      moveend: () => {
        // Clear previous timeout if it exists
        if (debounceRef) clearTimeout(debounceRef);
        // Set a new timeout to debounce (prevent flickering bench marks)
        const newDebounceRef = setTimeout(() => {
          // Fetch bench locations within the current map bounds
          const bounds = map.getBounds();
          const boundsString = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
          fetchBenchLocations(boundsString);
        }, 500); 
        setDebounceRef(newDebounceRef);
      },
    }); // Trigger fetch on map load

    useEffect(() => {
      // Fetch bench locations within the initial map bounds
      const bounds = map.getBounds();
      const boundsString = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
      fetchBenchLocations(boundsString);
      // Cleanup on unmount
      return () => {
        // Clear the debounce timeout if it exists
        if (debounceRef) clearTimeout(debounceRef);
      };
    }, [debounceRef, map]);

    return null;
}