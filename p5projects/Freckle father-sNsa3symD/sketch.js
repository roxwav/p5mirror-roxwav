function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  background(220);

  let s = 40; // cell size

  // 10 rows
  for (let row = 0; row < 10; row++) {
    // 10 columns
    for (let col = 0; col < 10; col++) {
      let x = col * s;
      let y = row * s;

      if (mouseX > x && mouseX < x + s && mouseY > y && mouseY < y + s) {
        fill(255, 0, 0); // turn red on hover
      } else {
        fill(255); // white otherwise
      }

      rect(x, y, s, s);
    }
  }
}
