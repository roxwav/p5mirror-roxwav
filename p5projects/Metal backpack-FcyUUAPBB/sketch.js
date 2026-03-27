// --- WebSerial instance ---
const serial = new p5.WebSerial();

// --- UI / state ---
let portButton, disconnectButton;
let xPos = 0;          // x position for the scrolling graph
let inVal = null;      // latest numeric reading (number)
let inData = "";       // latest raw line (string)
let outByte = 0;       // for outgoing data

function setup() {
  createCanvas(400, 300); // make the canvas
  background(0);
  textFont('monospace');

  if (!navigator.serial) {
    alert("WebSerial is not supported in this browser. Try Chrome or MS Edge.");
  }

  // if serial is available, add connect/disconnect listeners:
  navigator.serial.addEventListener("connect", portConnect);
  navigator.serial.addEventListener("disconnect", portDisconnect);

  // check for any ports that are available:
  serial.getPorts();

  // UI + serial event hooks:
  serial.on("noport", makePortButton);      // if there's no port chosen, show a button
  serial.on("portavailable", openPort);     // open whatever port is available
  serial.on("requesterror", portError);     // handle serial errors
  serial.on("data", serialEvent);           // handle incoming serial data
  serial.on("close", makePortButton);       // show button again when port closes
}

function draw() {
  // background + readout
  background(0);
  fill(255);
  text(`incoming: ${inData}`, 10, 20);

  // draw graph if numeric value present
  if (Number.isFinite(inVal)) {
    graphData(inVal);
  }
}

// --- UI helpers ---
function makePortButton() {
  if (portButton) portButton.remove();
  portButton = createButton("choose port");
  portButton.position(10, 10);
  portButton.mousePressed(choosePort);

  if (disconnectButton) disconnectButton.remove();
  disconnectButton = createButton("disconnect");
  disconnectButton.position(120, 10);
  disconnectButton.mousePressed(closePort);
}

function choosePort() {
  serial.requestPort();
}

function openPort() {
  // IMPORTANT: open with baudRate and only once
  serial.open({ baudRate: 9600 }).then(() => {
    console.log("port open");
    if (portButton) portButton.hide();
  }).catch(portError);
}

// --- graph ---
function graphData(v) {
  // auto-detect 0–255 vs 0–1023
  const hi = v > 255 ? 1023 : 255;
  const y = map(v, 0, hi, 0, height);

  stroke(0xA8, 0xD9, 0xA7);
  line(xPos, height, xPos, height - y);

  xPos++;
  if (xPos >= width) {
    xPos = 0;
    // clear the screen
    background(0);
  }
}

// --- serial handlers ---
function serialEvent() {
  // assume newline-terminated ASCII from Arduino (Serial.println(...))
  const line = serial.readLine();
  if (!line) return;

  inData = line.trim();                 // keep raw text for display
  const v = Number(inData);
  if (Number.isFinite(v)) inVal = v;    // update numeric value for graph
}

function portError(err) {
  alert("Serial port error: " + err);
}

function portConnect() {
  console.log("port connected");
  serial.getPorts();
}

function portDisconnect() {
  serial.close();
  console.log("port disconnected");
}

function closePort() {
  serial.close().then(() => {
    console.log("port closed");
    if (portButton) portButton.show();
  }).catch(console.error);
}

// --- keyboard -> serial ---
function keyPressed() {
  // send 0..225 in steps of 25 when pressing keys '0'..'9'
  if (key >= '0' && key <= '9') {
    outByte = (key.charCodeAt(0) - '0'.charCodeAt(0)) * 25; // 0..225
    // Send as a line so Arduino can read easily
    serial.write(String(outByte) + '\n');
    console.log('sent:', outByte);
  }
  function keyPressed() {
  if (key >= 0 && key <= 9) {
    // if the user presses 0 through 9
    outByte = byte(key * 25); // map the key to a range from 0 to 225
    serial.write(outByte); // send it out the serial port
  }
  if (key === "H" || key === "L") {
    // if the user presses H or L
    serial.write(key); // send it out the serial port
  }
}
}
