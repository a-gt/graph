import { useRef, useEffect, useState } from "react";
import useCanvas from "../lib/useCanvas";
import useTween, { update } from "../lib/useTween";

const Canvas = (props) => {
  let size = 300;
  const [stop, setStop] = useState(false);
  const [r, start] = useTween({ radius: 0 }, { radius: size }, 500);
  let pr = 0;
  const draw = (ctx, frameCount) => {
    update();
    let canvas = ctx.canvas;
    let x = canvas.width / 2 - size/2;
    let y = canvas.height / 2 - size/2;
    ctx.fillStyle = "rgba(10,10,10,0.5)";
    ctx.beginPath();
    ctx.arc(x, y + r.radius / 15, r.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "rgb(39, 35, 37)";
    ctx.strokeStyle = "rgb(255, 246, 230)";
    ctx.beginPath();
    ctx.arc(x, y - 10, r.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.stroke();
  };

  const canvasRef = useCanvas(draw);

  useEffect(() => {
    start();
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} {...props} />;
};

export default Canvas;
