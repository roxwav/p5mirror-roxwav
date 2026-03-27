let mic, amp, fft
let hist = []

function setup() {
  createCanvas(900, 520)

  mic = new p5.AudioIn()
  amp = new p5.Amplitude()
  amp.smooth(0)

  fft = new p5.FFT(0, 1024)
}

function mousePressed() {
  userStartAudio()
  mic.start(() => {
    amp.setInput(mic)
    fft.setInput(mic)
  })
}

function keyPressed() {
  if (key === "c" || key === "C") hist = []
}

function draw() {
  background(250)

  const ac = getAudioContext()
  if (ac.state !== "running" || !mic.enabled) {
    fill(20)
    textSize(18)
    text("click to enable microphone", 20, 50)
    textSize(14)
    text("C = clear graph", 20, 75)
    return
  }

  fft.analyze()

  let rms = amp.getLevel()
  let cent = fft.getCentroid()

  let state =
    rms > 0.18 ? "AGITATED" :
    rms > 0.08 ? (cent > 2500 ? "ALERT" : "ENGAGED") :
    rms > 0.03 ? "NEUTRAL" : "QUIET"

  hist.push(rms)
  if (hist.length > 360) hist.shift()

  fill(20)
  textSize(14)
  text("biometric capture: microphone", 20, 26)
  text(`state: ${state}`, 20, 48)
  text(`centroid: ${cent.toFixed(0)} Hz`, 20, 70)

  noFill()
  stroke(0)
  rect(20, 120, width - 40, 150)

  beginShape()
  for (let i = 0; i < hist.length; i++) {
    let x = map(i, 0, 359, 20, width - 20)
    let y = map(hist[i], 0, 0.25, 270, 120, true)
    vertex(x, y)
  }
  endShape()
}
