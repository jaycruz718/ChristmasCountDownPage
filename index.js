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
    merryText.style.fontSize = "4rem";
    merryText.style.textShadow = "0 0 40px #fff, 0 0 80px #ff0000";
    merryText.style.transition = "all 1s ease";

    // 🪞 Melt reflections
    document.querySelectorAll('.reflection').forEach(r => {
      r.style.transition = "transform 3s ease-in, opacity 3s ease-in";
      r.style.transform = "translateX(-50%) scaleY(0.1)";
      r.style.opacity = "0";
    });

    // Fade out ornaments smoothly
    document.querySelectorAll('.countdown div').forEach(o => {
      o.style.transition = "opacity 3s ease";
      o.style.opacity = "0";
    });

    // ✨ Sparkle Finale
    showSparkleFinale();

    setTimeout(() => {
      document.querySelector(".countdown").style.display = "none";
    }, 3500);
  }
}

// Run countdown
countdown();
setInterval(countdown, 500);

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

for (let i = 0; i < 100; i++) {
  flakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 4 + 1,
    d: Math.random(),
    opacity: Math.random() * 0.8 + 0.2,
  });
}

let angle = 0;
function moveSnow(speedFactor, avgAmplitude = 0) {
  angle += 0.01 + avgAmplitude / 8000;

  for (const f of flakes) {
    let fallSpeed = (Math.cos(angle + f.d) + 1 + f.r / 2) * speedFactor * (1.2 - f.r / 6);
    const swayIntensity = (5 - f.r) / 2;
    const beatSwing = Math.sin(angle * 2 + f.d * 10) * (avgAmplitude / (70 / swayIntensity));
    f.x += Math.sin(angle) * 1.2 + beatSwing;
    if (avgAmplitude > 140 && f.r > 3) {
      fallSpeed -= avgAmplitude / (50 + f.r * 4);
    }
    f.y += fallSpeed;
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

// 🎄 ORNAMENT PULSE + REFLECTIONS
// 🎄 ORNAMENT PULSE + REFLECTIONS (lightweight)
function updateOrnaments(avg) {
  const ornaments = document.querySelectorAll('.ornament');
  ornaments.forEach((ornament, i) => {
    const ball = ornament.querySelector('.ball');
    const reflection = ornament.querySelector('.reflection');
    if (!ball || !reflection) return;

    // Slight pulse based on music
    const scale = 1 + (avg / 700) * (0.4 + i * 0.08);
    ball.style.transform = `scale(${Math.min(scale, 1.15)})`;

    // Soft glow
    const glowStrength = Math.min(1, 0.3 + avg / 250);
    ball.style.boxShadow = `
      0 0 ${15 + avg / 4}px rgba(255,255,255,${glowStrength}),
      inset 0 0 22px rgba(255,255,255,0.3)
    `;

    // Slight brightness shift
    ball.style.filter = `brightness(${1 + avg / 500})`;

    // Gentle reflection widening
    reflection.style.opacity = Math.min(0.5, 0.2 + avg / 600);
    reflection.style.transform = `translateX(-50%) scaleY(-1) scaleX(${1 + avg / 900})`;
  });
}


// 🎵 MUSIC PLAYER + ANALYSER
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
let lastUpdate = 0;

function setTrack(index) {
  if (index < 0) index = playlist.length - 1;
  if (index >= playlist.length) index = 0;
  currentTrack = index;
  music.src = playlist[currentTrack].src;
  trackTitle.textContent = `Now playing: ${playlist[currentTrack].title}`;
  trackTitle.style.animation = 'none';
  void trackTitle.offsetWidth;
  trackTitle.style.animation = 'fadeInTrack 0.8s ease forwards';
  vinyl.style.animation = 'none';
  void vinyl.offsetWidth;
  vinyl.style.animation = 'vinylGlow 1.2s ease';
}

setTrack(currentTrack);
music.volume = 0.6;

window.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", () => {
    setupAudioAnalyser();
    music.play().then(() => {
      isPlaying = true;
      playBtn.textContent = "⏸️ Pause";
      vinyl.classList.add("playing");
      requestAnimationFrame(animateVisuals); // starts the visual/music analyser loop

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
    playBtn.textContent = "▶️";
    vinyl.classList.remove("playing");
  } else {
    music.play();
    playBtn.textContent = "⏸️";
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

// 🎧 AUDIO ANALYSER
// 🎧 AUDIO ANALYSER SETUP (optimized)
function setupAudioAnalyser() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(music);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 64; // lower size = lighter
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  }
}

// 🧠 Optimized Equalizer + Visual Sync
let lastFrameTime = 0;
let avgAmplitude = 0;

// 🎵 Main Music + Visual Loop
function animateVisuals(timestamp = 0) {
  if (!analyser || !dataArray) {
    requestAnimationFrame(animateVisuals);
    return;
  }

  // Update analyser only every 120ms
  if (timestamp - lastFrameTime > 120) {
    lastFrameTime = timestamp;

    analyser.getByteFrequencyData(dataArray);
    avgAmplitude = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    const step = Math.floor(dataArray.length / bars.length);
    const heights = Array.from({ length: bars.length }, (_, i) =>
      Math.max(8, (dataArray[i * step] / 255) * 25)
    );

    bars.forEach((bar, i) => {
      bar.style.height = `${heights[i]}px`;
      bar.style.opacity = 0.5 + heights[i] / 50;
    });

    const playerBeat = avgAmplitude > 120;
    const player = document.getElementById("music-player");
    const buttons = document.querySelectorAll(".control-btn");

    player.classList.toggle("beat", playerBeat);
    buttons.forEach(btn => btn.classList.toggle("beat", playerBeat));

    updateGlow(avgAmplitude);
    updateOrnaments(avgAmplitude);
  }

  requestAnimationFrame(animateVisuals);
}

// ❄️ SNOW — INDEPENDENT LOOP (ALWAYS RUNNING)
let colorCycle = 0;
function drawSnow(avg = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const speedFactor = 1 + avg / 200;
  const brightness = Math.min(1, 0.4 + avg / 400);

  colorCycle += 0.02 + avg / 10000;
  const r = Math.floor((Math.sin(colorCycle) + 1) * 127.5);
  const g = Math.floor((Math.sin(colorCycle + 2) + 1) * 127.5);
  const b = Math.floor((Math.sin(colorCycle + 4) + 1) * 127.5);

  ctx.beginPath();
  for (const f of flakes) {
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${f.opacity * brightness})`;
    ctx.moveTo(f.x, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
  }
  ctx.fill();

  const textColor = `rgb(${r}, ${g}, ${b})`;
  const glow = `0 0 15px ${textColor}, 0 0 30px ${textColor}`;
  merryText.style.color = textColor;
  merryText.style.textShadow = glow;

  moveSnow(speedFactor, avg);
}

function snowLoop() {
  // Use passive amplitude if no music has played yet
  drawSnow(avgAmplitude || 0);
  requestAnimationFrame(snowLoop);
}

// Start the snow immediately
requestAnimationFrame(snowLoop);

// Start full animation when music begins
window.addEventListener("click", () => {
  if (!audioContext) {
    setupAudioAnalyser();
    requestAnimationFrame(animateVisuals);
  }
}, { once: true });


// 🎆 Sparkle Finale
function showSparkleFinale() {
  const sparkleCanvas = document.createElement('canvas');
  sparkleCanvas.width = window.innerWidth;
  sparkleCanvas.height = window.innerHeight;
  sparkleCanvas.style.position = 'fixed';
  sparkleCanvas.style.top = '0';
  sparkleCanvas.style.left = '0';
  sparkleCanvas.style.pointerEvents = 'none';
  sparkleCanvas.style.zIndex = '10';
  document.body.appendChild(sparkleCanvas);

  const sctx = sparkleCanvas.getContext('2d');
  const sparkles = [];
  for (let i = 0; i < 80; i++) {
    sparkles.push({
      x: Math.random() * sparkleCanvas.width,
      y: Math.random() * sparkleCanvas.height / 2,
      size: Math.random() * 3 + 2,
      alpha: 1,
      speed: Math.random() * 1.5 + 0.5
    });
  }

  function animateSparkles() {
    sctx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
    sparkles.forEach(s => {
      sctx.beginPath();
      sctx.fillStyle = `rgba(255, ${200 + Math.random()*55}, ${100 + Math.random()*155}, ${s.alpha})`;
      sctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      sctx.fill();
      s.y += s.speed;
      s.alpha -= 0.01;
    });
    if (sparkles.some(s => s.alpha > 0)) requestAnimationFrame(animateSparkles);
    else sparkleCanvas.remove();
  }
  animateSparkles();
}
