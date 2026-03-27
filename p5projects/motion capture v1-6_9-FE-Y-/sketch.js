let video;
let go = false;
let snapshots = [];

function setup() {
  createCanvas(800, 240);
  background(51);
  video = createCapture(VIDEO, () => go = true);
  video.size(320, 240);
  video.hide();            // don't show the DOM video on top of the canvas
  frameRate(12);           // slower capture so we can see the grid build
}

function draw() {
  if (!go) return;

  // take a snapshot each frame (or add a button to control this)
  snapshots.push(video.get());

  // grid cell size
  const w = 80, h = 60;
  const cols = floor(width / w);
  const rows = floor(height / h);
  const maxSnaps = cols * rows;

  // keep only what fits on screen
  if (snapshots.length > maxSnaps) snapshots.shift();

  background(51);
  tint(255, 50);

  // draw all snapshots in a grid
  for (let i = 0; i < snapshots.length; i++) {
    const x = (i % cols) * w;
    const y = floor(i / cols) * h;
    image(snapshots[i], x, y, w, h);
  }

  noTint();
}
