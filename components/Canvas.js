import { useRef, useEffect, useState } from "react";
import useCanvas, { getPixelRatio } from "../lib/useCanvas";
import useTween, { update } from "../lib/useTween";
import { init, render } from "../lib/graph/renderer";
import {
  mouseUp,
  mouseDown,
  mouseMove,
  traceMouse,
  mouseOut,
  onWheel,
} from "../lib/graph/events";

const Canvas = (props) => {
  const [functions, setFunctions] = useState({
    1: {
      expression: "x",
      color: "#99ccff",
    },
    2: {
      expression: "-x",
      color: "#ff7799",
    },
    3: {
      expression: "2x",
      color: "#77ff99",
    },
    4: {
      expression: "-2x",
      color: "#ffffaa",
    },
  });

  const draw = (ctx, { drawLine, drawTooltip }) => {
    render(functions);
  };

  const canvasRef = useCanvas(draw);

  useEffect(() => {
    init(canvasRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      onMouseDown={(e) => {
        mouseDown(e, functions);
      }}
      onMouseUp={(e) => {
        mouseUp(e);
      }}
      onMouseMove={(e) => {
        mouseMove(e, functions);
        traceMouse(e, functions);
      }}
      onMouseOut={() => {
        mouseOut(functions);
      }}
      onWheel={(e) => {
        onWheel(e, functions);
      }}
      {...props}
    />
  );
};

export default Canvas;
