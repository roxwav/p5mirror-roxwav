let synth;
let filterNode;
let reverbNode;
let delayNode;

let started = false;
let playing = false;

const tonic = 48;
const scale = [0, 1, 4, 5, 7, 8, 10];
const noteNames = ["C", "Db", "E", "F", "G", "Ab", "Bb"];

let bpm = 98;
let stepMs = 0;
let lastStepTime = 0;
let stepIndex = 0;
let phraseLength = 16;

let invertArp = false;

let wavePad = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};

let waveAmount = 0.55;
let waveBias = 0.22;
let currentShape = "sine";

let activeNote = -1;
let particles = [];
let bgFloaties = [];

const chordDegrees = [
  [0, 2, 4],
  [0, 2, 5],
  [0, 3, 4],
  [0, 4, 6],
  [2, 4, 6],
  [1, 3, 5],
  [0, 2, 4, 6]
];

let currentChord = [0, 2, 4];
let currentPattern = [];
let bgPhase = 0;

function setup() {
  createCanvas(max(windowWidth), min(windowHeight));
  textFont("sans-serif");
  updateWavePad();
  buildFloaties();
  chooseNextChord();
  rebuildPhrase();
}

function updateWavePad() {
  wavePad.w = min(350, width * 0.38);
  wavePad.h = 240;
  wavePad.x = width - wavePad.w - 28;
  wavePad.y = 96;
}

function buildFloaties() {
  bgFloaties = [];
  for (let i = 0; i < 22; i++) {
    bgFloaties.push({
      x: random(width),
      y: random(height),
      sz: random(10, 26),
      speed: random(0.15, 0.45),
      drift: random(-0.15, 0.15),
      rot: random(TWO_PI),
      rotSpeed: random(-0.01, 0.01),
      type: floor(random(2)),
      alpha: random(22, 55)
    });
  }
}

async function startAudio() {
  if (started) return;

  await Tone.start();

  filterNode = new Tone.Filter({
    type: "lowpass",
    frequency: 1100,
    rolloff: -12,
    Q: 1.2
  });

  delayNode = new Tone.PingPongDelay({
    delayTime: "8n",
    feedback: 0.22,
    wet: 0.16
  });

  reverbNode = new Tone.Reverb({
    decay: 4.2,
    wet: 0.22,
    preDelay: 0.03
  });

  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "triangle"
    },
    envelope: {
      attack: 0.02,
      decay: 0.15,
      sustain: 0.18,
      release: 0.8
    },
    volume: -10
  });

  synth.connect(filterNode);
  filterNode.connect(delayNode);
  delayNode.connect(reverbNode);
  reverbNode.toDestination();
  filterNode.toDestination();

  started = true;
}

function draw() {
  drawBackground();

  if (playing && started) {
    runSequencer();
  }

  drawParticles();
  drawHeader();
  drawScale();
  drawArpLanes();
  drawWavePad();
  drawControls();
}

function drawBackground() {
  bgPhase += 0.004;

  const topA = color(255, 238, 246);
  const topB = color(255, 228, 240);
  const botA = color(248, 220, 234);
  const botB = color(240, 202, 223);

  for (let y = 0; y < height; y++) {
    const amt = map(y, 0, height, 0, 1);
    const blendA = lerpColor(topA, topB, 0.5 + 0.5 * sin(bgPhase));
    const blendB = lerpColor(botA, botB, 0.5 + 0.5 * cos(bgPhase * 0.8));
    stroke(lerpColor(blendA, blendB, amt));
    line(0, y, width, y);
  }

  for (let f of bgFloaties) {
    f.y -= f.speed;
    f.x += f.drift;
    f.rot += f.rotSpeed;

    if (f.y < -30) {
      f.y = height + 20;
      f.x = random(width);
    }

    push();
    translate(f.x, f.y);
    rotate(f.rot);
    noStroke();
    fill(255, 170, 205, f.alpha);

    if (f.type === 0) {
      heart(0, 0, f.sz);
    } else {
      star(0, 0, f.sz * 0.42, f.sz, 5);
    }
    pop();
  }
}

function runSequencer() {
  stepMs = 60000 / bpm / 4;
  if (millis() - lastStepTime < stepMs) return;

  lastStepTime = millis();

  if (stepIndex % phraseLength === 0) {
    chooseNextChord();
    rebuildPhrase();
  }

  const t = (stepIndex % phraseLength) / phraseLength;
  const mod = getWaveValue(t);
  const pulse = getPulseValue(t);
  const brightness = constrain(
    map(waveAmount, 0, 1, 700, 3200) + map(mod, -1.4, 1.4, -250, 450),
    250,
    5000
  );

  if (filterNode) {
    filterNode.frequency.rampTo(brightness, 0.05);
  }

  const densityGate = getDensityGate(mod);

  if (densityGate > random()) {
    const degree = currentPattern[stepIndex % currentPattern.length];
    const midi = degreeToMidi(degree) + getOctaveShift(mod);
    const velocity = constrain(map(pulse, -1, 1, 0.24, 0.78), 0.05, 1);
    const dur = pulse > 0.35 ? "16n" : "32n";

    synth.triggerAttackRelease(Tone.Frequency(midi, "midi"), dur, undefined, velocity);

    activeNote = ((degree % 7) + 7) % 7;
    spawnBurst(activeNote, velocity);
  } else {
    activeNote = -1;
  }

  stepIndex++;
}

function chooseNextChord() {
  currentChord = random(chordDegrees);
}

function rebuildPhrase() {
  currentPattern = [];

  let pool = [...currentChord];
  if (invertArp) {
    pool.reverse();
  }

  for (let i = 0; i < phraseLength; i++) {
    const t = i / phraseLength;
    const mod = getWaveValue(t);
    const selector = map(mod, -1.4, 1.4, 0, pool.length - 1);
    let idx = constrain(round(selector + random(-0.4, 0.4)), 0, pool.length - 1);

    if (random() < 0.22) {
      idx = floor(random(pool.length));
    }

    let degree = pool[idx];

    if (random() < 0.16 && pool.length > 1) {
      degree = pool[(idx + 1) % pool.length];
    }

    if (random() < map(waveAmount, 0, 1, 0.06, 0.28)) {
      degree += random([-7, 7]);
    }

    currentPattern.push(degree);
  }
}

function getWaveValue(t) {
  const freq = map(waveBias, 0, 1, 0.6, 6.2);
  const amt = map(waveAmount, 0, 1, 0.25, 1.4);

  if (currentShape === "sine") {
    return sin(TWO_PI * freq * t) * amt;
  }

  if (currentShape === "triangle") {
    const x = (t * freq) % 1;
    const tri = x < 0.5 ? map(x, 0, 0.5, -1, 1) : map(x, 0.5, 1, 1, -1);
    return tri * amt;
  }

  if (currentShape === "saw") {
    const x = (t * freq) % 1;
    return map(x, 0, 1, -1, 1) * amt;
  }

  if (currentShape === "square") {
    return (sin(TWO_PI * freq * t) >= 0 ? 1 : -1) * amt;
  }

  return sin(TWO_PI * freq * t) * amt;
}

function getPulseValue(t) {
  return sin(TWO_PI * (2 + waveBias * 6) * t + waveAmount * PI * 0.8);
}

function getOctaveShift(mod) {
  if (mod > 0.72) return 12;
  if (mod < -0.72) return -12;
  return 0;
}

function getDensityGate(mod) {
  return constrain(
    map(waveAmount, 0, 1, 0.42, 0.95) + map(abs(mod), 0, 1.4, -0.04, 0.16),
    0.15,
    1
  );
}

function degreeToMidi(degree) {
  const oct = floor(degree / 7);
  const local = ((degree % 7) + 7) % 7;
  return tonic + scale[local] + oct * 12;
}

function drawHeader() {
  noStroke();
  fill(170, 84, 118);
  textSize(24);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("pastel pink phrygian dominant generator", 22, 18);

  fill(186, 118, 145, 220);
  textSize(12);
  textStyle(NORMAL);
  text("click once to enable audio. drag inside the wave pad to reshape the modulation.", 24, 50);
}

function drawScale() {
  const x = 24;
  const y = 98;
  const boxW = 76;
  const boxH = 40;

  noStroke();
  fill(255, 255, 255, 95);
  rect(x - 8, y - 10, boxW * 7 + 16, 60, 20);

  for (let i = 0; i < 7; i++) {
    const active = i === activeNote;

    fill(active ? color(255, 152, 190) : color(255, 245, 249, 235));
    rect(x + i * boxW, y, boxW - 8, boxH, 15);

    fill(active ? 255 : color(157, 85, 116));
    textAlign(CENTER, CENTER);
    textSize(14);
    textStyle(BOLD);
    text(noteNames[i], x + i * boxW + (boxW - 8) / 2, y + boxH / 2);
  }

  fill(186, 118, 145, 180);
  textSize(11);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  text("c  db  e  f  g  ab  bb", x, y + 50);
}

function drawArpLanes() {
  const x = 24;
  const y = 190;
  const w = width - wavePad.w - 80;
  const h = 350;

  noStroke();
  fill(255, 255, 255, 85);
  rect(x, y, w, h, 26);

  for (let i = 0; i < 7; i++) {
    const yy = y + map(i, 0, 6, h - 46, 46);
    stroke(255, 184, 209, 120);
    line(x + 14, yy, x + w - 14, yy);

    noStroke();
    fill(183, 111, 139, 180);
    textAlign(LEFT, CENTER);
    textSize(11);
    text(noteNames[i], x + 18, yy - 10);
  }

  for (let i = 0; i < currentPattern.length; i++) {
    const deg = ((currentPattern[i] % 7) + 7) % 7;
    const xx = x + map(i, 0, currentPattern.length - 1, 40, w - 40);
    const yy = y + map(deg, 0, 6, h - 46, 46);
    const isNow = i === (stepIndex % currentPattern.length);

    if (i < currentPattern.length - 1) {
      const nextDeg = ((currentPattern[i + 1] % 7) + 7) % 7;
      const nx = x + map(i + 1, 0, currentPattern.length - 1, 40, w - 40);
      const ny = y + map(nextDeg, 0, 6, h - 46, 46);
      stroke(255, 156, 190, isNow ? 220 : 130);
      strokeWeight(isNow ? 2.8 : 1.6);
      line(xx, yy, nx, ny);
    }

    noStroke();
    fill(255, 255, 255, isNow ? 245 : 170);
    ellipse(xx, yy, isNow ? 28 : 20, isNow ? 28 : 20);

    fill(isNow ? color(255, 132, 175) : color(244, 152, 187));
    push();
    translate(xx, yy);
    if (i % 2 === 0) {
      heart(0, 0, isNow ? 11 : 8);
    } else {
      star(0, 0, isNow ? 4 : 3, isNow ? 8 : 6, 5);
    }
    pop();
  }

  noStroke();
  fill(170, 84, 118);
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("generated arp phrase", x + 18, y + 14);
}

function drawWavePad() {
  noStroke();
  fill(255, 255, 255, 90);
  rect(wavePad.x, wavePad.y, wavePad.w, wavePad.h, 26);

  fill(170, 84, 118);
  textSize(13);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text("wave modulator", wavePad.x + 18, wavePad.y + 14);

  fill(186, 118, 145, 220);
  textSize(11);
  textStyle(NORMAL);
  text("drag x for shape / speed, drag y for amount", wavePad.x + 18, wavePad.y + 36);

  const gx = wavePad.x + 18;
  const gy = wavePad.y + 58;
  const gw = wavePad.w - 36;
  const gh = wavePad.h - 86;

  stroke(255, 188, 212, 120);
  strokeWeight(1);
  for (let i = 0; i <= 6; i++) {
    const xx = gx + (gw / 6) * i;
    line(xx, gy, xx, gy + gh);
  }
  for (let i = 0; i <= 4; i++) {
    const yy = gy + (gh / 4) * i;
    line(gx, yy, gx + gw, yy);
  }

  noFill();
  stroke(255, 136, 180);
  strokeWeight(3);

  beginShape();
  for (let i = 0; i <= 180; i++) {
    const t = i / 180;
    const v = getWaveValue(t);
    const xx = gx + t * gw;
    const yy = gy + gh * 0.5 - v * (gh * 0.28);
    vertex(xx, yy);
  }
  endShape();

  const cx = gx + waveBias * gw;
  const cy = gy + (1 - waveAmount) * gh;

  noStroke();
  fill(255, 255, 255, 235);
  ellipse(cx, cy, 22, 22);
  fill(255, 138, 182);
  ellipse(cx, cy, 10, 10);

  fill(186, 118, 145);
  textAlign(LEFT, TOP);
  textSize(12);
  text("shape: " + currentShape, gx, gy + gh + 10);
}

function drawControls() {
  const x = width - wavePad.w - 12;
  const y = 575;

  drawButton(x, y, 146, 40, playing ? "stop" : "play", playing);
  drawButton(x + 160, y, 146, 40, invertArp ? "inversion on" : "inversion off", invertArp);
  drawButton(x + 320, y, 122, 40, "new phrase", false);

  noStroke();
  fill(186, 118, 145);
  textAlign(LEFT, TOP);
  textSize(12);
  text(
    "space = play/stop    i = inversion    n = new phrase    up/down = bpm\ncurrent bpm: " + bpm,
    24,
    632
  );
}

function drawButton(x, y, w, h, label, active) {
  noStroke();
  fill(0, 0, 0, 14);
  rect(x + 2, y + 3, w, h, 16);

  fill(active ? color(255, 150, 188) : color(255, 245, 249, 235));
  rect(x, y, w, h, 16);

  fill(active ? 255 : color(157, 85, 116));
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  text(label, x + w / 2, y + h / 2);
}

function spawnBurst(scaleIndex, velocity) {
  const x = 54 + map(stepIndex % currentPattern.length, 0, currentPattern.length - 1, 40, width - wavePad.w - 120);
  const y = 190 + map(scaleIndex, 0, 6, 350 - 46, 46);

  for (let i = 0; i < 7; i++) {
    particles.push({
      x,
      y,
      vx: random(-2.1, 2.1),
      vy: random(-2.8, -0.4),
      life: 1,
      size: random(5, 12) * map(velocity, 0.2, 0.9, 0.7, 1.25),
      type: floor(random(2))
    });
  }
}

function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.06;
    p.life -= 0.03;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    noStroke();
    fill(255, 150, 188, p.life * 220);

    push();
    translate(p.x, p.y);
    if (p.type === 0) {
      heart(0, 0, p.size * p.life * 0.7);
    } else {
      star(0, 0, p.size * 0.35 * p.life, p.size * p.life, 5);
    }
    pop();
  }
}

async function handleInteractionStart() {
  await startAudio();

  const baseX = width - wavePad.w - 12;
  const baseY = 575;

  if (pointInRect(mouseX, mouseY, baseX, baseY, 146, 40)) {
    playing = !playing;
    return;
  }

  if (pointInRect(mouseX, mouseY, baseX + 160, baseY, 146, 40)) {
    invertArp = !invertArp;
    rebuildPhrase();
    return;
  }

  if (pointInRect(mouseX, mouseY, baseX + 320, baseY, 122, 40)) {
    chooseNextChord();
    rebuildPhrase();
    return;
  }

  if (pointInRect(mouseX, mouseY, wavePad.x, wavePad.y, wavePad.w, wavePad.h)) {
    updateWaveFromMouse();
    return;
  }

  if (!playing) {
    playing = true;
  }
}

function updateWaveFromMouse() {
  const gx = wavePad.x + 18;
  const gy = wavePad.y + 58;
  const gw = wavePad.w - 36;
  const gh = wavePad.h - 86;

  waveBias = constrain((mouseX - gx) / gw, 0, 1);
  waveAmount = constrain(1 - (mouseY - gy) / gh, 0, 1);

  if (waveBias < 0.25) {
    currentShape = "sine";
  } else if (waveBias < 0.5) {
    currentShape = "triangle";
  } else if (waveBias < 0.75) {
    currentShape = "saw";
  } else {
    currentShape = "square";
  }

  rebuildPhrase();
}

function mousePressed() {
  handleInteractionStart();
}

function mouseDragged() {
  if (pointInRect(mouseX, mouseY, wavePad.x, wavePad.y, wavePad.w, wavePad.h)) {
    updateWaveFromMouse();
  }
}

function keyPressed() {
  if (key === " ") {
    if (!started) {
      startAudio().then(() => {
        playing = !playing;
      });
    } else {
      playing = !playing;
    }
    return false;
  }

  if (key === "i" || key === "I") {
    invertArp = !invertArp;
    rebuildPhrase();
    return false;
  }

  if (key === "n" || key === "N") {
    chooseNextChord();
    rebuildPhrase();
    return false;
  }

  if (keyCode === UP_ARROW) {
    bpm = min(180, bpm + 2);
    return false;
  }

  if (keyCode === DOWN_ARROW) {
    bpm = max(50, bpm - 2);
    return false;
  }

  return false;
}

function pointInRect(px, py, x, y, w, h) {
  return px >= x && px <= x + w && py >= y && py <= y + h;
}

function heart(x, y, sz) {
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.12) {
    const xx = x + (sz * 16 * pow(sin(a), 3)) / 16;
    const yy = y - (sz * (13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a))) / 16;
    vertex(xx, yy);
  }
  endShape(CLOSE);
}

function star(x, y, r1, r2, pts) {
  beginShape();
  for (let i = 0; i < pts * 2; i++) {
    const r = i % 2 === 0 ? r2 : r1;
    const a = (i / (pts * 2)) * TWO_PI - HALF_PI;
    vertex(x + cos(a) * r, y + sin(a) * r);
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(min(windowWidth, 980), 700);
  updateWavePad();
  buildFloaties();
}