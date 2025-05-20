import { useEffect, useState, useRef } from "react";
import { MapContainer, Popup, TileLayer, useMapEvents, useMap } from "react-leaflet";
import MapMarker from "./MapMarker";
import './MapView.css';
import { OverpassElement } from "../types/OverpassTypes";

interface ResetViewProps {
    userLocation: L.LatLngExpression;
    defaultZoom: number; 
  }

const ResetViewButton: React.FC<ResetViewProps> = ({ userLocation, defaultZoom }) => {
  const map = useMap();

  const handleClick = () => {
    if (userLocation) {
      map.setView(userLocation, defaultZoom);
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