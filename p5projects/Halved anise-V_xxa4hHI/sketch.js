let lastTime=0 
//timestamp
function setup() {
  createCanvas(400, 400);
}
function draw () {
  background (220, 209, 220);
  if (millis() - lastTime > 500){
    //at least 500ms have passed, so draw a rectangle
    rect(200, 200, 50, 100)
    lastTime= millis();
    //reset the timer so that the next rectangle won't appear unless another 500ms pass
  }
}