// --- your original vars (unchanged) ---
let x1=20,  y1=20,   xspeed1=2;
let x2=40,  y2=40,   xspeed2=-2;
let x3=60,  y3=60,   xspeed3=2;
let x4=80,  y4=80,   xspeed4=-2;
let x5=100, y5=100,  xspeed5=2;
let x6=120, y6=120,  xspeed6=-2;
let x7=140, y7=140,  xspeed7=2;
let x8=160, y8=160,  xspeed8=-2;
let x9=180, y9=180,  xspeed9=2;
let x10=200,y10=200, xspeed10=-2;

let x11=220, y11=220, xspeed11=2;
let x12=240, y12=240, xspeed12=-2;
let x13=260, y13=260, xspeed13=2;
let x14=280, y14=280, xspeed14=-2;
let x15=300, y15=300, xspeed15=2;
let x16=320, y16=320, xspeed16=-2;
let x17=340, y17=340, xspeed17=2;
let x18=360, y18=360, xspeed18=-2;
let x19=380, y19=120, xspeed19=2;
let x20=200, y20=80,  xspeed20=-2;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  // R = 20 (half of 40). Hover test uses distance < 20
  // For each ball: move -> bounce -> ZAP if hovered -> draw (if not zapped)

  // 1
  x1 = x1 + xspeed1;
  if (x1 > width - 20 || x1 < 20) xspeed1 = -xspeed1;
  if (dist(mouseX, mouseY, x1, y1) < 20) { xspeed1 = 0; x1 = -1000; } // zap
  if (x1 > -500) ellipse(x1, y1, 40, 40);

  // 2
  x2 = x2 + xspeed2;
  if (x2 > width - 20 || x2 < 20) xspeed2 = -xspeed2;
  if (dist(mouseX, mouseY, x2, y2) < 20) { xspeed2 = 0; x2 = -1000; }
  if (x2 > -500) ellipse(x2, y2, 40, 40);

  // 3
  x3 = x3 + xspeed3;
  if (x3 > width - 20 || x3 < 20) xspeed3 = -xspeed3;
  if (dist(mouseX, mouseY, x3, y3) < 20) { xspeed3 = 0; x3 = -1000; }
  if (x3 > -500) ellipse(x3, y3, 40, 40);

  // 4
  x4 = x4 + xspeed4;
  if (x4 > width - 20 || x4 < 20) xspeed4 = -xspeed4;
  if (dist(mouseX, mouseY, x4, y4) < 20) { xspeed4 = 0; x4 = -1000; }
  if (x4 > -500) ellipse(x4, y4, 40, 40);

  // 5
  x5 = x5 + xspeed5;
  if (x5 > width - 20 || x5 < 20) xspeed5 = -xspeed5;
  if (dist(mouseX, mouseY, x5, y5) < 20) { xspeed5 = 0; x5 = -1000; }
  if (x5 > -500) ellipse(x5, y5, 40, 40);

  // 6
  x6 = x6 + xspeed6;
  if (x6 > width - 20 || x6 < 20) xspeed6 = -xspeed6;
  if (dist(mouseX, mouseY, x6, y6) < 20) { xspeed6 = 0; x6 = -1000; }
  if (x6 > -500) ellipse(x6, y6, 40, 40);

  // 7
  x7 = x7 + xspeed7;
  if (x7 > width - 20 || x7 < 20) xspeed7 = -xspeed7;
  if (dist(mouseX, mouseY, x7, y7) < 20) { xspeed7 = 0; x7 = -1000; }
  if (x7 > -500) ellipse(x7, y7, 40, 40);

  // 8
  x8 = x8 + xspeed8;
  if (x8 > width - 20 || x8 < 20) xspeed8 = -xspeed8;
  if (dist(mouseX, mouseY, x8, y8) < 20) { xspeed8 = 0; x8 = -1000; }
  if (x8 > -500) ellipse(x8, y8, 40, 40);

  // 9
  x9 = x9 + xspeed9;
  if (x9 > width - 20 || x9 < 20) xspeed9 = -xspeed9;
  if (dist(mouseX, mouseY, x9, y9) < 20) { xspeed9 = 0; x9 = -1000; }
  if (x9 > -500) ellipse(x9, y9, 40, 40);

  // 10
  x10 = x10 + xspeed10;
  if (x10 > width - 20 || x10 < 20) xspeed10 = -xspeed10;
  if (dist(mouseX, mouseY, x10, y10) < 20) { xspeed10 = 0; x10 = -1000; }
  if (x10 > -500) ellipse(x10, y10, 40, 40);

  // 11
  x11 = x11 + xspeed11;
  if (x11 > width - 20 || x11 < 20) xspeed11 = -xspeed11;
  if (dist(mouseX, mouseY, x11, y11) < 20) { xspeed11 = 0; x11 = -1000; }
  if (x11 > -500) ellipse(x11, y11, 40, 40);

  // 12
  x12 = x12 + xspeed12;
  if (x12 > width - 20 || x12 < 20) xspeed12 = -xspeed12;
  if (dist(mouseX, mouseY, x12, y12) < 20) { xspeed12 = 0; x12 = -1000; }
  if (x12 > -500) ellipse(x12, y12, 40, 40);

  // 13
  x13 = x13 + xspeed13;
  if (x13 > width - 20 || x13 < 20) xspeed13 = -xspeed13;
  if (dist(mouseX, mouseY, x13, y13) < 20) { xspeed13 = 0; x13 = -1000; }
  if (x13 > -500) ellipse(x13, y13, 40, 40);

  // 14
  x14 = x14 + xspeed14;
  if (x14 > width - 20 || x14 < 20) xspeed14 = -xspeed14;
  if (dist(mouseX, mouseY, x14, y14) < 20) { xspeed14 = 0; x14 = -1000; }
  if (x14 > -500) ellipse(x14, y14, 40, 40);

  // 15
  x15 = x15 + xspeed15;
  if (x15 > width - 20 || x15 < 20) xspeed15 = -xspeed15;
  if (dist(mouseX, mouseY, x15, y15) < 20) { xspeed15 = 0; x15 = -1000; }
  if (x15 > -500) ellipse(x15, y15, 40, 40);

  // 16
  x16 = x16 + xspeed16;
  if (x16 > width - 20 || x16 < 20) xspeed16 = -xspeed16;
  if (dist(mouseX, mouseY, x16, y16) < 20) { xspeed16 = 0; x16 = -1000; }
  if (x16 > -500) ellipse(x16, y16, 40, 40);

  // 17
  x17 = x17 + xspeed17;
  if (x17 > width - 20 || x17 < 20) xspeed17 = -xspeed17;
  if (dist(mouseX, mouseY, x17, y17) < 20) { xspeed17 = 0; x17 = -1000; }
  if (x17 > -500) ellipse(x17, y17, 40, 40);

  // 18
  x18 = x18 + xspeed18;
  if (x18 > width - 20 || x18 < 20) xspeed18 = -xspeed18;
  if (dist(mouseX, mouseY, x18, y18) < 20) { xspeed18 = 0; x18 = -1000; }
  if (x18 > -500) ellipse(x18, y18, 40, 40);

  // 19
  x19 = x19 + xspeed19;
  if (x19 > width - 20 || x19 < 20) xspeed19 = -xspeed19;
  if (dist(mouseX, mouseY, x19, y19) < 20) { xspeed19 = 0; x19 = -1000; }
  if (x19 > -500) ellipse(x19, y19, 40, 40);

  // 20
  x20 = x20 + xspeed20;
  if (x20 > width - 20 || x20 < 20) xspeed20 = -xspeed20;
  if (dist(mouseX, mouseY, x20, y20) < 20) { xspeed20 = 0; x20 = -1000; }
  if (x20 > -500) ellipse(x20, y20, 40, 40);
}
