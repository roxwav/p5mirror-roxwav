let osc;
let base = 440;

let ratios = [
  1,        // 1
  16/15,    // b2
  5/4,      // 3
  4/3,      // 4
  3/2,      // 5
  8/5,      // b6
  16/9,     // b7
  2         // high 1
];

let keys = ['a','s','d','f','g','h','j','k'];

function setup() {
  createCanvas(200, 200);
  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);
}

function keyPressed() {
  let i = keys.indexOf(key.toLowerCase());
  if (i >= 0) {
    osc.freq(base * ratios[i]);
    osc.amp(0.3, 0.05);
  }
}

function keyReleased() {
  osc.amp(0, 0.1);
}
