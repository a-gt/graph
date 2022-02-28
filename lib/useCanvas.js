import { useRef, useEffect, useState } from "react";
import getDraw from "./useDraw";

export const getPixelRatio = (context) => {
  var backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  return (window.devicePixelRatio || 1) / backingStore;
};

function resizeCanvasToDisplaySize(context, canvas) {
  let ratio = getPixelRatio(context);
  let width = getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
  let height = getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

const useCanvas = (draw, dependencies = []) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrameId;
    let ratio = getPixelRatio(context);
    canvas.ratio = ratio;
    canvas.scale = ratio;
    resizeCanvasToDisplaySize(context, canvas);
    window.onresize = () => {
      resizeCanvasToDisplaySize(context, canvas);
    };
    const drawFunctions = getDraw(context);
    canvas.draw = drawFunctions;
    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      draw(context, drawFunctions);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, ...dependencies]);
  return canvasRef;
};

export default useCanvas;
