let osc
let rms = 0

function setup() {
  createCanvas(600, 400)

  osc = new OSC({ plugin: new OSC.WebsocketClientPlugin() })

  osc.on("/rms", (msg) => {
    const a = msg.args[0]
    rms = typeof a === "object" && a !== null && "value" in a ? a.value : a
  })

  osc.open({ host: "127.0.0.1", port: 8081 })
}

let smoothLevel = 0

function draw() {
  background(255)

  const floor = 0.02
  const ceiling = 0.07

  let level = (rms - floor) / (ceiling - floor)
  level = constrain(level, 0, 1)

  const radius = lerp(20, 320, level)

  noStroke()
  fill(255, 150, 200)
  circle(width / 2, height / 2, radius)

  fill(180)
  textSize(14)
  text(`rms ${rms.toFixed(4)}   level ${level.toFixed(2)}`, 20, 25)
}
