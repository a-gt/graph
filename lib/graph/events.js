import { parseFunction } from "./math.js";
import { canvas, ctx, draw, view, render, toPixelCoord } from "./renderer.js";

let isDragging = false;
let draggedPoint;

function mousePos(e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) * canvas.width) / (rect.right - rect.left),
    y: ((e.clientY - rect.top) * canvas.height) / (rect.bottom - rect.top),
  };
}

// px to units
function toUnitCoord(x, y) {
  let graphWidth = view.xMax - view.xMin;
  let graphHeight = view.yMax - view.yMin;
  return {
    x: view.xMin + (x / canvas.width) * graphWidth,
    y: view.yMax - (y / canvas.height) * graphHeight,
  };
}

export const mouseDown = (e, functions) => {
  draggedPoint = mousePos(e);
  isDragging = true;
  //render(functions, true);
};

export const mouseUp = (e) => {
  isDragging = false;
};

export const mouseMove = (e, functions) => {
  let currentPos = mousePos(e);
  if (isDragging) {
    let xDiff =
      toUnitCoord(currentPos.x, 0).x - toUnitCoord(draggedPoint.x, 0).x;
    let yDiff =
      toUnitCoord(0, currentPos.y).y - toUnitCoord(0, draggedPoint.y).y;

    view.xMin -= xDiff;
    view.xMax -= xDiff;
    view.yMin -= yDiff;
    view.yMax -= yDiff;

    draggedPoint = currentPos;
    render(functions, true);
  }
  view.mouse = currentPos;
  view.hovering = true;
};

export const traceMouse = (e, functions) => {
  let mousePosX = toUnitCoord(mousePos(e).x, 0).x;
  let mousePosY = toUnitCoord(0, mousePos(e).y).y;
  let pointY;
  let pointColor;
  let pointId;
  for (let key in functions) {
    let expr = parseFunction(functions[key].expression);
    let y = expr.evaluate({ x: mousePosX, e: Math.E });
    if (
      y > view.yMin &&
      y < view.yMax &&
      Math.abs(mousePos(e).y - toPixelCoord(0, y).y) < 50
    ) {
      if (!pointY || Math.abs(y - mousePosY) < Math.abs(pointY - mousePosY)) {
        pointY = y;
        pointColor = functions[key].color;
        pointId = key;
      }
    }
  }
  // Draw point
  if (pointY && pointColor) {
    view.point.x = mousePosX;
    view.point.y = pointY;
    view.point.color = pointColor;
    view.point.id = pointId;
  } else {
    view.point = {};
  }
  //render(functions);
};

export const mouseOut = (functions) => {
  view.point = {};
  isDragging = false;
  view.hovering = false;
  //render(functions);
};

export const onWheel = (e, functions) => {
  e.preventDefault();
  let currentPos = mousePos(e);
  let gridPos = toUnitCoord(currentPos.x, currentPos.y);

  let distFromLeft = gridPos.x - view.xMin;
  let distFromRight = view.xMax - gridPos.x;
  let distFromTop = view.yMax - gridPos.y;
  let distFromBottom = gridPos.y - view.yMin;
  let factor = 0.05;
  // zoom out
  if (e.deltaY > 0) {
    view.xMin -= distFromLeft * factor;
    view.xMax += distFromRight * factor;
    view.yMin -= distFromBottom * factor;
    view.yMax += distFromTop * factor;
  }
  // zoom in
  else if (e.deltaY < 0) {
    view.xMin += distFromLeft * factor;
    view.xMax -= distFromRight * factor;
    view.yMin += distFromBottom * factor;
    view.yMax -= distFromTop * factor;
  }
  render(functions, true);
};
