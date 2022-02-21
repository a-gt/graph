import { useRef, useEffect } from "react";

const getPixelRatio = (context) => {
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

const useCanvas = (draw, options = {}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext(options.context || "2d");
    let frameCount = 0;
    let animationFrameId;
    resizeCanvasToDisplaySize(context, canvas);
    const render = () => {
      frameCount++;
      context.clearRect(0, 0, canvas.width, canvas.height);
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);
  return canvasRef;
};

const Canvas = (props) => {
  const draw = (ctx, frameCount) => {
    let canvas = ctx.canvas;
    let r = (canvas.width / 2 - 10) * Math.sin(frameCount * 0.05) ** 2;
    ctx.fillStyle = "rgba(10,10,10,0.5)";
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2 - 10,
      canvas.height / 2 + r / 15,
      r,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.fillStyle = "rgb(255, 246, 230)";
    ctx.beginPath();
    ctx.arc(canvas.width / 2 - 10, canvas.height / 2 - 10, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "rgb(39, 35, 37)";
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2 - 10 + Math.max(r - 10, 0) / 100,
      canvas.height / 2 - 10 + Math.max(r - 10, 0) / 100,
      Math.max(r - 10, 0),
      0,
      2 * Math.PI
    );
    ctx.fill();
  };

  const canvasRef = useCanvas(draw);

  return <canvas ref={canvasRef} width={100} height={100} {...props} />;
};

export default Canvas;
