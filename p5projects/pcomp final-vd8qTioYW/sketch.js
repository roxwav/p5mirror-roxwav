let cnv;

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

// serial stuff
let serial;
let portButton;
let fsr1 = 0; // drum
let fsr2 = 0; // vox
let fsr3 = 0; // inst
let buttonState = 0;
let lastButtonState = 0;

function preload() {
  doubleSixAgain = loadImage("double six again.jpg");

  drum = loadSound("double six stems drums.mp3");
  vox = loadSound("double six stems vocals.mp3");
  inst = loadSound("double six stems instruments.mp3");
}

function setup() {
  cnv = createCanvas(400, 400);
  cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  capture = createCapture(VIDEO);
  capture.size(400, 400);
  capture.hide();

  setupSerial();
}

function draw() {
  background(255, 245, 255);
  image(doubleSixAgain, 0, 0, width, height);

  if (audioStarted) {
    let drumVol = map(fsr1, 0, 1023, 0, 1);
    let voxVol = map(fsr2, 0, 1023, 0, 1);
    let instVol = map(fsr3, 0, 1023, 0, 1);

    drum.setVolume(drumVol);
    vox.setVolume(voxVol);
    inst.setVolume(instVol);
  }

  tint(255, 50);
  image(capture, 0, 0, 400, 400);
  noTint();

  let thumbW = 80;
  let thumbH = 60;

  for (let i = 0; i < snaps.length; i++) {
    let x = 10 + i * (thumbW + 10);
    let y = height - thumbH - 10;
    image(snaps[i], x, y, thumbW, thumbH);
  }

  if (buttonState === 1 && lastButtonState === 0) {
    takeSnapshot();
  }
  lastButtonState = buttonState;
}

function mousePressed() {
  if (!audioStarted) {
    userStartAudio();
    drum.loop();
    vox.loop();
    inst.loop();

    drum.setVolume(0.8);
    vox.setVolume(1.0);
    inst.setVolume(1.0);

    audioStarted = true;
  }
}

function keyPressed() {
  if (key === " ") {
    takeSnapshot();
  }
}

function takeSnapshot() {
  let shot = capture.get();
  snaps.push(shot);
  if (snaps.length > 4) {
    snaps.shift();
  }
}

// serial setup and events

function setupSerial() {
  serial = new p5.WebSerial();

  serial.on("connected", () => {
    console.log("WebSerial connected");
  });

  serial.on("data", serialEvent);
  serial.on("noport", makePortButton);
  serial.on("portavailable", portAvailable);
  serial.on("requesterror", () => {
    console.log("Serial request error");
  });

  serial.getPorts();
}

function makePortButton() {
  portButton = createButton("Connect Arduino");
  portButton.position(10, 10);
  portButton.mousePressed(() => {
    serial.requestPort();
  });
}

function portAvailable() {
  serial.open();
}

function serialEvent() {
  if (!serial) return;

  let line = serial.readLine();
  if (line === null) return;

  line = line.trim();
  if (line.length === 0) return;

  if (!line.startsWith("b,")) return;

  let parts = line.split(",");
  if (parts.length !== 5) return;

  buttonState = int(parts[1]);
  fsr1 = int(parts[2]);
  fsr2 = int(parts[3]);
  fsr3 = int(parts[4]);

  console.log("FSR:", fsr1, fsr2, fsr3);
}
