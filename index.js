// 🎅 CHRISTMAS COUNTDOWN
function countdown() {
  const countDate = new Date("December 25, 2025 00:00:00").getTime();
  const now = new Date().getTime();
  const remainingTime = countDate - now;

  // Time constants
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Calculate remaining time
  const textDay = Math.floor(remainingTime / day);
  const textHour = Math.floor((remainingTime % day) / hour);
  const textMinute = Math.floor((remainingTime % hour) / minute);
  const textSecond = Math.floor((remainingTime % minute) / second);

  // Update the DOM safely
  document.querySelector(".day").innerText = textDay > 0 ? textDay : 0;
  document.querySelector(".hour").innerText = textHour > 0 ? textHour : 0;
  document.querySelector(".minute").innerText = textMinute > 0 ? textMinute : 0;
  document.querySelector(".second").innerText = textSecond > 0 ? textSecond : 0;

  // When countdown ends, show a message
  if (remainingTime < 0) {
    document.querySelector(".coming-soon h1").innerText = "🎁 Merry Christmas! 🎄";
    document.querySelector(".countdown").style.display = "none";
  }
}

setInterval(countdown, 500);
countdown(); // Run once immediately

// ❄️ SNOW EFFECT
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");
let flakes = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

for (let i = 0; i < 150; i++) {
  flakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 4 + 1,
    d: Math.random(),
  });
}

let angle = 0;
function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();

  for (let f of flakes) {
    ctx.moveTo(f.x, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
  }

  ctx.fill();
  moveSnow();
}

function moveSnow() {
  angle += 0.01;
  for (let f of flakes) {
    f.y += Math.cos(angle + f.d) + 1 + f.r / 2;
    f.x += Math.sin(angle) * 1.5;

    // Reset snowflake when it falls off screen
    if (f.y > canvas.height) {
      f.y = 0;
      f.x = Math.random() * canvas.width;
    }
  }
}

setInterval(drawSnow, 25);

// 🎵 MUSIC CONTROL
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");
let isPlaying = false;

// Start paused
music.volume = 0.6;

musicBtn.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    musicBtn.textContent = "🔊 Play Music";
  } else {
    music.play();
    musicBtn.textContent = "🔇 Pause Music";
  }
  isPlaying = !isPlaying;
});
