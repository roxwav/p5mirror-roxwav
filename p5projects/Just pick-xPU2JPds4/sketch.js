let str = "";
let p;
function preload() {
}
function setup() {
  p = createP;
}

function draw() {
  if (frameCount % 30 == 1) {
    str += random(WORD);
    p.html(str);
  }
  function process(lines) {
    for (let line of lines) {
      let tokens = splitTokens(line);
      console.log("tokens");
      word.push(tokens)
    }
  }
}
