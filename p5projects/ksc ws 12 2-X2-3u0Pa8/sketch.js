let lines;
let words = [];

function preload() {
  lines = loadStrings("poem.txt");
}

function setup() {
  createCanvas(800, 500);
  textSize(20);

  for (let i = 0; i < lines.length; i++) {
    let lineWords = splitTokens(lines[i], " ,.’’");
    for (let w = 0; w < lineWords.length; w++) {
      words.push(lineWords[w]);
    }
  }
}

function draw() {
  background(220);
}