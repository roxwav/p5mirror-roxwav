function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
let x = 0;
while (x < width) {
  if (mouseX > x && mouseX < x + 20) {
    fill(255, 0, 0);
  } else fill(255);
  rect(x, 0, 20, 400);
  x = x + 20;
}
  //  fill(255, 0, 0);
  //  if (mouseX <= 20)
  //rect(0, 0, 20, 400);
  //  if (mouseX <= 40 && mouseX >= 20)
  //rect(20, 0, 20, 400);
  //  if (mouseX <= 60 && mouseX >= 40)
  //rect(40, 0, 20, 400);
  //  if (mouseX <= 80 && mouseX >= 60)
  //rect(60, 0, 20, 400);
  //  if (mouseX <= 100 && mouseX >= 80)
  //rect(80, 0, 20, 400);
  //  if (mouseX <= 120 && mouseX >= 100)
  //rect(100, 0, 20, 400);
  //  if (mouseX <= 140 && mouseX >= 120)
  //rect(120, 0, 20, 400);
  //  if (mouseX <= 160 && mouseX >= 140)
  //rect(140, 0, 20, 400);
  //  if (mouseX <= 180 && mouseX >= 160)
 // rect(160, 0, 20, 400);
  //  if (mouseX <= 200 && mouseX >= 180)
 // rect(180, 0, 20, 400);
  //  if (mouseX <= 220 && mouseX >= 200)
 // rect(200, 0, 20, 400);
  //  if (mouseX <= 240 && mouseX >= 220)
  //rect(220, 0, 20, 400);
  //  if (mouseX <= 260 && mouseX >= 240)
  //rect(240, 0, 20, 400);
  //  if (mouseX <= 280 && mouseX >= 260)
  //rect(260, 0, 20, 400);
  //  if (mouseX <= 300 && mouseX >= 280)
  //rect(280, 0, 20, 400);
  //  if (mouseX <= 320 && mouseX >= 300)
  //rect(300, 0, 20, 400);
  //    if (mouseX <= 340 && mouseX >= 320)
 // rect(320, 0, 20, 400);
  //    if (mouseX <= 360 && mouseX >= 340)
  //rect(340, 0, 20, 400);
  //    if (mouseX <= 380 && mouseX >= 360)
  //rect(360, 0, 20, 400);
  //    if (mouseX <= 400 && mouseX >= 380)
  //rect(380, 0, 20, 400);

  // for (let i = 0; i < 400; i += 20) {
  //  if (mouseX > i && mouseX <= i + 20) fill(255, 0, 0);
  //  else fill(255);
  //  rect(i, 0, 20, 400);
  // }
}

