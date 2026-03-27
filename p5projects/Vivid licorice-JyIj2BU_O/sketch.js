let on = false; // column starts off

function setup() {
  createCanvas(600, 400);
}

function draw() {
  background(220);

  // only draw the column if "on" is true
  if (on) {
    fill(255, 200, 200); 
    noStroke();
    rect(200, 0, 200, 400); // rectangle in the middle
  }
}

function mousePressed() {
  // check if mouse is inside the column
  if (mouseX > 200 && mouseX < 400) {
    on=!on
  }
}

