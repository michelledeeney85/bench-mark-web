import { useMapEvents } from "react-leaflet";
import { useMapStore, MapStore } from "../../store/MapStore";

/** Component to handle adding a bench on map click
* This component listens for click events on the map and opens a popup to add a bench
* It uses zustand store to manage the state of the new bench coordinates and popup visibility */
export const AddBenchMapClick = () => {
  const setNewBenchCoords = useMapStore((state: MapStore) => state.setNewBenchCoords);
  const setShowAddBenchPopup = useMapStore((state: MapStore) => state.setShowAddBenchPopup);

  useMapEvents({
    click(e) {
      setNewBenchCoords([e.latlng.lat, e.latlng.lng]);
      setShowAddBenchPopup(true);
    }
  });
  return null;
};