import { useState} from "react";


const SearchBar = ({ onSearch }: { onSearch: (lat: number, lon: number) => void }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        onSearch(parseFloat(lat), parseFloat(lon));
      } else {
        alert("Address not found.");
      }
    } catch (err) {
      alert("Error searching address.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSearch} style={{ position: "absolute", top: 10, left: 10, zIndex: 1000, background: "#fff", padding: 8, borderRadius: 4 }}>
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
  );
};



export default SearchBar;