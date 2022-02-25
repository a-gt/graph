const useDraw = (ctx) => {
  ctx.font = "IBM Plex Mono";
  const drawCircle = (x, y, r, color = "rgb(255, 246, 230)") => {
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

  const drawLine = (x1, y1, x2, y2, thickness = 2) => {
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

  const drawTooltip = (mouseX, mouseY, opacity) => {
    const str = `(${Math.round(mouseX)},${Math.round(mouseY)})`;
    mouseX -= 20;
    mouseY -= 30;
    ctx.font = "22px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "hanging";
    const w = ctx.measureText(str).width;
    ctx.beginPath();
    ctx.fillStyle = `rgba(0,0,0,${opacity / 5})`;
    ctx.lineWidth = 1;
    ctx.rect(mouseX - (w + 30) / 2 + 12, mouseY - 33, w + 70, 50);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = `rgba(241,241,245,${opacity})`;
    ctx.strokeStyle = `rgba(10,10,50,${opacity / 2})`;
    ctx.rect(mouseX - (w + 30) / 2, mouseY - 45, w + 70, 50);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = `rgba(0,0,161,${opacity})`;
    ctx.strokeStyle = `rgba(0,0,161,${opacity / 2})`;
    ctx.fillText(str, mouseX + 35, mouseY - 30);
    ctx.fillStyle = `rgba(153,204,255,${opacity})`;
    ctx.beginPath();
    ctx.rect(mouseX - (w + 30) / 2 + 15, mouseY - 30, 20, 20);
    ctx.fill();
    ctx.stroke();
  };

  const drawRect = (x, y, width, height, radius, fill, stroke) => {
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

  return { drawCircle, drawLine, drawTooltip, drawRect };
};

export default useDraw;
