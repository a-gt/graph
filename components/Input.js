import { useState, useRef, useEffect } from "react";

const Input = ({ val, onChange, ...props }) => {
  const [input, setInput] = useState(val);
  const ref = useRef();

  useEffect(async () => {
    if (ref.current.math) return;
    const { MathfieldElement } = await import("mathlive");
    const mfe = new MathfieldElement();
    mfe.value = val;
    mfe.setOptions({
      virtualKeyboardMode: "manual",
      virtualKeyboardTheme: "apple",
    });
    mfe.innerHTML +=
      "<style>.ML__fieldcontainer{touch-action:auto !important;}</style>";
    ref.current.innerHTML = "";
    ref.current.appendChild(mfe);
    ref.current.addEventListener("input", (e) => {
      if (onChange) onChange(e.target.getValue("ascii-math"));
    });
    ref.current.math = true;
  }, []);

  return (
    <div
      className="cursor-text rounded focus:ring-0 math no-tap"
      ref={ref}
    ></div>
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
