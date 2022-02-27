import { useState, useRef, useEffect } from "react";

const Input = ({ val, onChange, ...props }) => {
  const [input, setInput] = useState(val);
  const ref = useRef();

  useEffect(async () => {
    if (ref.current.math) return;
    const { MathfieldElement } = await import("mathlive");
    const mfe = new MathfieldElement();
    mfe.value = val;
    ref.current.innerHTML = "";
    ref.current.appendChild(mfe);
    ref.current.addEventListener("input", (e) => {
      // `ev.target` is an instance of `MathfieldElement`
      if (onChange) onChange(e.target.getValue("ascii-math"));
    });
    ref.current.math = true;
  }, []);

  return (
    <div
      className="w-[300px] text-black cursor-text rounded focus:ring-0 math"
      ref={ref}
    >
      {val}
    </div>
  );
  /*
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
  );*/
};

export default Input;
