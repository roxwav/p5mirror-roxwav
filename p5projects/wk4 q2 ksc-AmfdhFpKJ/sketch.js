function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  let x = 0;
while (x < width) {
  if (mouseX > x && mouseX < x + 20) {
    fill(255, 0, 0);
    if (mouseX >= 140 && mouseX <= 160) {
      fill(255, 255, 255)
      rect (140, 0, 20, 400)
    }
  } else fill(255);
  rect(x, 0, 20, 400);
  x = x + 20;
}
}