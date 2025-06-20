import { useEffect, useRef } from "react";
import { MapContainer, Popup, TileLayer, useMapEvents, useMap} from "react-leaflet";
import MapMarker from "./MapMarker";
import ResetViewButton from "./ResetViewButton";
import EditBenchPopup from "./EditBenchPopup";
import '../stylesheets/MapView.css';
import AddBenchPopup from "./AddBenchPopup";
import TitleBar from "./TitleBar";
import LoadingMap from "./LoadingMap";
import { FC } from "react";
import { useMapStore, MapStore } from "../store/MapStore";
import ToolBar from "./ToolBar";



// Helper component to set the mapRef
const MapRefSetter = () => {
  const map = useMap();
  const setMapRef = useMapStore(state => state.setMapRef);

  useEffect(() => {
    setMapRef(map);
  }, [map, setMapRef]);

  return null;
};

interface AddBenchMapClickProps {
  onPick: (coords: [number, number]) => void;
  showPopup: (show: boolean) => void;
}

const AddBenchMapClick: FC<AddBenchMapClickProps> = ({ onPick, showPopup }) => {
  useMapEvents({
    click(e) {
      onPick([e.latlng.lat, e.latlng.lng]);
      showPopup(true);
    }
  });
  return null;
};

const MapView = () => {

//Imports from the zustand store
const userGeoLocation = useMapStore((state :MapStore) => state.userGeoLocation);
const setUserGeoLocation = useMapStore((state :MapStore) => state.setUserGeoLocation);

const userLocation = useMapStore((state :MapStore) => state.userLocation);
const setUserLocation = useMapStore((state :MapStore) => state.setUserLocation);

const benchLocations = useMapStore((state :MapStore) => state.benchLocations);
const setBenchLocations = useMapStore((state :MapStore) => state.setBenchLocations);

const mapCenter = useMapStore((state :MapStore) => state.mapCenter);
const setMapCenter = useMapStore((state :MapStore) => state.setMapCenter);

const addBenchMode = useMapStore((state :MapStore) => state.addBenchMode);
const setAddBenchMode = useMapStore((state :MapStore) => state.setAddBenchMode);

const newBenchCoords = useMapStore((state :MapStore) => state.newBenchCoords);
const setNewBenchCoords = useMapStore((state :MapStore) => state.setNewBenchCoords);

const showAddBenchPopup = useMapStore((state :MapStore) => state.showAddBenchPopup);
const setShowAddBenchPopup = useMapStore((state :MapStore) => state.setShowAddBenchPopup);

const DEFAULT_ZOOM = useMapStore((state :MapStore) => state.DEFAULT_ZOOM);

 
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
  }, [setMapCenter, setUserGeoLocation, setUserLocation]);
 
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
  
  
  return (
    <div className="benchmark-main-page">
      <TitleBar />
      <div className="mapview-flex-container">      
        <ToolBar />
        {(!userLocation || !mapCenter || !userGeoLocation)?
        ( <LoadingMap/> ):
        ( <div className="mapview-map">
            <MapContainer 
              center={mapCenter} 
              zoom={DEFAULT_ZOOM} 
              scrollWheelZoom={true}
            >
              {addBenchMode && (
                <AddBenchMapClick
                  onPick={setNewBenchCoords}
                  showPopup={setShowAddBenchPopup}
                />
              )}
              <MapRefSetter />
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
                    <EditBenchPopup bench={bench}/>
                  </Popup>
                </MapMarker>
              ))}
            </MapContainer>
            {showAddBenchPopup && (
              <AddBenchPopup 
                coords={newBenchCoords!} 
                onCancelCallback={() => {
                  setShowAddBenchPopup(false);
                  setAddBenchMode(false);
                  setNewBenchCoords(null);
                }} 
              />
            )}
          </div>  
        )}        
      </div>    
    </div>    
  );
};

export default MapView;
