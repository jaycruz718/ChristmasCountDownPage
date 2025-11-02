// COUNTDOWN

const countdown = () => {
// Specify the date and time we are counting down to
const countDate = new Date("December 25, 2025 00:00:00").getTime();
const now = new Date().getTime();

// Calculates remaining time
const remainingTime = countDate - now;

// Workout the Time in days, hours, minutes seconds
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const textDay = Math.floor(remainingTime / day);
const textHour = Math.floor((remainingTime % day) / hour);
const textMinute = Math.floor((remainingTime % hour) / minute);
const textSecond = Math.floor((remainingTime % minute) / second);

// Update the HTML with the calculated values
document.querySelector(".day").innerText = textDay > 0 ? textDay : 0;
document.querySelector(".hour").innerText = textHour > 0 ? textHour : 0;
document.querySelector(".minute").innerText = textMinute > 0 ? textMinute : 0;
document.querySelector(".second").innerText = textSecond > 0 ? textSecond : 0;
}

// Run the countdown every 500ms to display the time
setInterval(countdown, 500);

// SNOW EFFECT
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
    d: Math.random() * 1,
  });
}

function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.beginPath();
  for (let i = 0; i < flakes.length; i++) {
    const f = flakes[i];
    ctx.moveTo(f.x, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
  }
  ctx.fill();
  moveSnow();
}

let angle = 0;
function moveSnow() {
  angle += 0.01;
  for (let i = 0; i < flakes.length; i++) {
    const f = flakes[i];
    f.y += Math.cos(angle + f.d) + 1 + f.r / 2;
    f.x += Math.sin(angle) * 2;

    if (f.y > canvas.height) {
      flakes[i] = {
        x: Math.random() * canvas.width,
        y: 0,
        r: f.r,
        d: f.d,
      };
    }
  }
}
setInterval(drawSnow, 25);

// MUSIC CONTROL
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");
let isPlaying = false;

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
