let mic, fft, bg;

function setup() {
  createCanvas(400, 400);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  bg = 220;
}

function draw() {
  let v = mic.getLevel();
  if (v > 0.05) bg = random(150, 230);
  background(bg);

  fill(50);
  noStroke();
  let d = 50 + v * 600;
  ellipse(width/2, height/2, d, d);

  let wave = fft.waveform();
  stroke(0);
  noFill();
  beginShape();
  for (let i = 0; i < wave.length; i += 5) {
    let x = map(i, 0, wave.length, 0, width);
    let y = map(wave[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();
}
