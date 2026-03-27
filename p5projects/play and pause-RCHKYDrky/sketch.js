let songs = [];
let index = 0;
let total = 10;

function preload() {
  for (let s = 0; s < 10; s++) {
    songs[s] = new p5.SoundFile(s + ".mp3");
  }
}

function setup() {
  createCanvas(400, 400);
  background (255, 219, 230)
  textAlign(CENTER, CENTER);
  fill(0, 0, 0);
  text('click', width/2, height/2);
}

function mousePressed() {
  let i = songs[index];
  if (!i) return;
  if (i.isPlaying()) {
    i.pause();
    index = (index + 1) % total;
  } else {
    i.play();
  }
}
