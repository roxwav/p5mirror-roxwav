let doubleSixAgain;

let vox;
let drum;
let inst;

let audioStarted = false;

let reverb;
let reverbSlider;

let panSlider;

let capture;
let snaps = [];

function preload() {
  doubleSixAgain = loadImage("double six again.jpg");

  drum = loadSound("double six stems drums.mp3");
  vox = loadSound("double six stems vocals.mp3");
  inst = loadSound("double six stems instruments.mp3");
}

function keyPressed() {
  if (key === " ") {
    let shot = capture.get(); // grab the current video frame
    snaps.push(shot);
    if (snaps.length > 4) {
      snaps.shift(); // keep only the last 4 photos
    }
  }
} 

function setup() {
  createCanvas(400, 400);

  capture = createCapture(VIDEO);
  capture.size(400, 400);
  capture.hide();

  reverb = new p5.Reverb();
  vox.disconnect();
  reverb.process(vox, 8, 2);
  reverb.amp(1.5);

  // centered sliders at middle
  reverbSlider = createSlider(0, 100, 30);
  reverbSlider.position(130, 220);
  reverbSlider.style("accent-color", "#f7bcd6");

  panSlider = createSlider(-100, 100, 0);
  panSlider.position(130, 250);
  panSlider.style("accent-color", "#f7bcd6");
}

function draw() {
  background(255, 245, 255);
  image(doubleSixAgain, 0, 0, width, height);

  let wet = reverbSlider.value() / 100;
  wet = wet * 0.6; // limits the reverb to 60 percent maximum
  reverb.drywet(wet);

  let panAmount = panSlider.value() / 100; // -1 to 1
  inst.pan(panAmount);

  tint(255, 50);
  image(capture, 0, 0, 400, 400);
  noTint();

  // draw photobooth strip at the bottom
  let thumbW = 80;
  let thumbH = 60;
  // i is loop index
  for (let i = 0; i < snaps.length; i++) {
    let x = 10 + i * (thumbW + 10);
    let y = height - thumbH - 10;
    image(snaps[i], x, y, thumbW, thumbH);
  }
}
function mousePressed() {
  if (!audioStarted) {
    userStartAudio();
    drum.loop();
    vox.loop();
    inst.loop();

    drum.setVolume(0.8); // quieter
    vox.setVolume(1.0);
    inst.setVolume(1.0);

    audioStarted = true;
  }
}
