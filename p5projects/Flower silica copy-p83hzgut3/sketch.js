let img;
let umg;
let amg;
let omg;
let icon1;
let icon2;
let icon3;
let icon4;

function preload() {
  img = loadImage("catmeme1cropped.jpg");
  umg = loadImage("catmeme2cropped.jpg");
  amg = loadImage("catmeme3cropped.jpg");
  omg = loadImage("catmemeweirdcropped.jpg");
  icon1 = loadImage("icon1.png");
  icon2 = loadImage("icon2.png");
  icon3 = loadImage("icon3.png");
  icon4 = loadImage("icon4.png");
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255,209,220);
  image(icon1, 0,0)
  image(icon2, 200, 0)
  image(icon3, 0, 200)
  image(icon4, 200, 200)
  if (mouseX < 200 && mouseX > 1 && mouseY < 200 && mouseY > 1)
    image(img, 0, 0);
  
  else if (mouseX > 200 && mouseX > 1 && mouseY < 200 && mouseY > 1)
    image(umg, 200, 0);
  else if (mouseX > 200 && mouseX > 1 && mouseY > 200 && mouseY > 1)
    image(amg, 0, 200);
  else if (mouseX < 200 && mouseX > 1 && mouseY > 200 && mouseY > 1)
    image(omg, 200, 200);
}
