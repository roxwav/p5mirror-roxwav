let x = 200,
  y = 200; // moves right (10x speed)
let xL = 200,
  yL = 200; // moves left
let xU = 200,
  yU = 200; // moves up
let xD = 200,
  yD = 200; // moves down
let xTL = 200,
  yTL = 200; // moves toward top-left corner
let xTR = 200,
  yTR = 200; // moves toward top-right corner
let xBL = 200,
  yBL = 200; // moves toward bottom-left corner
let xBR = 200,
  yBR = 200; // moves toward bottom-right corner

function setup() {
  createCanvas(400, 400);
  drawPortrait();
}

function draw() {
   // Circle moving to the right (10x faster than others)
   
  fill(255, 100, 100);
  x = x + 10;
  ellipse(x, y, 40, 40);

  // Circle moving left
  fill(100, 200, 255);
  xL = xL - 1;
  ellipse(xL, yL, 30, 30);

  // Circle moving up
  fill(120, 255, 120);
  yU = yU - 1;
  ellipse(xU, yU, 30, 30);

  // Circle moving down
  fill(255, 200, 120);
  yD = yD + 1;
  ellipse(xD, yD, 30, 30);

  // Circle moving toward the top-left corner
  fill(255, 150, 255);
  xTL = xTL - 1;
  yTL = yTL - 1;
  ellipse(xTL, yTL, 25, 25);

  // Circle moving toward the top-right corner
  fill(255, 255, 150);
  xTR = xTR + 1;
  yTR = yTR - 1;
  ellipse(xTR, yTR, 25, 25);

  // Circle moving toward the bottom-left corner
  fill(150, 255, 255);
  xBL = xBL - 1;
  yBL = yBL + 1;
  ellipse(xBL, yBL, 25, 25);

  // Circle moving toward the bottom-right corner
  fill(200, 150, 255);
  xBR = xBR + 1;
  yBR = yBR + 1;
  ellipse(xBR, yBR, 25, 25);
}


function drawPortrait() {
  drawBg();
  drawHairLeft();
  drawHairRight();
  drawEarLeft();
  drawEarRight();
  drawFace();
  drawMouthOuter();
  drawMouthInner();
drawEye(150, 150, 60, 30, 30, 10); // left eye
  drawEye(250, 150, 60, 30, 30, 10); // right eye
  drawNoseArc();  
  drawBangs();
  drawNeck();
  drawShoulders();
}


function drawBg() {
  background(255, 209, 220);
}

function drawHairLeft() {
  fill(101, 67, 33);
  triangle(100, 60, 50, 400, 350, 400);
}

function drawHairRight() {
  fill(101, 67, 33);
  triangle(300, 60, 50, 400, 350, 400);
}

function drawEarLeft() {
  fill(255, 229, 180);
  ellipse(100, 190, 30, 60);
}

function drawEarRight() {
  fill(255, 229, 180);
  ellipse(300, 190, 30, 60);
}

function drawFace() {
  noStroke();
  fill(255, 229, 180);
  ellipse(200, 200, 200, 260);
}

function drawMouthOuter() {
  noStroke();
  fill(255, 200, 200);
  ellipse(200, 270, 60, 30);
}

function drawMouthInner() {
  noStroke();
  fill(255, 150, 150);
  ellipse(200, 270, 50, 20);
}

function drawEye(x, y, whiteW, whiteH, irisD, pupilD) {
  noStroke();
  fill(255);
  ellipse(x, y, whiteW, whiteH);   // white
  fill(148, 115, 82);
  ellipse(x, y, irisD, irisD);     // iris
  fill(0);
  ellipse(x, y, pupilD, pupilD);   // pupil
}
function drawNoseArc() {
  fill(255, 229, 180);
  stroke(0);
  strokeWeight(1);
  arc(200, 200, 40, 60, 0, PI, OPEN);
}

function drawBangs() {
  fill(101, 67, 33);
  rect(95, 60, 205, 60);
}

function drawNeck() {
  fill(255, 229, 180);
  rect(175, 328, 50, 100);
}

function drawShoulders() {
  fill(255, 229, 180);
  rect(100, 350, 200, 50);
}
