function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  let x = 0;
  let column = 0;

  while (x < width) {
    if (mouseX > x && mouseX < x + 20) {
      if (column == 0) {
        fill(255, 179, 186); // pink
      } else if (column == 1) {
        fill(255, 223, 186); // peach
      } else if (column == 2) {
        fill(255, 255, 186); // yellow
      } else if (column == 3) {
        fill(186, 255, 201); // mint
      } else if (column == 4) {
        fill(186, 225, 255); // light blue
      } else if (column == 5) {
        fill(219, 186, 255); // lavender
      } else if (column == 6) {
        fill(255, 200, 230); // pink2
      } else if (column == 7) {
        fill(200, 255, 240); // teal
      } else if (column == 8) {
        fill(240, 200, 255); // lilac
      } else if (column == 9) {
        fill(255, 240, 200); // cream
      } else if (column == 10) {
        fill(210, 255, 200); // green pastel
      } else if (column == 11) {
        fill(200, 240, 255); // sky pastel
      } else if (column == 12) {
        fill(255, 200, 240); // rose pastel
      } else if (column == 13) {
        fill(240, 255, 200); // lime pastel
      } else if (column == 14) {
        fill(200, 255, 220); // mint2 pastel
      } else if (column == 15) {
        fill(200, 220, 255); // periwinkle pastel
      } else if (column == 16) {
        fill(250, 200, 255); // violet pastel
      } else if (column == 17) {
        fill(255, 220, 200); // coral pastel
      } else if (column == 18) {
        fill(220, 255, 200); // light green pastel
      } else if (column == 19) {
        fill(200, 255, 250); // aqua pastel
      }
    } else {
      fill(255); // default white
    }

    rect(x, 0, 20, height);

    x = x + 20;
    column++;
  }
}
