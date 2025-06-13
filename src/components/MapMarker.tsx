import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import benchMarkerUrl from "../assets/benchMarker.png";
import youAreHereUrl from "../assets/youAreHere.png";
import { Marker, useMap } from "react-leaflet";

interface MapMarkerProps {
    position: L.LatLngExpression;
    children: React.ReactNode; 
    iconType: "bench" | "user"; 
  }
  
const MapMarker: React.FC<MapMarkerProps> = ({ position, children, iconType }) => {
    useMap();

     const iconUrl = iconType === "user" ? youAreHereUrl : benchMarkerUrl;

    const customIcon = L.icon({
        iconUrl,
        iconSize: [50, 50],
        iconAnchor: [25, 50]    
    });

    return (
        <Marker position={position} icon={customIcon}>
            {children}
        </Marker>
    );
};
  
export default MapMarker;