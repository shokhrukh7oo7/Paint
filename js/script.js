// global variables
const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear-canvas");
const saveImageBtn = document.querySelector(".save-img");

// variables
let ctx = canvas.getContext("2d");
let isDrowing = false;
let brushWidth = 5;
let selectedTool = "brush";
let selectedColor = "#000";
let prevMouseX;
let prevMouseY;
let snapshot;

// set background canvas save image
const setCanvasBackground = () => {
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

// set canvas width and height
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

// start drawing
const startDraw = (e) => {
  isDrowing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// stop drawing
const stopDraw = () => {
  isDrowing = false;
};

// tools btn
toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

// draw rectangle
const drawRectangle = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
  }
  ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
};

// drawCircle
const drawCircle = (e) => {
  ctx.beginPath();
  const radius = Math.sqrt(Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2));
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  if (fillColor.checked) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

// drawTriangle
const drawTriangle = (e) => {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  if (fillColor.checked) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
};

// drawing
const drawing = (e) => {
  if (!isDrowing) return;
  ctx.putImageData(snapshot, 0, 0);

  if (selectedTool == "brush" || selectedTool == "eraser") {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }

  switch (selectedTool) {
    case "brush":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;

    case "rectangle":
      drawRectangle(e);
      break;

    case "circle":
      drawCircle(e);
      break;

    case "triangle":
      drawTriangle(e);
      break;

    case "eraser":
      ctx.strokeStyle = "#FFF";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    default:
      break;
  }
};

// change brush width
sizeSlider.addEventListener("change", () => {
  brushWidth = sizeSlider.value;
});

// set color to shapes
colorBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document.querySelector(".options .selected").classList.remove("selected");
    btn.classList.add("selected");
    const bgColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    selectedColor = bgColor;
  });
});

// set color from color picker
colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.background = colorPicker.value;
  colorPicker.parentElement.click();
});

// clear canvas btn
clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

// save image btn
saveImageBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `Paint ${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", stopDraw);
