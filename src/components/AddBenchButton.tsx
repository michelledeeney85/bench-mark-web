import React from "react";

interface AddMissingBenchProps {
  onStartAddBench: () => void;
  disabled?: boolean;
}

const AddMissingBench: React.FC<AddMissingBenchProps> = ({ onStartAddBench, disabled }) => (
  <button className="add-missing-bench-button"
    onClick={onStartAddBench}
    disabled={disabled}
  >
    {disabled ? "Click map to pick location..." : "Missing Bench? Click to Add (via OpenStreetMap)"}
  </button>
);

export default AddMissingBench;