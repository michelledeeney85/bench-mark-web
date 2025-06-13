import { OverpassElement } from "../types/OverpassTypes";

interface BenchPopupProps {
    bench: OverpassElement;
  }
  
const BenchPopup: React.FC<BenchPopupProps> = ({ bench }) => {

    const googleMapsUrl = 
    `https://www.google.com/maps/dir/?api=1&destination=${bench.lat},${bench.lon}`;

    return (
        <div>
            <h3>{bench.tags?.name || "Unnamed Bench"}</h3>
            <p>Location: {bench.lat.toFixed(6)}, {bench.lon.toFixed(6)}</p>
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                Get Directions To Bench On Google Maps
            </a>
        </div>
    );
};
  
export default BenchPopup;