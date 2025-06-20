import LocationSearchBar  from "./LocationSearchBar";
import AddBenchButton from "./AddBenchButton";
import { useMapStore, MapStore } from "../../store/MapStore";



const ToolBar = () => {
  //imports from the zustand store
    const mapRef = useMapStore((state :MapStore) => state.mapRef);
    const DEFAULT_ZOOM = useMapStore((state :MapStore) => state.DEFAULT_ZOOM);
    const setUserLocation = useMapStore((state :MapStore) => state.setUserLocation);
    const setMapCenter = useMapStore((state :MapStore) => state.setMapCenter);
    const userGeoLocation = useMapStore((state :MapStore) => state.userGeoLocation);
    const addBenchMode = useMapStore((state :MapStore) => state.addBenchMode);
    const setAddBenchMode = useMapStore((state :MapStore) => state.setAddBenchMode);

    return (
    <div className="mapview-toolbar">
        <LocationSearchBar 
            onSearch={(lat, lon) => {
                if (mapRef) {
                    mapRef.setView([lat, lon], DEFAULT_ZOOM);
                }
                setUserLocation([lat, lon]);   // ensure user location is updated to the searched location
                setMapCenter([lat, lon]);  // update map center to the searched location
            }} 
            userLocation={userGeoLocation}
        />
        <AddBenchButton
            onStartAddBench={() => setAddBenchMode(!addBenchMode)}
            isAddBenchMode={addBenchMode}
        />
    </div>
    );
}

export default ToolBar;