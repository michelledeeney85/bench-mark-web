import React from "react";

interface AddMissingBenchProps {
  onStartAddBench: () => void;
  isAddBenchMode?: boolean;
}

const AddMissingBench: React.FC<AddMissingBenchProps> = ({ onStartAddBench, isAddBenchMode }) => (
  <button className="add-missing-bench-button"
    onClick={onStartAddBench}
  >
    {isAddBenchMode ? "Click map to pick location...(or click button again to cancel)" : "Missing Bench? Click to Add (via OpenStreetMap)"}
  </button>
);

export default AddMissingBench;