let T;

const TONIC = 60;

const MODES = {
  phrygian: { name: "phrygian dom", ivs: [0, 1, 4, 5, 7, 8, 10], dot: [255, 110, 135], bg: [255, 232, 235] },
  mixo: { name: "mixolydian", ivs: [0, 2, 4, 5, 7, 9, 10], dot: [255, 185, 70], bg: [255, 248, 222] },
  lydian: { name: "lydian", ivs: [0, 2, 4, 6, 7, 9, 11], dot: [185, 115, 255], bg: [245, 230, 255] },
  dorian: { name: "dorian", ivs: [0, 2, 3, 5, 7, 9, 10], dot: [95, 145, 255], bg: [228, 238, 255] }
};

const XFORMS = ["orig", "pitch-rev", "inv", "+5", "r-inv", "retro"];
const TRANSFORM_STYLE = ["modal", "strict"];
const mKeys = Object.keys(MODES);

const BASE = [
  [0, 0],
  [1, 0.5],
  [2, 1],
  [3, 1.5],
  [4, 2],
  [3, 2.75],
  [2, 3.25],
  [1, 3.75],
  [0, 4.25]
].map(([deg, t]) => ({
  deg,
  p: 0,
  t,
  d: t === 2 ? 0.6 : t === 4.25 ? 0.8 : 0.4,
  v: 0.75
}));

let synth, part;
let playing = false;
let modeKey = "phrygian";
let xform = 0;
let tStyle = 0;
let notes = [];
let idx = -1;
let bpm = 120;
let sparkles = [];
let floaties = [];

function hz(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

function nm(m) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const rounded = Math.round(m);
  return names[((rounded % 12) + 12) % 12] + (Math.floor(rounded / 12) - 1);
}

function getScalePitches() {
  const ivs = MODES[modeKey].ivs;
  return [...ivs.map(iv => TONIC + iv), TONIC + 12];
}

function degreeToPitch(deg) {
  const scale = getScalePitches();
  const octaveSize = 7;
  const oct = Math.floor(deg / octaveSize);
  const local = ((deg % octaveSize) + octaveSize) % octaveSize;
  return scale[local] + oct * 12;
}

function snapToMode(p) {
  const ivs = MODES[modeKey].ivs;
  const rel = p - TONIC;
  const oct = Math.floor(rel / 12);
  const s = ((rel % 12) + 12) % 12;

  let best = ivs[0];
  let bestDist = Infinity;

  for (let iv of ivs) {
    const d = Math.abs(s - iv);
    if (d < bestDist) {
      bestDist = d;
      best = iv;
    }
  }

  return TONIC + oct * 12 + best;
}

function invertPitch(p, axis) {
  return axis * 2 - p;
}

function transposePitch(p, semitones) {
  return p + semitones;
}

function reversePitches(ns) {
  const rp = ns.map(n => n.p).reverse();
  return ns.map((n, i) => ({ ...n, p: rp[i] }));
}

function reverseFull(ns) {
  const total = ns[ns.length - 1].t + ns[ns.length - 1].d;
  const rev = [...ns].reverse().map(n => ({
    ...n,
    t: total - (n.t + n.d)
  }));
  rev.sort((a, b) => a.t - b.t);
  return rev;
}

function applySnap(ns) {
  return ns.map(n => ({ ...n, p: snapToMode(n.p) }));
}

function assignDegreesFromPitches(ns) {
  const scale = getScalePitches();
  return ns.map(n => {
    let bestIndex = 0;
    let bestDist = Infinity;

    for (let i = 0; i < scale.length; i++) {
      const d = Math.abs(n.p - scale[i]);
      if (d < bestDist) {
        bestDist = d;
        bestIndex = i;
      }
    }

    return { ...n, deg: bestIndex };
  });
}

function buildNotes() {
  let ns = BASE.map(n => ({
    ...n,
    p: degreeToPitch(n.deg)
  }));

  const ps = ns.map(n => n.p);
  const mn = Math.min(...ps);
  const mx = Math.max(...ps);
  const axis = (mn + mx) / 2;

  if (xform === 1) {
    ns = reversePitches(ns);
  }

  if (xform === 2) {
    ns = ns.map(n => ({ ...n, p: invertPitch(n.p, axis) }));
  }

  if (xform === 3) {
    ns = ns.map(n => ({ ...n, p: transposePitch(n.p, 5) }));
  }

  if (xform === 4) {
    ns = ns.map(n => ({ ...n, p: invertPitch(n.p, axis) }));
    ns = reversePitches(ns);
  }

  if (xform === 5) {
    ns = reverseFull(ns);
  }

  if (TRANSFORM_STYLE[tStyle] === "modal") {
    ns = applySnap(ns);
  }

  ns = assignDegreesFromPitches(ns);
  return ns;
}

function laneY(i) {
  return 80 + (1 - i / 7) * (height - 240);
}

function npos(i) {
  const total = notes[notes.length - 1].t + 1;
  const x = 60 + (notes[i].t / total) * (width - 110);

  if (TRANSFORM_STYLE[tStyle] === "modal") {
    return {
      x,
      y: laneY(notes[i].deg)
    };
  }

  const minP = TONIC;
  const maxP = TONIC + 12;
  const clamped = constrain(notes[i].p, minP - 2, maxP + 2);
  const y = 80 + (1 - (clamped - minP) / (maxP - minP)) * (height - 240);

  return { x, y };
}

function burst(pos) {
  const [r, g, b] = MODES[modeKey].dot;
  for (let k = 0; k < 8; k++) {
    sparkles.push({
      x: pos.x,
      y: pos.y,
      vx: random(-3, 3),
      vy: random(-4, -0.5),
      life: 1,
      r,
      g,
      b,
      sz: random(5, 12),
      sh: floor(random(2))
    });
  }
}

function doPlay() {
  if (part) {
    part.stop();
    part.dispose();
  }

  T.Transport.stop();
  T.Transport.position = 0;
  idx = -1;

  const events = notes.map((n, i) => [
    T.Time(`${n.t} * 4n`),
    {
      f: hz(n.p),
      d: T.Time(`${n.d} * 4n`).toSeconds(),
      v: n.v,
      i
    }
  ]);

  part = new T.Part((time, v) => {
    synth.triggerAttackRelease(v.f, v.d, time, v.v);
    T.Draw.schedule(() => {
      idx = v.i;
      burst(npos(v.i));
    }, time);
  }, events);

  part.loop = true;
  part.loopEnd = T.Time(`${notes[notes.length - 1].t + notes[notes.length - 1].d + 0.5} * 4n`);
  part.start(0);
  T.Transport.start();
}

function doStop() {
  if (part) {
    part.stop();
  }
  T.Transport.stop();
  idx = -1;
}

function rebuild() {
  notes = buildNotes();
  if (playing) {
    doPlay();
  }
}

function setup() {
  createCanvas(min(windowWidth, 1020), 620);
  T = window.Tone;

  synth = new T.PolySynth(T.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.03, decay: 0.1, sustain: 0.45, release: 1.0 },
    volume: -8
  }).toDestination();

  T.Transport.bpm.value = bpm;
  notes = buildNotes();

  for (let i = 0; i < 18; i++) {
    floaties.push({
      x: random(width),
      y: random(height),
      sz: random(8, 20),
      t: floor(random(2)),
      spd: random(0.2, 0.5),
      drift: random(-0.2, 0.2),
      a: random(25, 55),
      rot: random(TWO_PI),
      rs: random(-0.01, 0.01)
    });
  }

  textFont("sans-serif");
}

function drawScaleGrid() {
  const [dr, dg, db] = MODES[modeKey].dot;
  const scale = getScalePitches();

  for (let i = 0; i < scale.length; i++) {
    const y = laneY(i);

    stroke(dr, dg, db, 42);
    strokeWeight(1);
    line(52, y, width - 36, y);

    noStroke();
    fill(dr, dg, db, 135);
    textSize(11);
    textAlign(LEFT, CENTER);
    text(nm(scale[i]), 14, y);
  }
}

function draw() {
  const [r, g, b] = MODES[modeKey].bg;
  background(r, g, b);

  const [dr, dg, db] = MODES[modeKey].dot;

  for (let f of floaties) {
    f.y -= f.spd;
    f.x += f.drift;
    f.rot += f.rs;

    if (f.y < -20) {
      f.y = height + 15;
      f.x = random(width);
    }

    push();
    translate(f.x, f.y);
    rotate(f.rot);
    noStroke();
    fill(dr, dg, db, f.a);
    if (f.t === 0) {
      heart(0, 0, f.sz);
    } else {
      star(0, 0, f.sz * 0.4, f.sz, 5);
    }
    pop();
  }

  drawScaleGrid();

  strokeWeight(2);
  noFill();

  for (let i = 0; i < notes.length - 1; i++) {
    const a = npos(i);
    const b2 = npos(i + 1);
    stroke(dr, dg, db, i === idx || i + 1 === idx ? 200 : 88);
    line(a.x, a.y, b2.x, b2.y);
  }

  for (let i = 0; i < notes.length; i++) {
    const { x, y } = npos(i);
    const act = i === idx;
    const sz = 24;

    if (act) {
      noStroke();
      fill(dr, dg, db, 28);
      ellipse(x, y, sz * 3, sz * 3);
    }

    noStroke();
    fill(255, 255, 255, act ? 230 : 165);
    ellipse(x, y, sz + 4, sz + 4);

    fill(dr, dg, db, act ? 255 : 180);
    push();
    translate(x, y);
    if (i % 2 === 0) {
      heart(0, 0, sz * 0.55);
    } else {
      star(0, 0, sz * 0.22, sz * 0.42, 5);
    }
    pop();

    if (act) {
      noStroke();
      fill(dr, dg, db);
      textSize(10);
      textAlign(CENTER, BOTTOM);
      text(nm(notes[i].p), x, y - sz / 2 - 4);
    }
  }

  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i];
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.1;
    s.life -= 0.04;

    if (s.life <= 0) {
      sparkles.splice(i, 1);
      continue;
    }

    noStroke();
    fill(s.r, s.g, s.b, s.life * 220);
    push();
    translate(s.x, s.y);
    rotate(s.life * 3);
    if (s.sh === 0) {
      star(0, 0, s.sz * 0.35 * s.life, s.sz * s.life, 4);
    } else {
      heart(0, 0, s.sz * s.life * 0.8);
    }
    pop();
  }

  noStroke();
  fill(dr, dg, db);
  textSize(18);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text(MODES[modeKey].name + " / " + XFORMS[xform], 16, 10);

  fill(255, 255, 255, 180);
  rect(width - 110, 8, 96, 24, 12);
  fill(dr * 0.7, dg * 0.6, db * 0.7);
  textSize(11);
  textAlign(CENTER, CENTER);
  text(bpm + " bpm", width - 62, 20);

  btn("style: " + TRANSFORM_STYLE[tStyle], true, width - 180, 42, 166);

  for (let i = 0; i < mKeys.length; i++) {
    btn(MODES[mKeys[i]].name, modeKey === mKeys[i], 16 + i * 144, height - 100, 136);
  }

  for (let i = 0; i < XFORMS.length; i++) {
    btn(XFORMS[i], xform === i, 16 + i * 80, height - 58, 72);
  }

  btn(playing ? "stop" : "play", playing, width - 110, height - 58, 96);

  noStroke();
  fill(180, 160, 180, 120);
  textSize(9);
  textStyle(NORMAL);
  textAlign(RIGHT, BOTTOM);
  text("q/w/e/r=mode   1-6=xform   t=strict/modal   space=play   up/dn=bpm", width - 10, height - 4);
}

function btn(label, active, x, y, w) {
  const [r, g, b] = MODES[modeKey].dot;

  noStroke();
  fill(0, 0, 0, 8);
  rect(x + 2, y + 3, w, 26, 13);

  fill(active ? color(r, g, b) : color(255, 255, 255, 205));
  rect(x, y, w, 26, 13);

  fill(active ? 255 : color(r * 0.65, g * 0.5, b * 0.65));
  textSize(10);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + 13);
}

function heart(x, y, sz) {
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.07) {
    vertex(
      x + (sz * 16 * Math.pow(Math.sin(a), 3)) / 16,
      y - (sz * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))) / 16
    );
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

async function keyPressed() {
  await T.start();

  if (key === " ") {
    playing = !playing;
    if (playing) {
      doPlay();
    } else {
      doStop();
    }
    return false;
  }

  if (key === "t" || key === "T") {
    tStyle = (tStyle + 1) % TRANSFORM_STYLE.length;
    rebuild();
    return false;
  }

  const xi = { "1": 0, "2": 1, "3": 2, "4": 3, "5": 4, "6": 5 }[key];
  if (xi !== undefined) {
    xform = xi;
    rebuild();
    return false;
  }

  const mi = { q: 0, Q: 0, w: 1, W: 1, e: 2, E: 2, r: 3, R: 3 }[key];
  if (mi !== undefined) {
    modeKey = mKeys[mi];
    rebuild();
    return false;
  }

  if (keyCode === UP_ARROW) {
    bpm = min(240, bpm + 5);
    T.Transport.bpm.rampTo(bpm, 0.05);
    return false;
  }

  if (keyCode === DOWN_ARROW) {
    bpm = max(40, bpm - 5);
    T.Transport.bpm.rampTo(bpm, 0.05);
    return false;
  }

  return false;
}

async function mousePressed() {
  await T.start();

  if (mouseX >= width - 180 && mouseX <= width - 14 && mouseY >= 42 && mouseY <= 68) {
    tStyle = (tStyle + 1) % TRANSFORM_STYLE.length;
    rebuild();
    return;
  }

  for (let i = 0; i < mKeys.length; i++) {
    const x = 16 + i * 144;
    if (mouseX >= x && mouseX <= x + 136 && mouseY >= height - 100 && mouseY <= height - 74) {
      modeKey = mKeys[i];
      rebuild();
      return;
    }
  }

  for (let i = 0; i < XFORMS.length; i++) {
    const x = 16 + i * 80;
    if (mouseX >= x && mouseX <= x + 72 && mouseY >= height - 58 && mouseY <= height - 32) {
      xform = i;
      rebuild();
      return;
    }
  }

  if (mouseX >= width - 110 && mouseX <= width - 14 && mouseY >= height - 58 && mouseY <= height - 32) {
    playing = !playing;
    if (playing) {
      doPlay();
    } else {
      doStop();
    }
  }
}

function windowResized() {
  resizeCanvas(min(windowWidth, 1020), 620);
}