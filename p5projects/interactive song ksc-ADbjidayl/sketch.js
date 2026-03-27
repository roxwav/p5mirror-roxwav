let players = []
let sliders = []

const files = [
  "castle mover instrumental.mp3",
  "castle mover bells drums.mp3",
  "castle mover vox.mp3",
]
let pp = new Tone.PingPongDelay({ delayTime: "8n", feedback: 0.25, wet: 0.35 })
let dist = new Tone.Distortion(0)

let voxVerb = new Tone.Reverb({ decay: 3.5, preDelay: 0.02 })
let dry = new Tone.Gain(1)
let wet = new Tone.Gain(0)
let voxBus = new Tone.Gain(1)
let lim = new Tone.Limiter(-1)

let ppWetSlider, ppTimeSlider, ppFbSlider
let distSlider
let voxWetSlider, voxMakeupSlider

function setup() {
  createCanvas(560, 320)

  for (let i = 0; i < files.length; i++) {
    players[i] = new Tone.Player(encodeURI(files[i]))
    players[i].loop = true
    players[i].autostart = true
  }

  players[0].connect(pp)
  pp.toDestination()

  players[1].connect(dist)
  dist.toDestination()

  players[2].fan(dry, wet)
  dry.connect(voxBus)
  wet.connect(voxVerb)
  voxVerb.connect(voxBus)
  voxBus.connect(lim)
  lim.toDestination()

  for (let i = 0; i < players.length; i++) {
    sliders[i] = createSlider(-80, 0, -12, 1)
    sliders[i].position(20, 50 + i * 50)
    sliders[i].id = i
    sliders[i].input(volumeInput)
  }

  ppWetSlider = createSlider(0, 1, 0.35, 0.01)
  ppWetSlider.position(320, 50)
  ppWetSlider.input(updatePP)

  ppTimeSlider = createSlider(0, 1, 0.5, 0.01)
  ppTimeSlider.position(320, 100)
  ppTimeSlider.input(updatePP)

  ppFbSlider = createSlider(0, 0.85, 0.25, 0.01)
  ppFbSlider.position(320, 150)
  ppFbSlider.input(updatePP)

  distSlider = createSlider(0, 1, 0.15, 0.01)
  distSlider.position(320, 200)
  distSlider.input(updateDist)

  voxWetSlider = createSlider(0, 1, 0.25, 0.01)
  voxWetSlider.position(320, 250)
  voxWetSlider.input(updateVox)

  voxMakeupSlider = createSlider(-12, 12, 0, 0.5)
  voxMakeupSlider.position(320, 290)
  voxMakeupSlider.input(updateVox)

  updatePP()
  updateDist()
  updateVox()
}

function draw() {
  background(235)
  textSize(12)

  text("instrumental vol", 160, 65)
  text("bells+drums vol", 160, 115)
  text("vox vol", 160, 165)

  text("instrumental pingpong wet", 320, 40)
  text("instrumental pingpong time", 320, 90)
  text("instrumental pingpong feedback", 320, 140)

  text("bells+drums distortion", 320, 190)

  text("vox reverb wet", 320, 240)
  text("vox makeup dB", 320, 280)
}

function volumeInput() {
  let i = this.id
  players[i].volume.rampTo(this.value(), 0.05)
}

function updatePP() {
  pp.wet.rampTo(ppWetSlider.value(), 0.05)
  pp.feedback.rampTo(ppFbSlider.value(), 0.05)

  let times = ["16n", "12n", "8n", "6n", "4n"]
  let idx = Math.min(times.length - 1, Math.floor(ppTimeSlider.value() * times.length))
  pp.delayTime = times[idx]
}

function updateDist() {
  dist.distortion = distSlider.value()
}

function updateVox() {
  let w = voxWetSlider.value()
  dry.gain.rampTo(Math.cos(w * Math.PI * 0.5), 0.05)
  wet.gain.rampTo(Math.sin(w * Math.PI * 0.5), 0.05)

  let autoDb = w * 4
  voxBus.gain.rampTo(Tone.dbToGain(voxMakeupSlider.value() + autoDb), 0.05)
}
