import { useEffect} from "react";
import { MapContainer, Popup, TileLayer} from "react-leaflet";
import MapMarker from "./MapMarker";
import ResetViewButton from "./ResetViewButton";
import EditBenchPopup from "./EditBenchPopup";
import '../../stylesheets/MapView.css';
import AddBenchPopup from "./AddBenchPopup";
import TitleBar from "./TitleBar";
import LoadingMap from "./LoadingMap";
import { useMapStore, MapStore } from "../../store/MapStore";
import ToolBar from "./ToolBar";
import { MapRefSetter } from "../helperComponents/MapRefSetter";
import { AddBenchMapClick } from "../helperComponents/AddBenchMapClick";
import { MapEventHandler } from "../helperComponents/MapEventHandler";


/** Main MapView component that renders the map and its components
* This component uses zustand store to manage the state of the map, user location, bench locations, and other map-related data
* It also handles fetching bench locations from the Overpass API
* and updating the map based on user interactions like moving the map or clicking to add a bench
* It includes a title bar, toolbar, and conditionally renders the map or a loading state */
const MapView = () => {

// #region Imports from the zustand store

//geo location of the user. This is used to set the initial map center, and Center On Me button
const userGeoLocation = useMapStore((state :MapStore) => state.userGeoLocation);
const setUserGeoLocation = useMapStore((state :MapStore) => state.setUserGeoLocation);

// user location is used to set the marker on the map and to center the map on the user location
// This is updated dynamically using watchPosition
const userLocation = useMapStore((state :MapStore) => state.userLocation);
const setUserLocation = useMapStore((state :MapStore) => state.setUserLocation);

// Bench locations are fetched from the Overpass API and stored in the zustand store
// This is used to render bench markers on the map
const benchLocations = useMapStore((state :MapStore) => state.benchLocations);

// Map center is used to set the initial center of the map and to update it when the user moves
const mapCenter = useMapStore((state :MapStore) => state.mapCenter);
const setMapCenter = useMapStore((state :MapStore) => state.setMapCenter);

// Add bench mode is used to toggle the add bench mode on and off
const addBenchMode = useMapStore((state :MapStore) => state.addBenchMode);

// function to toggle the Add Bench popup visibility
const showAddBenchPopup = useMapStore((state :MapStore) => state.showAddBenchPopup);

//default zoom level for the map - hardcoded to 15
const DEFAULT_ZOOM = useMapStore((state :MapStore) => state.DEFAULT_ZOOM);

// #endregion

 
  // Set the initial map center to the user's geolocation if available
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
   
    
  return (
    //Container for the whole page
    <div className="benchmark-main-page">
      {/* Title bar at the top of the page */}
      <TitleBar />
      {/* Main content area with a flex container for the map and toolbar */}
      <div className="mapview-flex-container">  
        {/* Toolbar on the left side of the map with location search and button to add benches */}    
        <ToolBar />
        {(!userLocation || !mapCenter || !userGeoLocation)?
          // If user location, map center, or user geolocation is not available, show loading state
        ( <LoadingMap/> ):
        // If all required data is available, render the map view
        ( <div className="mapview-map">
            {/* Map container from react-leaflet with center, zoom, and scroll wheel zoom enabled */}
            <MapContainer 
              center={mapCenter} 
              zoom={DEFAULT_ZOOM} 
              scrollWheelZoom={true}
            >
              {addBenchMode && (
                // If add bench button has been clicked, add bench mode is enabled 
                // and AddBenchMapClick component is rendered, enabling the user to click on the map to add a bench
                <AddBenchMapClick/>
              )}
              {/* MapRefSetter component to get the map reference from react-leafet useMap() and save in zustand store to use in anhy component */}
              <MapRefSetter />
              {/* TileLayer to render the map tiles from OpenStreetMap - credit the opensource tools being used */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* MapEventHandler component to handle map events like moving the map and fetching benches */}
              <MapEventHandler />
              {/* Button to restore user location */}
              <ResetViewButton />
              {/* User location marker */}
              <MapMarker position={userLocation} iconType="user">
                <Popup>You are here</Popup>
              </MapMarker>
              {/* Bench markers */}
              {benchLocations.map((bench) => (
                // For each bench location, render a MapMarker with a popup to edit the bench
                // The popup contains the EditBenchPopup component which allows editing bench details
                <MapMarker key={bench.id} position={[bench.lat, bench.lon]} iconType="bench">
                  <Popup>
                    <EditBenchPopup bench={bench}/>
                  </Popup>
                </MapMarker>
              ))}
            </MapContainer>
            {showAddBenchPopup && 
              (<AddBenchPopup />)
            }
          </div>  
        )}        
      </div>    
    </div>    
  );
};

export default MapView;
