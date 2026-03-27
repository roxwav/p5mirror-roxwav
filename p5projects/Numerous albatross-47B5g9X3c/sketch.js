function setup() { 
  createCanvas(400, 400);
} 
function draw() { 
  background(120); 
  face(); 
  eye(150, 150, 70, 40, 5); // big, wide eye 
  eye(250, 150, 40, 60, 10); // smaller, taller eye 
  eyebrow(130, 110, 170, 120); 
  eyebrow(230, 105, 270, 100); 
  antenna(); 
  mouth(); 
  arms(); 
  body(); 
  function face() { 
    fill(127, 0, 127); 
    ellipse(200, 200, 150, 200); 
  } 
  function eye(x, y, w, h, pupilSize) {
    fill(0, 200, 127); 
    ellipse(x, y, w, h); // eye white
    fill(0); 
    ellipse(x + 20, y, pupilSize, pupilSize); // pupil 
  } 
  function eyebrow(x1, y1, x2, y2) { 
    stroke(255, 100, 100);
    strokeWeight(15); 
    line(x1, y1, x2, y2); 
  } 
  function antenna(){ 
    stroke(255); 
    strokeWeight(5); 
    line(200, 125, 200, 50);
    noFill(); 
    ellipse(200, 40, 20, 20); 
    noStroke(); 
  } 
  function mouth(){ 
    fill(255, 0, 127); 
    ellipse(200, 250, 50, 20); 
  } 
  function arms(){ 
    stroke(0); 
    strokeWeight(30); 
    line(150, 350, 300, 300); 
    noStroke(); 
  } 
  function body(){ 
    fill(255, 255, 0); 
    rect(150, 275, 100, 200); 
  } 
}