import React from "react";

interface AddMissingBenchProps {
  onStartAddBench: () => void;
  disabled?: boolean;
}

const AddMissingBench: React.FC<AddMissingBenchProps> = ({ onStartAddBench, disabled }) => (
  <button
    onClick={onStartAddBench}
    disabled={disabled}
    style={{ background: disabled ? "#eee" : "#e0e0ff", margin: "10px 0" }}
  >
    {disabled ? "Click map to pick location..." : "Missing Bench? Click to Add (via OpenStreetMap)"}
  </button>
);

export default AddMissingBench;