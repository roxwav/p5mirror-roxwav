function setup() {
  createCanvas(100, 100);
        stroke("red")
}

function draw() {
  background(220);
  for (let x=0; x<width; x++){
   for (let y=0; y<height; y++){
      point (x,y)
    }
  }
}