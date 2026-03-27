let x = 20;
let speed = 4;
function setup() {
  createCanvas(500, 400);
}

function draw() {
  background(220, 209, 220);
  //move ball
  x = x + speed;
  //bounce off walls
  if (x > 480) {
    x = 480;
    speed = -speed;
  }
  if (x < 20){
    x = 20
    speed = -speed;
  }
  let shade = map(x, 20, 480, 255, 0)
  //map turns x into a greyscale value, so when x = 20 return 255, and when x = 480 return 0
  
  fill(shade);
  noStroke();
  ellipse(x, 100, 40, 40)
}
