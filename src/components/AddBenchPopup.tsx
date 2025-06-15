import "../stylesheets/AddBenchPopup.css";

interface AddBenchPopupProps {
  coords: [number, number];
  onCancelCallback: () => void;
}

const AddBenchPopup: React.FC<AddBenchPopupProps> = ({ coords, onCancelCallback }) => {
   
  function onContinue() {
    window.open(
                  `https://www.openstreetmap.org/edit?editor=id&lat=${coords[0]}&lon=${coords[1]}&zoom=20`,
                  "_blank"
                );
    onCancelCallback(); //callback to close the popup
  };

  return (
    <div className="add-bench-popup-overlay">
      <div className="add-bench-popup">
        <h3>Add a Bench</h3>
        <p>
          You picked: <b>{coords[0].toFixed(6)}, {coords[1].toFixed(6)}</b>
        </p>
        <p>
          You will be redirected to OpenStreetMap.<br />
          Please use their tutorial if you are unsure how to add a bench.<br />
          <p>Click "Continue" to proceed.</p>
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