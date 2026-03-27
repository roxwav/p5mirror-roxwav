// dark glitch phrygian
// timing
let isPlaying = false;
let startTime = 0;
let lastStep = 0;

let bpm = 80;
let stepsPerBeat = 4;
let stepInterval;
let stepIndex = 0;
let patternLength = 16;
let durationMs = 60000;

// audio
let kick, snare, hat;
let osc, env;
let reverb;

// scale
const baseMidi = 57;
const phryDom = [0, 1, 4, 5, 7, 8, 10, 12];

// melody pattern
let melodyPattern = [
  0,
  null,
  2,
  null,
  4,
  null,
  1,
  null,
  3,
  null,
  5,
  null,
  4,
  1,
  6,
  null,
];

// drum patterns
let kickPattern = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
let snarePattern = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
let hatPattern = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];

// precomputed glitch tables
// (repeatable)
let chaosTable = [];
let detuneTable = [];
let panTable = [];
let hatRateTable = [];
let octaveTable = [];

function preload() {

  kick = loadSound("kick.wav");
  snare = loadSound("snare.wav");
  hat = loadSound("hihat.wav");
}

function setup() {
  createCanvas(400, 200);
  textAlign(CENTER, CENTER);

  // freeze randomness
  randomSeed(42);
  noiseSeed(42);

  // precompute all randomness for all steps in the minute
  let totalSteps = Math.ceil(durationMs / ((60 * 1000) / (bpm * stepsPerBeat)));
  for (let i = 0; i < totalSteps; i++) {
    chaosTable[i] = random(); // 0–1 glitch factor
    detuneTable[i] = random(0.98, 1.02); // pitch variance
    panTable[i] = random(-0.6, 0.6); // stereo placement
    hatRateTable[i] = random(1.0, 1.4); // hat rate
    octaveTable[i] = random(); // decide octave shift
  }

  // synth
  osc = new p5.Oscillator("triangle");
  osc.start();
  osc.amp(0);

  env = new p5.Envelope();
  env.setRange(0.9, 0);

  // fx
  reverb = new p5.Reverb();
  reverb.process(osc, 6, 5);

  stepInterval = (60 * 1000) / (bpm * stepsPerBeat);
}

function draw() {
  background(isPlaying ? 15 : 60);
  fill(255, 209, 230);
  if (!isPlaying) {
    text("CLICK to start 1-minute piece", width / 2, height / 2);
    return;
  }

  let elapsed = millis() - startTime;
  let remain = max(0, durationMs - elapsed);
  text("playing… " + nf(remain / 1000, 2, 1) + "s left", width / 2, height / 2);

  if (elapsed >= durationMs) {
    isPlaying = false;
    return;
  }

  tick();
}

function mousePressed() {
  userStartAudio();
  isPlaying = true;
  startTime = millis();
  lastStep = millis();
  stepIndex = 0;
}

// main sequencer

function tick() {
  let now = millis();
  if (now - lastStep >= stepInterval) {
    playStep(stepIndex);
    stepIndex++;
    lastStep = now;
  }
}

function playStep(i) {
  let chaos = chaosTable[i];
  let detune = detuneTable[i];
  let pan = panTable[i];
  let hatRate = hatRateTable[i];
  let octRand = octaveTable[i];

  // drums
  if (kickPattern[i % patternLength] && chaos > 0.08) kick.play();
  if (snarePattern[i % patternLength] && chaos > 0.15) snare.play();

  if (hatPattern[i % patternLength]) {
    hat.rate(hatRate);
    hat.pan(pan);
    hat.play();
    if (chaos > 0.85) setTimeout(() => hat.play(), stepInterval * 0.25);
  }

  // melody
  let m = melodyPattern[i % patternLength];
  if (m !== null) playMelody(m, detune, pan, octRand);
}

function playMelody(scaleIndex, detune, pan, octRand) {
  let step = phryDom[scaleIndex];
  let midi = baseMidi + step;

  if (octRand < 0.2) midi -= 12;
  if (octRand > 0.8) midi += 12;

  let freq = midiToFreq(midi);

  osc.freq(freq * detune);
  osc.pan(pan);

  env.setADSR(0.01, 0.3, 0.5, 1.0);
  env.play(osc);
}
