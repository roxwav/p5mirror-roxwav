let vocals;
let instrumental;

let vocalsFFT;
let instFFT;
let vocalsAmp;
let instAmp;

let vocalsSlider;
let instSlider;
let crossSlider;

let playButton;

let isPlaying = false;

let waveformVocals = [];
let waveformInst = [];

let pastelPink;
let deepPink;
let softWhite;
let plumText;
let blush;

function preload() {
  soundFormats("mp3");
  instrumental = loadSound("Bassvictim - I Like It_no_vocals_split_by_lalalai.mp3");
  vocals = loadSound("Bassvictim - I Like It_vocals_split_by_lalalai.mp3");
}

function setup() {
  createCanvas(min(windowWidth, 1200), min(windowHeight, 820));

  pastelPink = color(248, 220, 231);
  deepPink = color(231, 126, 168);
  softWhite = color(255, 248, 252);
  plumText = color(123, 73, 96);
  blush = color(244, 183, 209);

  vocalsFFT = new p5.FFT(0.85, 1024);
  instFFT = new p5.FFT(0.85, 1024);
  vocalsAmp = new p5.Amplitude();
  instAmp = new p5.Amplitude();

  vocalsFFT.setInput(vocals);
  instFFT.setInput(instrumental);
  vocalsAmp.setInput(vocals);
  instAmp.setInput(instrumental);

  createUI();
  layoutUI();
  syncStemSettings();
}

function createUI() {
  playButton = createButton("play / pause");
  styleButton(playButton);
  playButton.mousePressed(togglePlayback);

  vocalsSlider = createSlider(0, 1, 0.9, 0.01);
  vocalsSlider.size(180);

  instSlider = createSlider(0, 1, 0.9, 0.01);
  instSlider.size(180);

  crossSlider = createSlider(0, 1, 0.5, 0.01);
  crossSlider.size(180);
}

function layoutUI() {
  if (playButton) {
    playButton.position(24, height - 150);
    playButton.size(120, 36);
  }

  if (vocalsSlider) vocalsSlider.position(24, height - 96);
  if (instSlider) instSlider.position(24, height - 56);
  if (crossSlider) crossSlider.position(250, height - 96);
}

function styleButton(btn) {
  btn.style("background", "#fff4f9");
  btn.style("border", "none");
  btn.style("border-radius", "16px");
  btn.style("padding", "8px 12px");
  btn.style("color", "#8c5670");
  btn.style("font-size", "13px");
}

function togglePlayback() {
  userStartAudio();

  if (!isPlaying) {
    playSynced();
  } else {
    pauseSynced();
  }
}

function playSynced() {
  if (!instrumental.isPlaying()) {
    instrumental.play();
  }

  if (!vocals.isPlaying()) {
    vocals.play();
  }

  if (abs(instrumental.currentTime() - vocals.currentTime()) > 0.03) {
    vocals.jump(instrumental.currentTime());
  }

  isPlaying = true;
}

function pauseSynced() {
  instrumental.pause();
  vocals.pause();
  isPlaying = false;
}

function syncStemSettings() {
  if (!vocalsSlider || !instSlider || !crossSlider) return;

  let vocalVol = vocalsSlider.value();
  let instVol = instSlider.value();
  let cross = crossSlider.value();

  let vocalMix = vocalVol * cross;
  let instMix = instVol * (1 - cross);

  vocals.setVolume(vocalMix, 0.03);
  instrumental.setVolume(instMix, 0.03);
}

function draw() {
  drawBackground();
  syncStemSettings();

  waveformVocals = vocalsFFT.waveform();
  waveformInst = instFFT.waveform();

  drawHeader();
  drawMixerPanel();
  drawWaveformPanel();
  drawPlayhead();
  drawFooterText();
}

function drawBackground() {
  let c1 = color(253, 233, 242);
  let c2 = color(242, 208, 225);

  for (let y = 0; y < height; y++) {
    let amt = map(y, 0, height, 0, 1);
    stroke(lerpColor(c1, c2, amt));
    line(0, y, width, y);
  }

  noStroke();
  for (let i = 0; i < 18; i++) {
    let x = (frameCount * 0.15 + i * 90) % (width + 100) - 50;
    let y = 80 + sin(frameCount * 0.01 + i) * 28 + i * 24;
    fill(255, 255, 255, 24);
    ellipse(x, y, 90, 36);
  }
}

function drawHeader() {
  noStroke();
  fill(plumText);
  textAlign(LEFT, TOP);
  textSize(26);
  textStyle(BOLD);
  text("bassvictim - i like it stem mixer", 24, 22);

  fill(157, 102, 127);
  textSize(13);
  textStyle(NORMAL);
  text("vocals + instrumental manipulation with waveform analysis", 24, 58);
}

function drawMixerPanel() {
  let x = 18;
  let y = height - 180;
  let w = 440;
  let h = 148;

  noStroke();
  fill(255, 255, 255, 115);
  rect(x, y, w, h, 24);

  fill(plumText);
  textSize(15);
  textStyle(BOLD);
  text("mixer", x + 16, y + 14);

  fill(150, 96, 120);
  textSize(12);
  textStyle(NORMAL);
  text("vocals", 24, height - 116);
  text("instrumental", 24, height - 76);
  text("crossfade", 250, height - 116);

  let vocalMeter = vocalsAmp.getLevel();
  let instMeter = instAmp.getLevel();

  drawMeter(380, height - 119, 56, 12, vocalMeter, color(255, 145, 185));
  drawMeter(380, height - 79, 56, 12, instMeter, color(227, 131, 178));
}

function drawMeter(x, y, w, h, level, c) {
  noStroke();
  fill(255, 240, 246);
  rect(x, y, w, h, 8);
  fill(c);
  rect(x, y, w * constrain(level * 5.2, 0, 1), h, 8);
}

function drawWaveformPanel() {
  let x = 18;
  let y = 92;
  let w = width - 36;
  let h = 430;

  noStroke();
  fill(255, 255, 255, 100);
  rect(x, y, w, h, 28);

  fill(plumText);
  textSize(15);
  textStyle(BOLD);
  text("waveform analysis", x + 16, y + 14);

  fill(160, 102, 128);
  textSize(12);
  textStyle(NORMAL);
  text("vocals", x + 16, y + 42);
  text("instrumental", x + 16, y + 248);

  drawWaveform(waveformVocals, x + 16, y + 56, w - 32, 150, color(255, 143, 184));
  drawWaveform(waveformInst, x + 16, y + 262, w - 32, 150, color(222, 130, 173));
}

function drawWaveform(data, x, y, w, h, c) {
  noFill();
  stroke(c);
  strokeWeight(2);

  beginShape();
  for (let i = 0; i < data.length; i++) {
    let xx = map(i, 0, data.length - 1, x, x + w);
    let yy = y + h / 2 + data[i] * (h * 0.42);
    vertex(xx, yy);
  }
  endShape();

  stroke(255, 255, 255, 90);
  strokeWeight(1);
  line(x, y + h / 2, x + w, y + h / 2);
}

function getNormalizedPlayback() {
  let dur = instrumental.duration();
  if (!isPlaying || dur === 0) return -10;
  return (instrumental.currentTime() % dur) / dur;
}

function drawPlayhead() {
  if (!instrumental || instrumental.duration() === 0) return;

  let currentNorm = getNormalizedPlayback();

  let panelX = 18;
  let panelW = width - 36;
  let playX = map(currentNorm, 0, 1, panelX + 16, panelX + panelW - 16);

  stroke(255, 255, 255, 180);
  strokeWeight(2);
  line(playX, 148, playX, 298);
  line(playX, 354, playX, 504);
}

function drawFooterText() {
  fill(148, 95, 119);
  noStroke();
  textAlign(RIGHT, BOTTOM);
  textSize(12);

  let stateText = isPlaying ? "playing" : "paused";
  text(stateText, width - 24, height - 18);
}

function keyPressed() {
  if (key === " ") {
    togglePlayback();
    return false;
  }
}

function windowResized() {
  resizeCanvas(min(windowWidth, 1200), min(windowHeight, 820));
  layoutUI();
}