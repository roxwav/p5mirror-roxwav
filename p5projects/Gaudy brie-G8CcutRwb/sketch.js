let drum;
let vox;
let inst;

let audioStarted = false;

let delay;
let delaySlider;

let reverb;
let reverbSlider;

let panPhase = 0;
let panSpeed = 0.06;
let panSlider;

function preload() {
  drum = loadSound("double six stems drums.mp3");
  vox = loadSound("double six stems vocals.mp3");
  inst = loadSound("double six stems instruments.mp3");
}

function setup() {
  createCanvas(550, 400);

  delay = new p5.Delay();
  vox.disconnect();
  delay.process(vox, 0.7, 0.7); // longer delay, noticeable feedback
  delay.amp(2.0); // louder delay

  reverb = new p5.Reverb();
  vox.disconnect();
  reverb.process(vox, 5, 2);
  reverb.amp(1.7);

  delaySlider = createSlider(0, 100, 30);
  delaySlider.position(100, 200);

  reverbSlider = createSlider(0, 100, 30);
  reverbSlider.position(100, 240);

  panSlider = createSlider(0, 100, 80);
  panSlider.position(100, 280);
}

function draw() {
  background(255, 245, 255);

  // pastel rectangles
  fill(210, 240, 255);
  rect(100, 100, 100, 60);
  fill(50);
  textSize(14);
  textAlign(CENTER, CENTER);
  text("drums", 150, 130);

  fill(230, 250, 220);
  rect(220, 100, 100, 60);
  fill(50);
  text("vocals", 270, 130);

  fill(255, 245, 215);
  rect(340, 100, 100, 60);
  fill(50);
  text("instruments", 390, 130);

  // slider labels
  textAlign(LEFT, CENTER);
  textSize(12);
  fill(50);
  text("vox delay", 100, 195);
  text("vox reverb", 100, 235);
  text("instrument pan openness", 100, 275);
  // vox delay mix
  let delayMix = delaySlider.value() / 100; // 0–1
  delay.drywet(delayMix);

  // vox reverb mix
  let wet = reverbSlider.value() / 100;
  wet = wet * 0.6;
  reverb.drywet(wet);
  // instrument auto-pan
  if (audioStarted) {
    let openness = panSlider.value() / 100;
    let panValue = sin(panPhase) * openness;
    inst.pan(panValue);
    panPhase += panSpeed;
  }
}

function mousePressed() {
  if (!audioStarted) {
    userStartAudio();
    drum.loop();
    vox.loop();
    inst.loop();
    audioStarted = true;
  }
}
