import "../../stylesheets/AddBenchPopup.css";
import { useMapStore, MapStore } from "../../store/MapStore";

const AddBenchPopup = () => {
  const newBenchCoords = useMapStore((state: MapStore) => state.newBenchCoords);
  const setShowAddBenchPopup = useMapStore((state: MapStore) => state.setShowAddBenchPopup);
  const setAddBenchMode = useMapStore((state: MapStore) => state.setAddBenchMode);
  const setNewBenchCoords = useMapStore((state: MapStore) => state.setNewBenchCoords);
   
  function onContinue() {
    window.open(
                  `https://www.openstreetmap.org/edit?editor=id&lat=${newBenchCoords![0]}&lon=${newBenchCoords![1]}&zoom=20`,
                  "_blank"
                );    
  };

  //close the popup
  function onCancelCallback() {
    setShowAddBenchPopup(false);
    setAddBenchMode(false);
    setNewBenchCoords(null); 
  }

  return (
    <div className="add-bench-popup-overlay">
      <div className="add-bench-popup">
        <h3>Add a Bench</h3><br/>
        <p>
          You will be redirected to OpenStreetMap's edit tool.<br />
          Thank you for contributing!<br /><br />
          Click "Continue" to proceed.
        </p>
        <div className="add-bench-popup-buttons">
          <button onClick={onCancelCallback}>Cancel</button>
          <button onClick={onContinue} style={{marginLeft: "10px"}}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export default AddBenchPopup;