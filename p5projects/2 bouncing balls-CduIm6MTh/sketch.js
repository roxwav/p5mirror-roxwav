let x1 = 50;
let xspeed1 = 3;
let y1 = 150;

let x2 = 350;
let xspeed2 = -2;
let y2 = 250;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  // ball 1
  x1 = x1 + xspeed1;
  if (x1 > width - 20 || x1 < 20) {
    xspeed1 = -xspeed1; // bounce
  }
  ellipse(x1, y1, 40, 40);

  // ball 2
  x2 = x2 + xspeed2;
  if (x2 > width - 20 || x2 < 20) {
    xspeed2 = -xspeed2; // bounce
  }
  ellipse(x2, y2, 40, 40);
}
