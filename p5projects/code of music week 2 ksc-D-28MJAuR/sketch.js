// animal crossing live quantized sequencer (8-step)
// space start/stop
// q w e r a s d f place hits (quantized to next step)
// backspace clear

// this sketch is a simple 8-step sequencer where time moves across a grid and each row controls a different sound. a clock advances the playhead at a steady tempo, and when it reaches a step with a hit, that sound plays. pressing keys writes notes into the next step so everything is automatically quantized, and the grid visualization shows both the pattern and the beat as it runs.

let steps = 8, rows = 8, bpm = 120
let stepms, cur = 0, nextt = 0, on = false

let grid = []
let keytorow = { q:0, w:1, e:2, r:3, a:4, s:5, d:6, f:7 }

let paths = ["01.wav","05.wav","11.wav","12.wav","14.wav","16.wav","19.wav","20.wav"]
let snd = []
let tutorial

function preload() {
  for (let i = 0; i < rows; i++) snd[i] = loadSound(paths[i])
  tutorial = loadSound("tutorial-002.mp3")
}

function setup() {
  createCanvas(720, 420)
  textAlign(CENTER, CENTER)
  stepms = (60000 / bpm) / 4
  for (let r = 0; r < rows; r++) grid[r] = Array(steps).fill(0)

  for (let i = 0; i < rows; i++) snd[i].setVolume(0.6)
  if (tutorial) tutorial.setVolume(1.3)
}

function draw() {
  background(255, 240, 247)
  if (on) tick()
  drawgrid()
  fill(70, 40, 55)
  text(on ? "running" : "stopped", width / 2, height - 16)
}

function tick() {
  while (millis() >= nextt) {
    cur = (cur + 1) % steps
    for (let r = 0; r < rows; r++) {
      if (grid[r][cur]) snd[r].play()
    }
    nextt += stepms
  }
}

function restartplayhead() {
  cur = 0
  nextt = millis() + stepms
  if (tutorial) {
    tutorial.stop()
    tutorial.jump(0)
    tutorial.loop()
  }
}

function keyPressed() {
  if (keyCode === 32) {
    userStartAudio()
    on = !on
    if (on) restartplayhead()
    else if (tutorial && tutorial.isPlaying()) tutorial.pause()
    return
  }

  if (!on) return

  if (keyCode === BACKSPACE) {
    for (let r = 0; r < rows; r++) grid[r].fill(0)
    restartplayhead()
    return
  }

  let k = key.toLowerCase()
  if (!(k in keytorow)) return

  let r = keytorow[k]
  let st = (cur + 1) % steps
  grid[r][st] = grid[r][st] ? 0 : 1
}

function drawgrid() {
  let gx = 92, gy = 36, cw = 56, ch = 36

  stroke(215, 140, 170)
  strokeWeight(2)
  fill(255, 226, 238)
  rect(24, 24, width - 48, height - 58)

  for (let r = 0; r < rows; r++) for (let s = 0; s < steps; s++) {
    let x = gx + s * cw
    let y = gy + r * ch
    fill(s === cur && on ? color(255, 205, 226) : color(255, 248, 252))
    rect(x, y, cw, ch)
    if (grid[r][s]) {
      fill(255, 190, 214)
      rect(x + 6, y + 6, cw - 12, ch - 12)
    }
  }

  noStroke()
  fill(70, 40, 55)
  textSize(13)
  let labels = ["q","w","e","r","a","s","d","f"]
  for (let r = 0; r < rows; r++) text(labels[r], 52, gy + r * ch + ch / 2)
}
