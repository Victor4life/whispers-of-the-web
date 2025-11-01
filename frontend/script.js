// 🕯️ Ambient setup
const ambient = document.getElementById("ambient");
ambient.volume = 0.07;
document.addEventListener("click", () => ambient.play().catch(() => {}), {
  once: true,
});

// ❤️ Subtle heartbeat bass (for tension)
const ctx = new (window.AudioContext || window.webkitAudioContext)();
function heartbeat() {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(60, ctx.currentTime);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}
setInterval(heartbeat, 1800);

// 👁️ Fetch + play channel whisper
async function playChannel(num) {
  const messageBox = document.getElementById("message-box");
  const audioPlayer = document.getElementById("audio-player");

  if (!audioPlayer) {
    console.error("❌ Audio player element not found!");
    messageBox.textContent = "⚠️ Audio system disconnected...";
    return;
  }

  messageBox.textContent = "📡 Tuning into static...";
  try {
    const response = await fetch(`http://127.0.0.1:5000/api/channel/${num}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    console.log("🎧 Playing from:", data.audio_url);
    messageBox.textContent = data.message;
    glitchText(messageBox);

    audioPlayer.src = data.audio_url.startsWith("http")
      ? data.audio_url
      : `http://127.0.0.1:5000${data.audio_url}`;
    await audioPlayer.play().catch(() => {
      messageBox.textContent += " (click play manually 🎧)";
    });
  } catch (error) {
    console.error("⚡ Channel fetch failed:", error);
    messageBox.textContent = "⚡ Signal lost...";
  }
}

// 🔮 Glitch text effect
function glitchText(element) {
  const original = element.textContent;
  const glitchChars = ["#", "%", "&", "@", "*", "∆", "Ω", "⛓️"];
  const interval = setInterval(() => {
    element.textContent = original
      .split("")
      .map((ch) =>
        Math.random() < 0.1
          ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
          : ch
      )
      .join("");
  }, 60);
  setTimeout(() => {
    clearInterval(interval);
    element.textContent = original;
  }, 800);
}

// 👻 Whispering Ghosts
const ghostMessages = [
  "help me",
  "it watches you",
  "404 souls found",
  "do you hear them?",
  "the web remembers",
  "don’t disconnect",
  "you’re inside it now",
];

const ghostWhispers = [
  "audio/whisper1.mp3",
  "audio/whisper2.mp3",
  "audio/whisper3.mp3",
  "audio/whisper4.mp3",
];

// 👇 Unlock AudioContext after first user gesture
document.addEventListener(
  "click",
  () => {
    if (ctx.state === "suspended") ctx.resume();
  },
  { once: true }
);

// 🩸 Auto ambient whisper loop
async function autoWhisperLoop() {
  const whisper = new Audio(
    ghostWhispers[Math.floor(Math.random() * ghostWhispers.length)]
  );
  whisper.volume = 0.8;
  try {
    await whisper.play();
  } catch {
    console.warn("👻 Whisper playback blocked until user interacts");
  }
  setTimeout(autoWhisperLoop, 25000 + Math.random() * 10000);
}

document.addEventListener(
  "click",
  () => {
    autoWhisperLoop();
  },
  { once: true }
);

// 👻 Spawn ghost (visual + close whisper)
async function spawnGhost() {
  const ghost = document.createElement("div");
  ghost.className = "ghost";
  ghost.textContent =
    ghostMessages[Math.floor(Math.random() * ghostMessages.length)];
  ghost.style.top = Math.random() * 80 + "%";
  ghost.style.left = Math.random() * 80 + "%";
  document.getElementById("ghost-container").appendChild(ghost);

  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") await audioCtx.resume();

    const whisperSrc =
      ghostWhispers[Math.floor(Math.random() * ghostWhispers.length)];
    const response = await fetch(whisperSrc);
    const buffer = await response.arrayBuffer();
    const decoded = await audioCtx.decodeAudioData(buffer);

    const source = audioCtx.createBufferSource();
    source.buffer = decoded;

    const panner = audioCtx.createStereoPanner();
    panner.pan.value = Math.random() * 2 - 1;

    const gain = audioCtx.createGain();
    gain.gain.value = 0.45;

    const delay = audioCtx.createDelay(1.0);
    delay.delayTime.value = 0.4;

    source
      .connect(panner)
      .connect(delay)
      .connect(gain)
      .connect(audioCtx.destination);
    source.start();

    let direction = Math.random() < 0.5 ? 1 : -1;
    let step = 0;
    const panInterval = setInterval(() => {
      panner.pan.value = Math.sin(step / 10) * direction;
      step++;
    }, 100);
    setTimeout(() => clearInterval(panInterval), 4000);
  } catch (err) {
    console.warn("Ghost whisper failed:", err);
    const fallback = new Audio(ghostWhispers[0]);
    fallback.volume = 0.5;
    fallback.play().catch(() => {});
  }

  setTimeout(() => ghost.remove(), 7000);
}

// 🩸 Spawn a ghost every 20 seconds
setInterval(spawnGhost, 20000);

// 👣 Ghost cursor trail
document.addEventListener("mousemove", (e) => {
  const echo = document.createElement("div");
  echo.className = "cursor-echo";
  echo.style.left = e.pageX + "px";
  echo.style.top = e.pageY + "px";
  document.body.appendChild(echo);
  setTimeout(() => echo.remove(), 800);
});

// 🔔 Ghost Call Button
const summonBtn = document.getElementById("summon-btn");
if (summonBtn) {
  summonBtn.textContent = "📞 A ghost is calling...";
  summonBtn.classList.add("call-dangling");

  summonBtn.addEventListener("click", async () => {
    const ring = new Audio("audio/ring.mp3");
    ring.volume = 0.5;
    ring.loop = true;
    await ring.play();

    document.body.classList.add("flicker");
    summonBtn.disabled = true;

    setTimeout(() => {
      ring.pause();
      document.body.classList.remove("flicker");

      const notice = document.createElement("div");
      notice.className = "ghost-notice";
      notice.textContent =
        "📞 You have picked the call of a ghost. Now play the game...";
      document.body.appendChild(notice);
      setTimeout(() => notice.remove(), 6000);

      spawnGhost();

      setTimeout(startCreepyGame, 4000);
    }, 7000);
  });
}

// 👻 Notification visual + flicker
const noticeStyle = document.createElement("style");
noticeStyle.textContent = `
  .ghost-notice {
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(10, 0, 10, 0.85);
    color: #f0f0f0;
    font-family: "Creepster", monospace;
    padding: 20px 40px;
    border: 2px solid crimson;
    border-radius: 10px;
    font-size: 1.2em;
    text-shadow: 0 0 8px red;
    z-index: 9999;
    animation: glitchText 0.1s infinite alternate;
  }

  .call-dangling {
    animation: swing 1.5s ease-in-out infinite;
  }

  @keyframes swing {
  0%,100%{transform:translateY(0)rotate(-3deg)}
  50%{transform:translateY(-10px)rotate(3deg)}
  }

  @keyframes glitchText {
    from { filter: hue-rotate(0deg); }
    to { filter: hue-rotate(60deg); }
  }

  .flicker {
    animation: flickerAnim 0.1s infinite alternate;
  }
  @keyframes flickerAnim {
    0% { filter: brightness(1); }
    100% { filter: brightness(0.5); }
  }
`;
document.head.appendChild(noticeStyle);

/////////////////////////////////////////////////
// 🕯️ THE GAME: ONE WHISPERING PRESENCE (3D AUDIO + JUMPSCARE)
/////////////////////////////////////////////////

function startCreepyGame() {
  const game = document.createElement("div");
  game.id = "whisper-game";
  game.innerHTML = `
    <div id="game-overlay">
      <div class="game-instructions">Don't look away. Type what you hear...</div>
      <input id="game-input" type="text" placeholder="_ _ _" autofocus />
    </div>
  `;
  document.body.appendChild(game);
  document.documentElement.requestFullscreen().catch(() => {});
  document.body.style.overflow = "hidden";

  const whispers = [
    "audio/game_whisper1.mp3",
    "audio/game_whisper2.mp3",
    "audio/game_whisper3.mp3",
    "audio/game_whisper4.mp3",
  ];
  let index = 0;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const gain = audioCtx.createGain();
  gain.gain.value = 1.3; // Louder whispers
  gain.connect(audioCtx.destination);

  function playNextWhisper() {
    if (index >= whispers.length) return endGame();
    fetch(whispers[index])
      .then((r) => r.arrayBuffer())
      .then((b) => audioCtx.decodeAudioData(b))
      .then((decoded) => {
        const src = audioCtx.createBufferSource();
        src.buffer = decoded;
        const panner = audioCtx.createPanner();
        panner.panningModel = "HRTF";
        const side = Math.random() < 0.5 ? -1 : 1;
        const distance = Math.random() * 2 + 1.5;
        panner.setPosition(side, 0, distance); // Feels behind the user
        src.connect(panner).connect(gain);
        src.start();
      });
    index++;
    setTimeout(playNextWhisper, 8000);
  }

  playNextWhisper();

  const input = document.getElementById("game-input");
  input.addEventListener("input", () => {
    if (input.value.toLowerCase().includes("presence")) endGame(true);
  });

  function endGame(success) {
    // 🩸 Create the end message
    const end = document.createElement("div");
    end.className = "end-message";
    end.textContent = success
      ? "The presence retreats... for now."
      : "It lingers behind you.";
    game.appendChild(end);

    // 🩶 Trigger jumpscare before ending
    setTimeout(() => triggerJumpScare(), 5000);

    setTimeout(() => {
      document.exitFullscreen().catch(() => {});
      document.body.style.overflow = "";
      game.remove();
      window.location.reload(); // auto-return
    }, 10000);
  }

  function triggerJumpScare() {
    const scare = document.createElement("div");
    scare.id = "jumpscare";
    scare.innerHTML = `<img src="images/last.jpg" alt="scare" />`;
    game.appendChild(scare);

    const scream = new Audio("audio/scream.mp3");
    scream.volume = 1.0;
    scream.play();

    setTimeout(() => {
      scare.remove();
    }, 2000);
  }
}

// 👻 Styles for game + notice
const style = document.createElement("style");
style.textContent = `
  #whisper-game {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle, #000000 70%, #210000);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: crimson;
    z-index: 999999;
    text-shadow: 0 0 20px red;
    animation: fadeIn 2s ease;
  }

  .game-instructions {
    font-size: 1.2em;
    opacity: 0.8;
    animation: pulse 2s infinite;
  }

  #game-input {
    background: none;
    border: none;
    border-bottom: 2px solid red;
    color: white;
    font-size: 2em;
    text-align: center;
    width: 50%;
    outline: none;
    margin-top: 20px;
    animation: flicker 0.15s infinite alternate;
  }

  .end-message {
    position: absolute;
    bottom: 20%;
    font-size: 1.4em;
    color: red;
    text-shadow: 0 0 15px crimson;
    animation: fadeInOut 3s ease-in-out;
  }

  #jumpscare {
    position: fixed;
    inset: 0;
    z-index: 1000000;
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: flash 0.2s ease-in-out;
  }

  #jumpscare img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: pop 0.3s ease-in;
  }

  @keyframes flash {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes pop {
    from { transform: scale(0.9); opacity: 0.8; }
    to { transform: scale(1.05); opacity: 1; }
  }

  @keyframes flicker {
    from { opacity: 0.7; }
    to { opacity: 1; }
  }

  @keyframes pulse {
    0%,100% { opacity: 0.6; }
    50% { opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInOut {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
  }
`;
document.head.appendChild(style);
