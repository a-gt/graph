import { useState } from "react";

const Input = ({ val, onChange, ...props }) => {
  const [input, setInput] = useState(val);

  return (
    <input
      type="text"
      value={input}
      className="p-1 rounded"
      onChange={(e) => {
        if (onChange) onChange(e.target.value);
        setInput(e.target.value);
      }}
      {...props}
    />
  );
};

export default Input;
