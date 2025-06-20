import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { useMapStore, MapStore } from "../../store/MapStore";

/** Component to set the map reference in zustand store
* This component uses the useMap hook from react-leaflet to get the map instance
* and sets it in the zustand store using the setMapRef action */
export const MapRefSetter = () => {
  const map = useMap();
  const setMapRef = useMapStore((state : MapStore) => state.setMapRef);

  useEffect(() => {
    setMapRef(map);
  }, [map, setMapRef]);

  return null;
};