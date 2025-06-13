import { OverpassElement } from "../types/OverpassTypes";
import "../stylesheets/BenchPopup.css";

interface BenchPopupProps {
    bench: OverpassElement;
  }
  
const BenchPopup: React.FC<BenchPopupProps> = ({ bench }) => {

    const googleMapsUrl = 
    `https://www.google.com/maps/dir/?api=1&destination=${bench.lat},${bench.lon}`;

    return (
        <div>
            <h3>{bench.tags?.name || "Unnamed Bench"}</h3>            
            <div className="bench-info">
                <h4>Bench Info:</h4>
                {bench.tags?.backrest !== undefined && (
                    <p>Backrest: {bench.tags!.backrest ? "Yes" : "No"}</p>
                )}
                {bench.tags?.seats !== undefined && (
                    <p>Seats: {bench.tags!.seats}</p>
                )}
                {bench.tags?.material !== undefined && (
                    <p>Material: {bench.tags!.material}</p>
                )}
                <p>Location: {bench.lat.toFixed(6)}, {bench.lon.toFixed(6)}</p>
            </div>
            <br />           
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                Get Directions (opens google maps)
            </a>
        </div>
    );
};
  
export default BenchPopup;