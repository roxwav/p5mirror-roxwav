let osc
let lastText = "say something"
let bg = [0, 0, 0]
let bigNum = 0

function setup() {
  createCanvas(600, 400)
  textSize(18)

  osc = new OSC({ plugin: new OSC.WebsocketClientPlugin() })

  osc.on("/speech/text", (msg) => {
    lastText = msg.args[0]
    console.log("/speech/text", lastText)
  })

  osc.on("/speech/color", (msg) => {
    bg = [msg.args[0], msg.args[1], msg.args[2]]
    console.log("/speech/color", bg)
  })

  osc.on("/speech/number", (msg) => {
    bigNum = msg.args[0]
    console.log("/speech/number", bigNum)
  })

  osc.open({ host: "127.0.0.1", port: 8080 })
}

function draw() {
  background(bg[0], bg[1], bg[2])
  fill(255)
  text("heard:", 20, 30)
  text(lastText, 20, 60)

  textSize(96)
  text(bigNum, 20, 180)
  textSize(18)
}