import React from "react";

interface AddMissingBenchProps {
    todoProp: string;
  }

const AddMissingBench: React.FC<AddMissingBenchProps> = (
  { todoProp }) => {
  
    //todo typescript logic

  return (
    <div>TODO html {todoProp}</div>
  );
};

export default AddMissingBench;