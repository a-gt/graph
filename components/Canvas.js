import { useRef, useEffect, useState } from "react";
import useCanvas, { getPixelRatio } from "../lib/useCanvas";
import useTween, { update } from "../lib/useTween";

const drawCircle = (ctx, x, y, r, color = "rgb(255, 246, 230)") => {
  ctx.fillStyle = "rgba(10,10,10,0.5)";
  ctx.beginPath();
  ctx.arc(x, y + r / 4, r * 1.1, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "rgb(39, 35, 37)";
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(x, y - 10, r, 0, 2 * Math.PI);
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.stroke();
};

const roundLine = (ctx, x1, y1, x2, y2, thickness = 2) => {
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.arc(x1, y1, thickness / 2, 0, 2 * Math.PI);
  ctx.arc(x2, y2, thickness / 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  if (ctx.isPointInPath(ctx.canvas.mouseX, ctx.canvas.mouseY)) {
    ctx.strokeStyle = "#000";
  }
  ctx.lineWidth = thickness;
  ctx.stroke();
};

const drawTooltip = (ctx, mouseX, mouseY, opacity) => {
  const str = `(${mouseX},${mouseY})`;
  mouseX -= 20;
  mouseY -= 30;
  ctx.font = "26px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "hanging";
  const w = ctx.measureText(str).width;
  ctx.beginPath();
  ctx.fillStyle = `rgba(0,0,0,${opacity / 5})`;
  ctx.lineWidth = 1;
  ctx.fillRect(mouseX - (w + 30) / 2 + 12, mouseY - 33, w + 70, 50);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = `rgba(241,241,245,${opacity})`;
  ctx.strokeStyle = `rgba(0,0,161,${opacity / 2})`;
  ctx.rect(mouseX - (w + 30) / 2, mouseY - 45, w + 70, 50);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = `rgba(0,0,161,${opacity})`;
  ctx.fillText(str, mouseX + 35, mouseY - 30);
  ctx.fillStyle = `rgba(153,204,255,${opacity})`;
  ctx.beginPath();
  ctx.rect(mouseX - (w + 30) / 2 + 15, mouseY - 30, 20, 20);
  ctx.fill();
  ctx.stroke();
};

const roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
  if (typeof stroke === "undefined") {
    stroke = true;
  }
  if (typeof radius === "undefined") {
    radius = 5;
  }
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }
};

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

  const draw = (ctx) => {
    update();
    let canvas = ctx.canvas;
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    ctx.strokeStyle = "rgb(70,70,70)";
    ctx.setLineDash([3]);
    roundLine(ctx, x, 0, x, canvas.height, 2);
    roundLine(ctx, 0, y, canvas.width, y, 2);
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgb(255, 246, 230)";
    let r = radius.radius;
    //drawCircle(ctx, canvas.width - size * 2, canvas.height - size * 2, r);
    ctx.strokeStyle = "#99ccff";
    roundLine(
      ctx,
      width.width / 2,
      canvas.height - width.width / 2,
      canvas.width - width.width / 2,
      width.width / 2,
      width.width
    );
    let mouseX = canvas.mouseX;
    let mouseY = canvas.mouseY;
    drawTooltip(ctx, mouseX, mouseY, opacity.opacity);
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
        draw(ctx, ratio);
      }}
      {...props}
    />
  );
};

export default Canvas;
