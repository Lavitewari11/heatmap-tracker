const area = document.getElementById("area");
const canvas = document.getElementById("heatmapCanvas");
const ctx = canvas.getContext("2d");

canvas.width = area.clientWidth;
canvas.height = area.clientHeight;

let points = [];

// Track movement
area.addEventListener("mousemove", (e) => {
  const rect = area.getBoundingClientRect();

  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  points.push({ x, y });

  drawHeat(x, y);
});

// Draw heat circle
function drawHeat(x, y) {
  let radius = 20;

  let gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, "rgba(255,0,0,0.6)");
  gradient.addColorStop(1, "rgba(0,0,255,0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function clearData() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points = [];
  localStorage.removeItem("heatmap");
}

// Save data
window.addEventListener("beforeunload", () => {
  localStorage.setItem("heatmap", JSON.stringify(points));
});

// Load data
window.onload = () => {
  let saved = JSON.parse(localStorage.getItem("heatmap"));
  if (saved) {
    points = saved;
    points.forEach(p => drawHeat(p.x, p.y));
  }
};

function replay() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let i = 0;

  let interval = setInterval(() => {
    if (i >= points.length) {
      clearInterval(interval);
      return;
    }

    drawHeat(points[i].x, points[i].y);
    i++;
  }, 10);
}