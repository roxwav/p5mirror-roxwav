// Take the phrase “I wish to wash my Irish wristwatch.” and display the characters in it randomly on the screen.
// index:   0 1 2 3 4 5 ...
// chars:   I _ w i s h ...

let phrase = "I wish to wash my Irish wristwatch.";

function setup() {
  createCanvas(600, 400);
  textSize(24);
  textAlign(CENTER, CENTER);
}
function draw() {
  background(250, 240, 250);

  for (let i = 0; i < phrase.length; i++) {
    let ch = phrase[i]; 
    let x = random(width);
    let y = random(height);
    text(ch, x, y);
  }

  noLoop(); 
}
