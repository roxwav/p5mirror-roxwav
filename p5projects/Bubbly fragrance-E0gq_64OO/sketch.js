function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  let x = 0;
  let column = 0; // track column index

  while (x < width) {
    if (mouseX > x && mouseX < x + 20) {
      // only fill even columns with blue
      if (column % 2 === 0) {
        fill(0, 0, 255); // blue for even columns
      } else {
        fill(255); // odd columns stay white
      }
    } else {
      fill(255); // default white
    }

    rect(x, 0, 20, height);

    x = x + 20;
    column++;
  }
}

