import { useState } from "react";

// Type definitions for Nominatim search results (Nominatim is an OpenStreetMap search service)
interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  importance?: number;
  _distance?: number; // Optional property for calculated distance
}

// Props for the LocationSearchBar component
interface LocationSearchProps {
  onSearch: (lat: number, lon: number) => void;
  userLocation?: [number, number] | null;
}

// Function to calculate distance between two geographical points using Haversine formula
function distanceDiff(
  lat1: number, lon1: number, lat2: number, lon2: number
): number {
  // Returns distance in km
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const LocationSearchBar = ({ onSearch, userLocation }: LocationSearchProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Function to handle search submission
  // It fetches results from Nominatim API based on the user's query
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setShowResults(false);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      let data: NominatimResult[] = await res.json();

      // If userLocation is provided, sort by distance, then importance
      if (userLocation) {
        data = data
          .map(item => ({
            ...item,
            _distance: distanceDiff(
              userLocation[0],
              userLocation[1],
              parseFloat(item.lat),
              parseFloat(item.lon)
            ),
          }))
          .sort((a, b) => {
            // Sort by distance, then importance (if available)
            if (a._distance !== b._distance) {
              return a._distance - b._distance;
            }
            return (b.importance || 0) - (a.importance || 0);
          });
      }
      setResults(data);
      setShowResults(true);
    } catch (err) {
      alert("Error searching address.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleResultClick = (lat: string, lon: string) => {
    setShowResults(false);
    setResults([]);
    setQuery("");
    onSearch(parseFloat(lat), parseFloat(lon));
  };

  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000, width: 300 }}>
      <form
        onSubmit={handleSearch}
        style={{
          background: "#fff",
          padding: 8,
          borderRadius: 4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
        autoComplete="off"
      >
        <input
          type="text"
          value={query}
          placeholder="Search address..."
          onChange={e => setQuery(e.target.value)}
          style={{ padding: 4, width: 180 }}
        />
        <button type="submit" disabled={loading} style={{ marginLeft: 4 }}>
          {loading ? "Searching..." : "Go"}
        </button>
      </form>
      {showResults && results.length > 0 && (
        <div
          style={{
            maxHeight: 250,
            overflowY: "auto",
            background: "#fff",
            borderRadius: 4,
            marginTop: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            padding: 0,
          }}
        >
          {results.map((result, idx) => (
            <div
              key={idx}
              onClick={() => handleResultClick(result.lat, result.lon)}
              style={{
                padding: "8px 12px",
                borderBottom: idx !== results.length - 1 ? "1px solid #eee" : "none",
                cursor: "pointer",
                fontSize: 14,
              }}
              title={result.display_name}
            >
              {userLocation && result._distance !== undefined && (
                <span style={{ color: "#888", fontSize: 12, marginLeft: 8 }}>
                  {result.display_name} : ({result._distance!.toFixed(1)} km)
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearchBar;
