function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  let x = 0;
  while (x < width) {
    if (mouseX > x && mouseX < x + 20) {
      // if mouse is over this strip:
      if (x < width / 2) {
        fill(0, 0, 255); // left half -> blue
      } else {
        fill(255, 0, 0); // right half -> red
      }
    } else {
      fill(255); // default white
    }

    rect(x, 0, 20, height);
    x = x + 20;
  }
}

