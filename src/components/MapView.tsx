import { useEffect, useState, useRef } from "react";
import { MapContainer, Popup, TileLayer, useMapEvents, useMap} from "react-leaflet";
import MapMarker from "./MapMarker";
import ResetViewButton from "./ResetViewButton";
import LocationSearchBar from "./LocationSearchBar";
import BenchPopup from "./BenchPopup";
import '../stylesheets/MapView.css';
import { OverpassElement } from "../types/OverpassTypes";
import benchMarkerIcon from '../assets/benchMarker.png';

const DEFAULT_ZOOM = 15;

// Helper component to set the mapRef
const MapRefSetter = ({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) => {
  const map = useMap();
  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
};

const MapView = () => {
  const [userGeoLocation, setUserGeoLocation] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [benchLocations, setBenchLocations] = useState<OverpassElement[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  // Reference to the map instance - aids in changing the map location on search
  const mapRef = useRef<L.Map | null>(null);
 
  //Set the initial map center to user location if available
  useEffect(() => {
    //Using watchPosition to get user's current location dynamically and update if they move
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserGeoLocation(loc);
        setUserLocation(loc);
        setMapCenter(loc);
      },
      (error) => {
        console.error("Error fetching user location:", error);
      }
    );
    //Stop watching the user's location when the component unmounts
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Reference to store the last bounds fetched
  // This helps in preventing unnecessary API calls if the bounds haven't changed
  // This is useful to avoid flickering of bench markers when the map is moved slightly
  // and to ensure that benches are fetched only when the bounds actually change
  const lastBoundsRef = useRef<string | null>(null);

  // Fetch bench locations from Overpass API
  const fetchBenchLocations = (bounds: string) => {
    // If the bounds haven't changed since the last fetch, skip the API call
    if (lastBoundsRef.current === bounds) {
      return;
    }
    // Update the last bounds reference to the current bounds
    // This ensures that the next fetch will only happen if the bounds change
    lastBoundsRef.current = bounds;
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
        // Only update if data actually changed
        if (JSON.stringify(data.elements) !== JSON.stringify(benchLocations)) {
          setBenchLocations(data.elements || []);           
        }
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
        }, 500); 
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

  if (!userLocation || !mapCenter || !userGeoLocation) {
    return <div>Loading user location. You may need to allow location permissions.</div>;
  }
  
  return (
    <div className="benchmark-main-page">
      <div className="mapview-title">
        <div className="flex-row">
          <img src={benchMarkerIcon}/>
          <div className="flex-col">
            <h2>BenchMark</h2>     
            <h3>Find benches near you!</h3>
            <p>(Web version 1.0)</p>
          </div>
        </div>     
      </div>
      <div className="mapview-flex-container">      
        <div className="mapview-toolbar">
          <LocationSearchBar onSearch={(lat, lon) => {
            if (mapRef.current) {
              mapRef.current.setView([lat, lon], DEFAULT_ZOOM);
            }
            setUserLocation([lat, lon]);   // ensure user location is updated to the searched location
            setMapCenter([lat, lon]);  // update map center to the searched location
            }} 
            userLocation={userGeoLocation}
          />
        </div>
        <div className="mapview-map">
          <MapContainer 
            center={mapCenter} 
            zoom={DEFAULT_ZOOM} 
            scrollWheelZoom={true}
          >
            <MapRefSetter mapRef={mapRef}/>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEventHandler />
            {/* Button to restore user location */}
            <ResetViewButton 
              userLocation={userGeoLocation} 
              defaultZoom={DEFAULT_ZOOM} 
              setUserMarkerCallback = {() => setUserLocation(userGeoLocation)}
            />
            {/* User location marker */}
            <MapMarker position={userLocation} iconType="user">
              <Popup>You are here</Popup>
            </MapMarker>
            {/* Bench markers */}
            {benchLocations.map((bench) => (
              <MapMarker key={bench.id} position={[bench.lat, bench.lon]} iconType="bench">
                <Popup>
                  <BenchPopup bench={bench}/>
                </Popup>
              </MapMarker>
            ))}
          </MapContainer>
        </div>  
      </div>    
    </div>    
  );
};

export default MapView;
