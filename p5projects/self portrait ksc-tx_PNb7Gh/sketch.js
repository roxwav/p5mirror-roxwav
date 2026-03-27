function setup() {
  createCanvas(400, 400);
  background(255, 209, 220);

  fill(101, 67, 33);
  triangle(100, 60, 50, 400, 350, 400);

  fill(101, 67, 33);
  triangle(300, 60, 50, 400, 350, 400);

  fill(255, 229, 180);
  ellipse(100, 190, 30, 60);

  fill(255, 229, 180);
  ellipse(300, 190, 30, 60);

  noStroke();
  fill(255, 229, 180);
  ellipse(200, 200, 200, 260);

  noStroke();
  fill(255, 200, 200);
  ellipse(200, 270, 60, 30);

  noStroke();
  fill(255, 150, 150);
  ellipse(200, 270, 50, 20);

  noStroke();
  fill(255, 255, 255);
  ellipse(150, 150, 60, 30);

  noStroke();
  fill(148, 115, 82);
  ellipse(150, 150, 30, 30);

  fill(0, 0, 0);
  ellipse(150, 150, 10, 10);

  noStroke();
  fill(255, 255, 255);
  ellipse(250, 150, 60, 30);

  noStroke();
  fill(148, 115, 82);
  ellipse(250, 150, 30, 30);

  fill(0, 0, 0);
  ellipse(250, 150, 10, 10);

  fill(255, 229, 180);
  stroke(0);
  strokeWeight(1);
  arc(200, 200, 40, 60, 0, PI, OPEN);

  fill(101, 67, 33);
  rect(95, 60, 205, 60);

  fill(255, 229, 180);
  rect(175, 328, 50, 100);

  fill(255, 229, 180);
  rect(100, 350, 200, 50);
}
