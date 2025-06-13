import React from "react";
import { useMap } from "react-leaflet";

interface ResetViewProps {
    userLocation: L.LatLngExpression;
    defaultZoom: number; 
    setUserMarkerCallback: () => void; // Callback to reset user location marker
  }

const ResetViewButton: React.FC<ResetViewProps> = (
  { userLocation, defaultZoom, setUserMarkerCallback }) => {
  const map = useMap();

  const handleClick = () => {
    if (userLocation) {
      map.setView(userLocation, defaultZoom);
      setUserMarkerCallback();
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
        background: "#fff",
        border: "1px solid #888",
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