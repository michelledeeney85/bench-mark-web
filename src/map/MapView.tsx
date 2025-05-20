import { useEffect, useState, useRef } from "react";
import { MapContainer, Popup, TileLayer, useMapEvents} from "react-leaflet";
import MapMarker from "./MapMarker";
import ResetViewButton from "./ResetViewButton";
import './MapView.css';
import { OverpassElement } from "../types/OverpassTypes";

const DEFAULT_ZOOM = 15;

const MapView = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [benchLocations, setBenchLocations] = useState<OverpassElement[]>([]);

  // Fetch user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        console.log("User location:", position.coords);
      },
      (error) => {
        console.error("Error fetching user location:", error);
      }
    );
  }, []);

  // Fetch bench locations from Overpass API
  const fetchBenchLocations = (bounds: string) => {
    // Overpass API query to fetch bench locations within the given bounds
    const query = `
      [out:json];
      node["amenity"="bench"](${bounds});
      out body;
    `;
    // Fetch data from Overpass API
    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
      .then((response) => response.json())
      .then((data) => {
        setBenchLocations(data.elements || []);
      })
      .catch((error) => {
        console.error("Error fetching bench locations:", error);
      });
  };

  // Debounce ref - to prevent flickering of bench marks from tiny movements
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Component to handle map events and fetch benches within bounds
  const MapEventHandler = () => {
    const map = useMapEvents({
      moveend: () => {
        // Clear previous timeout if it exists
        if (debounceRef.current) clearTimeout(debounceRef.current);
        // Set a new timeout to debounce (prevent flickering bench marks)
        debounceRef.current = setTimeout(() => {
          // Fetch bench locations within the current map bounds
          const bounds = map.getBounds();
          const boundsString = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
          fetchBenchLocations(boundsString);
        }, 400); // 400ms debounce
      },
    });

    // Trigger fetch on map load
   useEffect(() => {
      // Fetch bench locations within the initial map bounds
      const bounds = map.getBounds();
      const boundsString = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
      fetchBenchLocations(boundsString);
      // Cleanup on unmount
      return () => {
        // Clear the debounce timeout if it exists
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }, [map]);

    return null;
  };
  

  if (!userLocation) {
    return <div>Loading user location...</div>;
  }
  
  return (
    <div className="map-wrapper">
      <MapContainer center={userLocation} zoom={DEFAULT_ZOOM} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventHandler />
        {/* Button to restore user location */}
        <ResetViewButton userLocation={userLocation} defaultZoom={DEFAULT_ZOOM} />
        {/* User location marker */}
        <MapMarker position={userLocation} iconType="user">
          <Popup>You are here</Popup>
        </MapMarker>
        {/* Bench markers */}
        {benchLocations.map((bench) => (
          <MapMarker key={bench.id} position={[bench.lat, bench.lon]} iconType="bench">
            <Popup>Bench ID: {bench.id}</Popup>
          </MapMarker>
        ))}
      </MapContainer>
    </div>    
  );
};

export default MapView;
