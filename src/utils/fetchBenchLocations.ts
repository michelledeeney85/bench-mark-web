import { useMapStore} from "../store/MapStore";

export async function fetchBenchLocations(bounds: string) {
 const lastBoundsRef = useMapStore.getState().lastBoundsRef;
 const setLastBoundsRef = useMapStore.getState().setLastBoundsRef;
 const benchLocations = useMapStore.getState().benchLocations;
 const setBenchLocations = useMapStore.getState().setBenchLocations;

 if (lastBoundsRef === bounds) {
       return;
     }
    // Update the last bounds reference to the current bounds
    // This ensures that the next fetch will only happen if the bounds change
    setLastBoundsRef(bounds);
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
}