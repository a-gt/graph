import { parseFunction } from "./math.js";
import Draw from "./graphDraw";

let canvas;
let ctx;
let cache = {};
let draw = new Draw(canvas);
let precision = 1000;

let view = {
  xScale: 4,
  yScale: 4,
  xMin: -22.5,
  xMax: 22.5,
  yMin: -22.5,
  yMax: 22.5,
  point: {},
  thickness: 4,
  mouse: {
    x: 0,
    y: 0,
  },
  hovering: false,
};
let white = "rgb(255, 246, 230)";

function init(c) {
  canvas = c;
  ctx = canvas.getContext("2d");
  draw = new Draw(canvas);

  let autoScale = findAutoScale();
  view.xScale = autoScale.xScale;
  view.yScale = autoScale.yScale;
}

function toPixelCoord(x, y) {
  let pixelX = ((x - view.xMin) / (view.xMax - view.xMin)) * canvas.width;
  let pixelY = ((view.yMax - y) / (view.yMax - view.yMin)) * canvas.width;
  return { x: pixelX, y: pixelY };
}

function toUnitCoord(x, y) {
  let graphWidth = view.xMax - view.xMin;
  let graphHeight = view.yMax - view.yMin;
  return {
    x: view.xMin + (x / canvas.width) * graphWidth,
    y: view.yMax - (y / canvas.height) * graphHeight,
  };
}

function roundScale(scale) {
  if (scale >= 1 && scale <= 9) {
    return parseFloat(scale.toPrecision(1));
  } else {
    return parseFloat(scale.toPrecision(2));
  }
}

function roundTickMark(number) {
  if (number == 0) {
    return 0;
  }
  if (Math.abs(number) <= 0.0001) {
    return parseFloat(number.toPrecision(3))
      .toExponential()
      .replace("e", "*10^");
  }
  if (Math.abs(number) < 100000) {
    return parseFloat(number.toPrecision(4));
  }
  if (Math.abs(number) >= 100000) {
    return number.toPrecision(2).replace("e+", "*10^");
  }
}

function findAutoScale() {
  let xScale = view.xScale;
  let yScale = view.yScale;

  if (
    view.xMax <= view.xMin ||
    view.yMax <= view.yMin ||
    view.xScale <= 0 ||
    view.yScale <= 0
  ) {
    console.log("Error: invalid window settings");
    xScale = 4;
    yScale = 4;
  }
  if (Math.abs(view.xScale) == Infinity) {
    xScale = 4;
  } else if (Math.abs(view.yScale) == Infinity) {
    yScale = 4;
  }

  let windowLength = (view.xMax - view.xMin) / xScale;
  let windowHeight = (view.yMax - view.yMin) / yScale;

  while (windowLength > 12) {
    xScale *= 2;
    windowLength = (view.xMax - view.xMin) / xScale;
  }
  while (windowLength < 4) {
    xScale /= 2;
    windowLength = (view.xMax - view.xMin) / xScale;
  }
  while (windowHeight > 12) {
    yScale *= 2;
    windowHeight = (view.yMax - view.yMin) / yScale;
  }
  while (windowHeight < 4) {
    yScale /= 2;
    windowHeight = (view.yMax - view.yMin) / yScale;
  }
  return { xScale, yScale };
}

function drawGridLines() {
  ctx.setLineDash([3]);
  ctx.lineWidth = canvas.scale;
  let xTickRange = {
    min: Math.ceil(view.xMin / view.xScale),
    max: Math.floor(view.xMax / view.xScale),
  };
  let yTickRange = {
    min: Math.ceil(view.yMin / view.yScale),
    max: Math.floor(view.yMax / view.yScale),
  };
  for (let i = xTickRange.min; i <= xTickRange.max; i++) {
    if (i == 0) continue;
    let xDraw = toPixelCoord(i * view.xScale, 0).x;
    let yDraw = toPixelCoord(0, 0).y;
    draw.line(xDraw, 0, xDraw, canvas.height, "rgba(255,255,255,0.1)");
  }
  for (let i = yTickRange.min; i <= yTickRange.max; i++) {
    if (i == 0) continue;
    let xDraw = toPixelCoord(0, 0).x;
    let yDraw = toPixelCoord(0, i * view.yScale).y;
    draw.line(0, yDraw, canvas.width, yDraw, "rgba(255,255,255,0.1)");
  }
  ctx.setLineDash([]);
}

function drawAxes() {
  ctx.fillStyle = white;
  ctx.lineWidth = 1.5 * canvas.scale;
  // y axis
  draw.line(0, toPixelCoord(0, 0).y, canvas.width, toPixelCoord(0, 0).y, white);
  // x axis
  draw.line(
    toPixelCoord(0, 0).x,
    0,
    toPixelCoord(0, 0).x,
    canvas.height,
    white
  );

  // ticks on x axis
  ctx.textBaseline = "middle";
  // ex: min: -2, max: 3, signifies 2 ticks right of x axis, and 3 ticks left
  let xTickRange = {
    min: Math.ceil(view.xMin / view.xScale),
    max: Math.floor(view.xMax / view.xScale),
  };

  for (let i = xTickRange.min; i <= xTickRange.max; i++) {
    ctx.textAlign = "center";

    if (i == 0) continue;
    let xDisplayValue = roundTickMark(i * view.xScale);
    let xDraw = toPixelCoord(i * view.xScale, 0).x;
    let yDraw = toPixelCoord(0, 0).y;
    // ticks and labels
    draw.line(
      xDraw,
      yDraw + 5 * canvas.scale,
      xDraw,
      yDraw - 5 * canvas.scale,
      white
    );
    draw.text(xDisplayValue, xDraw, yDraw + 15 * canvas.scale);
  }

  // ticks on y axis
  // ex: min: -2, max: 3, signifies 2 ticks above y axis, and 3 ticks below
  let yTickRange = {
    min: Math.ceil(view.yMin / view.yScale),
    max: Math.floor(view.yMax / view.yScale),
  };

  for (let i = yTickRange.min; i <= yTickRange.max; i++) {
    if (i == 0) continue;
    ctx.textAlign = "end";

    let yDisplayValue = roundTickMark(i * view.yScale);
    let xDraw = toPixelCoord(0, 0).x;
    let yDraw = toPixelCoord(0, i * view.yScale).y;
    // ticks and labels
    draw.line(
      xDraw - 5 * canvas.scale,
      yDraw,
      xDraw + 5 * canvas.scale,
      yDraw,
      white
    );
    draw.text(yDisplayValue, xDraw - 10 * canvas.scale, yDraw);
  }
}

function drawGraph(expr, color = white, id) {
  let previousDerivative = 0;
  let previousX = 0;
  let thickness = view.thickness;
  if (view.point.id == id) thickness = 7;
  if (cache[expr]) {
    cache[expr].forEach((points) => {
      if (!points[1] && !points[3]) {
        return;
      }
      draw.line(
        toPixelCoord(points[0], 0).x,
        toPixelCoord(0, points[1]).y,
        toPixelCoord(points[2], 0).x,
        toPixelCoord(0, points[3]).y,
        color,
        thickness
      );
    });
    return;
  }
  cache[expr] = [];
  for (let i = 0; i < precision; i++) {
    let currentX = view.xMin + (i / precision) * (view.xMax - view.xMin);
    let nextX = view.xMin + ((i + 1) * (view.xMax - view.xMin)) / precision;
    let currentY = expr.evaluate({ x: currentX, e: Math.E });
    let nextY = expr.evaluate({ x: nextX, e: Math.E });

    if (!currentY && !nextY) {
      continue;
    }

    // When the derivative of the graph changes from positive to negative, assume that it's trying to graph an asymptote
    let currentDerivative = (nextY - currentY) / (nextX - currentX);
    if (currentDerivative * previousDerivative >= 0) {
      draw.line(
        toPixelCoord(currentX, 0).x,
        toPixelCoord(0, currentY).y,
        toPixelCoord(nextX, 0).x,
        toPixelCoord(0, nextY).y,
        color,
        thickness
      );
      cache[expr].push([currentX, currentY, nextX, nextY]);
      // Graphs more precisely around asymptotes. Fixes issue where lines that approach asymptotes suddenly cut off
    } else {
      // If curve approaches asymptote from left side
      if (
        Math.abs(previousDerivative) < Math.abs(currentDerivative) ||
        !currentDerivative
      ) {
        graphAroundAsymptote(
          expr,
          currentX,
          nextX,
          previousDerivative,
          20,
          color,
          thickness
        );
        // If curve approaches asymptote from right side
      } else {
        graphAroundAsymptote(
          expr,
          nextX,
          previousX,
          currentDerivative,
          20,
          color,
          thickness
        );
      }
      draw.line(
        toPixelCoord(currentX, 0).x,
        toPixelCoord(0, currentY).y,
        toPixelCoord(nextX, 0).x,
        toPixelCoord(0, currentY).y,
        color,
        thickness
      );
      //cache[expr].push([currentX, currentY, nextX, nextY]);
    }
    previousDerivative = currentDerivative;
    previousX = currentX;
  }
}

// graphAroundAsymptote recursively graphs more accurately around asymptotes. It fixes the issue where the curve that approaches asymptotes suddenly cut off
function graphAroundAsymptote(
  expr,
  aX1,
  aX2,
  previousDerivative,
  depth,
  color,
  thickness
) {
  let precision = 2;
  for (let j = 0; j < precision; j++) {
    let currentX = aX1 + ((aX2 - aX1) * j) / precision;
    let nextX = aX1 + ((aX2 - aX1) * (j + 1)) / precision;
    let currentY = expr.evaluate({ x: currentX, e: Math.E });
    let nextY = expr.evaluate({ x: nextX, e: Math.E });
    let currentDerivative = (nextY - currentY) / (nextX - currentX);
    // Makes ure that when it is graphing around asymptotes, it doesn't accidently connect points through an asymptote
    if (currentDerivative * previousDerivative >= 0) {
      draw.line(
        toPixelCoord(currentX, 0).x,
        toPixelCoord(0, currentY).y,
        toPixelCoord(nextX, 0).x,
        toPixelCoord(0, nextY).y,
        color,
        thickness
      );
      cache[expr].push([currentX, currentY, nextX, nextY]);
    } else {
      if (depth > 1) {
        graphAroundAsymptote(
          expr,
          currentX,
          nextX,
          previousDerivative,
          depth - 1,
          color,
          thickness
        );
      }
      return;
    }
    previousDerivative = currentDerivative;
  }
}

function drawPoint(x, y, color) {
  let pointX = toPixelCoord(x, 0).x;
  let pointY = toPixelCoord(0, y).y;
  draw.colorCircle(pointX, pointY, 7, color);
  const str = `(${roundTickMark(x)}, ${roundTickMark(y)})`;
  pointX -= 20;
  pointY -= 30;
  ctx.font = "22px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "hanging";
  const w = ctx.measureText(str).width;
  ctx.beginPath();
  ctx.fillStyle = `rgba(0,0,0,0.2)`;
  ctx.lineWidth = 1;
  ctx.rect(pointX - (w + 30) / 2 + 12, pointY - 33, w + 70, 50);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = `rgb(241,241,245)`;
  ctx.strokeStyle = `rgba(10,10,50,0.5)`;
  ctx.rect(pointX - (w + 30) / 2, pointY - 45, w + 70, 50);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = `rgb(0,0,161)`;
  ctx.fillText(str, pointX + 35, pointY - 30);
  ctx.fillStyle = view.point.color;
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.beginPath();
  ctx.rect(pointX - (w + 30) / 2 + 15, pointY - 30, 20, 20);
  ctx.fill();
  ctx.stroke();
}

function drawMouseLines(x, y) {
  if (!view.hovering) return;
  ctx.setLineDash([3]);
  ctx.lineWidth = canvas.scale;
  draw.line(0, y, canvas.width, y, "rgba(255,255,255,0.1)");
  draw.line(x, 0, x, canvas.height, "rgba(255,255,255,0.1)");
  ctx.setLineDash([]);
  ctx.textAlign = "right";
  draw.text(
    roundTickMark(toUnitCoord(0, y).y) + " ",
    canvas.width,
    y + 7 * canvas.scale
  );
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  draw.text(roundTickMark(toUnitCoord(x, 0).x), x + 15, canvas.height);
}

function render(functions, clearCache) {
  if (!canvas) return;
  if (clearCache) cache = {};
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGridLines();
  drawAxes();
  for (let key in functions) {
    try {
      drawGraph(
        parseFunction(functions[key].expression),
        functions[key].color + (key == view.point.id ? "ff" : "aa"),
        key
      );
    } catch (e) {
      console.error(e);
      console.log(functions[key].expression + " is not a valid function.");
    }
  }
  drawPoint(view.point.x, view.point.y, view.point.color);
  drawMouseLines(view.mouse.x, view.mouse.y);
}

export {
  init,
  canvas,
  ctx,
  draw,
  render,
  view,
  toPixelCoord,
  findAutoScale,
  drawGridLines,
  drawGraph,
  drawAxes,
  drawPoint,
  parseFunction,
};
