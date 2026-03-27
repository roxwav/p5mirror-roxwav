let sound;
function preload() {
  sound = loadSound('5sec.mp3');
}

function setup() {
  createCanvas(400, 400);
  background(0);
  fill(255, 200, 200);
}

function mousePressed() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.play();
  }
}
