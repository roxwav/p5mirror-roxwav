let x 
let y
function setup() {
  createCanvas(800, 400);
  x = width/2
  y = height/2
}

function draw() {
  background(220);
  line (x/2, y/2, x/2, y+y/2)
  line (x/2, y/2, x+x/2, y/2)
  line (x/2, y+y/2, x+x/2, y+y/2)
  line (x+x/2, y+y/2, x+x/2, y/2)
}
