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

const Canvas = ({ functions, ...props }) => {
  const draw = () => {
    render(functions);
  };

  const canvasRef = useCanvas(draw, [functions]);

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
