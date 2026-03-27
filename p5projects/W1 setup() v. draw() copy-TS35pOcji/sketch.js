// Create a canvas that is 400 pixels wide by 400 pixels tall 
let x = 50;

function setup (){
createCanvas(400, 400);
  // Draw a gray background
background(220);
}

function draw() {
  rect(x, 200, 50, 50);
  // Describes mouse interaction
if(mouseX > x && mouseX < x + 50) 
  x = mouseX;
}

// Change the horizontal position of the shape over time
x+=1;
