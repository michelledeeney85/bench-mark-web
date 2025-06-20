import { useMap } from "react-leaflet";
import { useMapStore, MapStore } from "../../store/MapStore";


const ResetViewButton = () => {

  const userGeoLocation = useMapStore((state:MapStore) => state.userGeoLocation);
  const setUserLocation = useMapStore((state:MapStore) => state.setUserLocation);
  const DEFAULT_ZOOM = useMapStore((state:MapStore) => state.DEFAULT_ZOOM);

  const map = useMap();

  const handleClick = () => {
    if (userGeoLocation) {
      map.setView(userGeoLocation, DEFAULT_ZOOM);
       setUserLocation(userGeoLocation);
    }
  };

  return (
    <button
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        padding: "8px 12px",
        borderRadius: "4px",
        cursor: "pointer"
      }}
      onClick={handleClick}
    >
      Center on Me
    </button>
  );
};

export default ResetViewButton;