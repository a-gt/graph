import { useRef, useEffect, useState } from "react";
import useCanvas, { getPixelRatio } from "../lib/useCanvas";
import useTween, { update } from "../lib/useTween";
import useDraw from "../lib/useDraw";

const Canvas = (props) => {
  let size = 40; //40;
  const [radius, startAnimation] = useTween(
    { radius: 0 },
    {
      normal: { radius: size },
      grow: { radius: size + 10 },
    }
  );
  const [width, startWidth] = useTween(
    { width: 0 },
    {
      normal: { width: 5 },
      grow: { width: 12 },
    }
  );
  const [opacity, startOpacity] = useTween(
    { opacity: 0 },
    {
      normal: { opacity: 1 },
    }
  );
  const [hover, setHover] = useState(false);

  const draw = (ctx, { drawLine, drawTooltip }) => {
    update();
    let canvas = ctx.canvas;
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    ctx.strokeStyle = "rgb(70,70,70)";
    ctx.setLineDash([3]);
    drawLine(x, 0, x, canvas.height, 2);
    drawLine(0, y, canvas.width, y, 2);
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgb(255, 246, 230)";
    let r = radius.radius;
    //drawCircle(ctx, canvas.width - size * 2, canvas.height - size * 2, r);
    ctx.strokeStyle = "#99ccff";
    drawLine(
      width.width / 2,
      canvas.height - width.width / 2,
      canvas.width - width.width / 2,
      width.width / 2,
      width.width
    );
    let mouseX = canvas.mouseX;
    let mouseY = canvas.mouseY;
    drawTooltip(mouseX, mouseY, opacity.opacity);
    /*ctx.fillStyle = "#000";
    if (mouseX >= 10 && mouseX <= 110 && mouseY >= 10 && mouseY <= 110)
      ctx.fillStyle = "#fff";
    roundRect(ctx, 10, 10, 100, 100, 10, true, false);*/
  };

  const canvasRef = useCanvas(draw);

  useEffect(() => {
    //startAnimation("normal", 500);
    startWidth("normal", 500);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      onMouseEnter={() => {
        startAnimation("normal", 200);
        startWidth("grow", 150);
        startOpacity("normal", 150);
        setHover(true);
      }}
      onMouseLeave={() => {
        startAnimation("start", 200);
        startWidth("normal", 150);
        startOpacity("start", 150);
        setHover(false);
      }}
      onMouseMove={(event) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let ratio = getPixelRatio(ctx);
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        canvasRef.current.mouseX = x * ratio;
        canvasRef.current.mouseY = y * ratio;
        setHover(true);
        //draw(ctx, ratio);
      }}
      {...props}
    />
  );
};

export default Canvas;
