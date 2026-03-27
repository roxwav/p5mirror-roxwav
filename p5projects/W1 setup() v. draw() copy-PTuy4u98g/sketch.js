
function setup() {
  createCanvas(400, 300); 
}

function draw() {
  background(0, 250, 255); 

  // red diagonal line
  stroke(255, 0, 0);
  strokeWeight(30);
  line(0, 0, width, height);

  // green ellipse
  noStroke();
  fill(0, 190, 0);
  ellipse(200, 150, 210, 150);

  //blue square
  fill(0, 0, 180);
  rect(277, 125, 28, 28);
}