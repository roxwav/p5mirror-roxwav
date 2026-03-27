let source_img;
let h_speed;
let c;
let new_c;
let h;
let s;
let b;

function preload() {
  source_img = loadImage("brian.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0)
  imageMode(CENTER);
  dst_img = createImage(source_img.width, source_img.height)
  h_speed = 3;
}

function draw() {
  scale(2);
  source_img.loadPixels();
  dst_img.loadPixels();
  
  // for (let x = (source_img.width / 2 ) - 20; x < (source_img.width / 2) + 20; x+=5) {
  //   for (let y = (source_img.height / 2) - 20 ; y < (source_img.height / 2) + 20; y+=5) {
  
    for (let x = 0; x < (source_img.width); x+=4) {
    for (let y = 0; y < (source_img.height); y+=4) {
      c = source_img.get(x, y); // get the color value of every 5 pixels
      
      h = hue(c);
      s = saturation(c);
      b = brightness(c);  
      // console.log(" x: " + x + " y: " + y + " h: " + h + " s: " + s + " b: " + b);
      
      // modify midtones
      if (b > 0 && b < 80) {
        // h = map(mouseX,0,width,360,0);
        h = frameCount * h_speed % 360;
        s = 100;
        // console.log(" x: " + x + " y: " + y + " h: " + h);
      //   if (mouseY > height/2) {s = map(mouseY,height/2,0,100,0)
      // } else {s = map(mouseY,height/2,height,100,0)
      //        }
      //   console.log(" x: " + x + " y: " + y + " h: " + h + " s: " + s + " b: " + b);
      }
      
      colorMode(HSB);

      new_c = color(h,s,b);
      
      dst_img.set(x,y,new_c)
      dst_img.updatePixels();
      image(dst_img, width/4, height/4);

      
      colorMode(RGB);

    }
  }
}
