import { OverpassElement } from "../../types/OverpassTypes";
import "../../stylesheets/EditBenchPopup.css";

interface EditBenchPopupProps {
    bench: OverpassElement;
  }
  
const EditBenchPopup: React.FC<EditBenchPopupProps> = ({ bench }) => {

    const googleMapsUrl = 
    `https://www.google.com/maps/dir/?api=1&destination=${bench.lat},${bench.lon}`;

    const updateInfoUrl =
    `https://www.openstreetmap.org/edit?editor=id&node=${bench.id}`;

    return (
        <div className="bench-popup">
            <div className="bench-header no-bottom-border">
                <b>{bench.tags?.name || `BenchID : ${bench.id}`}</b>
            </div>            
            <div className="bench-info no-bottom-border">
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
            <div className="bench-button no-bottom-border">
                <a href={updateInfoUrl} target="_blank" rel="noopener noreferrer">
                    Edit Bench Info (via OpenStreetMap)
                </a>
            </div> 
            <div className="bench-button">
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    Get Directions (via Google Maps)
                </a>
            </div>     
        </div>
    );
};
  
export default EditBenchPopup;