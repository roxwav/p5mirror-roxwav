let rows = 4
let cols = 16
let grid = []

let cellW = 40
let cellH = 40
let gridX = 80
let gridY = 120

let currentStep = 0
let loop
let started = false

let kickSynth, snareSynth, hatSynth, clapSynth
let arpSynth
let arpOn = true

let tempoSlider
let playButton
let arpButton

let rowLabels = ["kick", "snare", "hat", "clap"]

let arpNotes = [
  "C4", "E4", "G4", "B4",
  "C5", "B4", "G4", "E4",
  "D4", "F4", "A4", "C5",
  "G4", "E4", "D4", "C4"
]

function setup() {
  createCanvas(800, 360)

  for (let r = 0; r < rows; r++) {
    grid[r] = []
    for (let c = 0; c < cols; c++) {
      grid[r][c] = 0
    }
  }

  tempoSlider = createSlider(60, 180, 108, 1)
  tempoSlider.position(80, 30)
  tempoSlider.style("width", "200px")

  playButton = createButton("play / stop")
  playButton.position(300, 30)
  playButton.mousePressed(toggleTransport)

  arpButton = createButton("arp: on")
  arpButton.position(390, 30)
  arpButton.mousePressed(toggleArp)

  kickSynth = new Tone.MembraneSynth().toDestination()

  snareSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0 }
  }).toDestination()

  hatSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0 }
  }).toDestination()

  clapSynth = new Tone.NoiseSynth({
    noise: { type: "pink" },
    envelope: { attack: 0.001, decay: 0.1, sustain: 0 }
  }).toDestination()

  arpSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "triangle"
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.2,
      release: 0.4
    }
  }).toDestination()

  arpSynth.volume.value = -10

  Tone.Transport.bpm.value = tempoSlider.value()

  loop = new Tone.Loop(() => {
    playStep(currentStep)
    playArp(currentStep)
    currentStep = (currentStep + 1) % cols
  }, "16n")

  seedPattern()
}

function draw() {
  background(245)

  fill(20)
  noStroke()
  textSize(16)
  text("tempo: " + tempoSlider.value() + " bpm", 80, 25)
  text("click squares to turn beats on/off", 80, 95)
  text("major arp follows the loop", 530, 35)

  Tone.Transport.bpm.value = tempoSlider.value()

  drawGrid()
}

function drawGrid() {
  textSize(14)

  for (let c = 0; c < cols; c++) {
    fill(40)
    noStroke()
    textAlign(CENTER, CENTER)
    text(c + 1, gridX + c * cellW + cellW / 2, gridY - 20)
  }

  for (let r = 0; r < rows; r++) {
    fill(40)
    textAlign(RIGHT, CENTER)
    text(rowLabels[r], gridX - 10, gridY + r * cellH + cellH / 2)

    for (let c = 0; c < cols; c++) {
      let x = gridX + c * cellW
      let y = gridY + r * cellH

      if (c === currentStep && started) {
        fill(220, 235, 255)
      } else {
        fill(255)
      }

      stroke(120)
      rect(x, y, cellW, cellH)

      if (grid[r][c] === 1) {
        fill(30)
        noStroke()
        ellipse(x + cellW / 2, y + cellH / 2, 18, 18)
      }
    }
  }
}

function mousePressed() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = gridX + c * cellW
      let y = gridY + r * cellH

      if (
        mouseX > x &&
        mouseX < x + cellW &&
        mouseY > y &&
        mouseY < y + cellH
      ) {
        grid[r][c] = grid[r][c] === 0 ? 1 : 0
      }
    }
  }
}

async function toggleTransport() {
  await Tone.start()

  if (!started) {
    currentStep = 0
    loop.start(0)
    Tone.Transport.start()
    started = true
  } else {
    Tone.Transport.stop()
    loop.stop()
    started = false
  }
}

function toggleArp() {
  arpOn = !arpOn
  arpButton.html(arpOn ? "arp: on" : "arp: off")
}

function playStep(step) {
  if (grid[0][step] === 1) kickSynth.triggerAttackRelease("C1", "8n")
  if (grid[1][step] === 1) snareSynth.triggerAttackRelease("16n")
  if (grid[2][step] === 1) hatSynth.triggerAttackRelease("32n")
  if (grid[3][step] === 1) clapSynth.triggerAttackRelease("16n")
}

function playArp(step) {
  if (!arpOn) return

  let note = arpNotes[step]
  arpSynth.triggerAttackRelease(note, "16n")
}

function seedPattern() {
  grid[0][0] = 1
  grid[0][4] = 1
  grid[0][8] = 1
  grid[0][12] = 1

  grid[1][4] = 1
  grid[1][12] = 1

  for (let i = 0; i < cols; i += 2) {
    grid[2][i] = 1
  }

  grid[3][10] = 1
}