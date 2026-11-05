const canvas = document.querySelector("canvas");

let ctx = canvas.getContext("2d");
let isDrowing = false;
let brushWidth = 5;

window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

const startDraw = () => {
  isDrowing = true;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
};

const stopDraw = () => {
  isDrowing = false;
};

const drawing = (e) => {
  if (!isDrowing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
