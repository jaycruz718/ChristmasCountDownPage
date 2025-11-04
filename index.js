// 🎄 CHRISTMAS COUNTDOWN
const merryText = document.getElementById("merry-text");

function countdown() {
  const countDate = new Date("December 25, 2025 00:00:00").getTime();
  const now = new Date().getTime();
  const remainingTime = countDate - now;

  const second = 1000, minute = 60 * second, hour = 60 * minute, day = 24 * hour;

  const textDay = Math.floor(remainingTime / day);
  const textHour = Math.floor((remainingTime % day) / hour);
  const textMinute = Math.floor((remainingTime % hour) / minute);
  const textSecond = Math.floor((remainingTime % minute) / second);

  document.querySelector(".day").innerText = Math.max(textDay, 0);
  document.querySelector(".hour").innerText = Math.max(textHour, 0);
  document.querySelector(".minute").innerText = Math.max(textMinute, 0);
  document.querySelector(".second").innerText = Math.max(textSecond, 0);

  if (remainingTime < 0) {
    merryText.innerText = "🎁 Merry Christmas! 🎄";
    document.querySelector(".countdown").style.display = "none";
  }
}
setInterval(countdown, 500);
countdown();


// ❄️ SNOW SETUP
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
    opacity: Math.random() * 0.8 + 0.2,
  });
}

let angle = 0;
function moveSnow(speedFactor) {
  angle += 0.01;
  for (const f of flakes) {
    f.y += (Math.cos(angle + f.d) + 1 + f.r / 2) * speedFactor;
    f.x += Math.sin(angle) * 1.5;
    if (f.y > canvas.height) {
      f.y = 0;
      f.x = Math.random() * canvas.width;
    }
  }
}


// 🌈 BACKGROUND GLOW SYNC
const bgGlow = document.getElementById("bg-glow");
function updateGlow(avg) {
  if (!bgGlow) return;
  const glowOpacity = Math.min(0.8, 0.3 + avg / 600);
  bgGlow.style.opacity = glowOpacity;
}


// 🎵 MULTI-SONG MUSIC PLAYER + ANALYSER
const music = document.getElementById("bg-music");
const playBtn = document.getElementById("music-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const trackTitle = document.getElementById("track-text");
const vinyl = document.getElementById("vinyl");
const bars = document.querySelectorAll("#music-equalizer .bar");

const playlist = [
  { src: "./images/12days.mp3", title: "🎶 12 Days of Christmas" },
  { src: "./images/a-christmas-wonderland.mp3", title: "🎄 A Christmas Wonderland" },
  { src: "./images/carol-of-the-bells.mp3", title: "🔔 Carol of the Bells" },
  { src: "./images/deck_the_halls.mp3", title: "🎅 Deck the Halls" },
  { src: "./images/holiday-christmas-jazz-music.mp3", title: "🎷 Holiday Christmas Jazz" }
];

let currentTrack = 0;
let isPlaying = false;
let audioContext, analyser, dataArray;

function setTrack(index) {
  if (index < 0) index = playlist.length - 1;
  if (index >= playlist.length) index = 0;
  currentTrack = index;
  music.src = playlist[currentTrack].src;
  trackTitle.textContent = `Now playing: ${playlist[currentTrack].title}`;

  // 💫 Trigger fade animation every time song changes
  trackTitle.style.animation = 'none';
  void trackTitle.offsetWidth; // force reflow
  trackTitle.style.animation = 'fadeInTrack 0.8s ease forwards';
}

setTrack(currentTrack);
music.volume = 0.6;

// Start after user click (browser autoplay policy)
window.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", () => {
    setupAudioAnalyser();
    music.play().then(() => {
      isPlaying = true;
      playBtn.textContent = "⏸️ Pause";
      vinyl.classList.add("playing");
      animateEqualizer();
    });
  }, { once: true });
});

function playTrack(index) {
  setTrack(index);
  music.play();
  isPlaying = true;
  playBtn.textContent = "⏸️ Pause";
  vinyl.classList.add("playing");
}

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    music.pause();
    playBtn.textContent = "▶️ Play";
    vinyl.classList.remove("playing");
  } else {
    music.play();
    playBtn.textContent = "⏸️ Pause";
    vinyl.classList.add("playing");
  }
  isPlaying = !isPlaying;
});

nextBtn.addEventListener("click", () => playTrack(currentTrack + 1));
prevBtn.addEventListener("click", () => playTrack(currentTrack - 1));

music.addEventListener("ended", () => {
  vinyl.classList.remove("playing");
  playTrack(currentTrack + 1);
});


// 🎧 AUDIO ANALYSER + EQUALIZER
function setupAudioAnalyser() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(music);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
  }
}

function animateEqualizer() {
  if (!analyser || !dataArray) return;

  analyser.getByteFrequencyData(dataArray);
  const step = Math.floor(dataArray.length / bars.length);

  let avg = 0;
  bars.forEach((bar, i) => {
    const value = dataArray[i * step];
    const height = Math.max(8, (value / 255) * 25);
    bar.style.height = `${height}px`;
    bar.style.opacity = 0.5 + height / 50;
    avg += value; // ✅ accumulate properly
  });

  avg = avg / dataArray.length; // ✅ correct average

  // 🎶 BEAT REACTIVE GLOW
  const player = document.getElementById("music-player");
  const buttons = document.querySelectorAll(".control-btn");

  if (avg > 120) {
    player.classList.add("beat");
    buttons.forEach(btn => btn.classList.add("beat"));
  } else {
    player.classList.remove("beat");
    buttons.forEach(btn => btn.classList.remove("beat"));
  }

  // 🎅 Countdown glow sync
  const countdownBox = document.querySelector(".coming-soon");
  if (avg > 130) {
    countdownBox.style.textShadow = "0 0 25px rgba(255,255,255,0.8)";
    countdownBox.style.transform = "scale(1.02)";
  } else {
    countdownBox.style.textShadow = "0 0 10px rgba(255,255,255,0.3)";
    countdownBox.style.transform = "scale(1)";
  }

  requestAnimationFrame(animateEqualizer);
}


// ❄️ DRAW EVERYTHING
let colorCycle = 0;

function drawSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let avg = 0;
  if (analyser && dataArray) {
    analyser.getByteFrequencyData(dataArray);
    avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
  }

  updateGlow(avg);

  const speedFactor = 1 + avg / 200;
  const brightness = Math.min(1, 0.4 + avg / 400);

  // Color pulse red → green → white
  colorCycle += 0.02 + avg / 10000;
  const r = Math.floor((Math.sin(colorCycle) + 1) * 127.5);
  const g = Math.floor((Math.sin(colorCycle + 2) + 1) * 127.5);
  const b = Math.floor((Math.sin(colorCycle + 4) + 1) * 127.5);

  // Draw flakes
  ctx.beginPath();
  for (const f of flakes) {
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${f.opacity * brightness})`;
    ctx.moveTo(f.x, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
  }
  ctx.fill();

  // Update glowing text color
  const textColor = `rgb(${r}, ${g}, ${b})`;
  const glow = `0 0 15px ${textColor}, 0 0 30px ${textColor}`;
  merryText.style.color = textColor;
  merryText.style.textShadow = glow;

  moveSnow(speedFactor);
}

setInterval(drawSnow, 25);

