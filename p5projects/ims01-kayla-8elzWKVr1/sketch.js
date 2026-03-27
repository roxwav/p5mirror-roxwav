// ims01-kayla
// original sketch by xanderking:
// https://editor.p5js.org/xanderking/sketches/kxRi3T9xr

// my understanding of how this sketch works:
//
// this sketch creates a bunch of particles and moves them through a flow field.
// the flow field is made from gradient noise. each particle checks the noise value
// at its current position, turns that value into an angle, and then moves in that direction.
//
// the result is that the particles look like they are flowing through invisible currents.
//
// the sketch is also audio reactive. it analyzes the song with fft and uses the low-frequency
// energy to control particle speed and some of the flashing / background behavior.
//
// color is mapped across the screen using the particle x and y positions.
// alpha is based on the distance from a moving light point, so particles closer to the light
// are more visible. this makes it look like the particles are being revealed by a spotlight
// or following a path.
//
// the behavior changes depending on song.currentTime(), so different moments in the song
// trigger different color palettes, different light positions, and different noise seeds.
//
// i think changing the noiseSeed at different times basically makes the whole flow field
// become a different field, so the particles suddenly move in a new directional pattern.
//

var song;
var particles = [];
const num = 1000;
var speed;
var fft;
var r1, r2, g1, g2, b1, b2;
var bga;
var sw;
var lightX;
var lightY;

// these booleans seem to make sure each light position only gets initialized once
// when a new section begins
var initLightA = true;
var initLightB = true;
var initLightC = true;
var initLightD = true;

var dir = 1;
var lightning;

// this controls how zoomed in the noise field is
// smaller value = smoother, broader flow
const noiseScale = 0.01;

function preload() {
  song = loadSound("purgatory_edit.mp3");
}

function setup() {
  createCanvas(1000, 563);

  // create a bunch of particles at random positions
  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
  }

  song.loop();
  song.setVolume(0.4);

  // fft analyzes the audio spectrum
  fft = new p5.FFT();
}

function draw() {
  // translucent background instead of fully clearing screen
  // this helps create the trailing / smoky feeling
  background(10, bga);

  fft.analyze();

  // using low frequencies to drive motion and flashes
  amp = fft.getEnergy(20, 250);

  // louder bass/low energy = faster particles
  speed = map(amp, 20, 250, 0.5, 2);

  // same value also reused for lightning logic later
  lightning = map(amp, 20, 250, 0.5, 2);

  for (let i = 0; i < num; i++) {
    let p = particles[i];

    // color changes across the screen based on x and y
    var r = map(p.x, 0, width, r1, r2);
    var g = map(p.y, 0, width, g1, g2);
    var b = map(p.x, 0, width, b1, b2);

    // particles are brightest near the moving light point
    // farther away = more transparent
    var alpha = map(dist(lightX, lightY, p.x, p.y), 0, 200, 255, 0);

    // in this section, alpha is forced to 150, so the spotlight logic is temporarily flattened
    if (song.currentTime() > 10.67 && song.currentTime() < 14.21) {
      alpha = 150;
    }

    stroke(r, g, b, alpha);
    strokeWeight(sw);
    point(p.x, p.y);

    // get a perlin noise value from the particle position
    let n = noise(p.x * noiseScale, p.y * noiseScale);

    // map that noise value to an angle around the circle
    let a = TAU * n;

    // move particle in that angle direction
    p.x += cos(a) * speed;
    p.y += sin(a) * speed;

    // if particle leaves screen, respawn it randomly
    if (!onScreen(p)) {
      p.x = random(width);
      p.y = random(height);
    }
  }

  // these sections seem to control the strength of trails / flashes
  // bga affects background alpha, and sw affects stroke weight
  if (song.currentTime() > 2.3 && song.currentTime() < 3.55) {
    bga += 1.5;
    sw -= 0.13;
  } else if (song.currentTime() > 5.85 && song.currentTime() < 7.14) {
    bga += 1.5;
    sw -= 0.13;
  } else if (song.currentTime() > 9.47 && song.currentTime() < 10.67) {
    bga += 1.5;
    sw -= 0.13;
  } else if (song.currentTime() > 11.58 && song.currentTime() < 14.22) {
    if (song.currentTime() > 13.5) {
      bga += 10;
      sw -= 0.1;
    } else {
      bga += 0.2;
      sw -= 0.01;
    }
  } else if (song.currentTime() > 29) {
    bga += 1.5;
    sw -= 0.13;
  } else if (song.currentTime() > 14.22) {
    if (lightning > 1.5) {
      bga = 15;
      sw = 2;
    } else {
      bga += 1;
      // question: is this supposed to be 0.13?
      sw -= 013;
    }
  } else {
    bga = 15;
    sw = 2;
  }

  // this whole section changes the visual system depending on where the song is
  if (song.currentTime() < 3.55) {
    initLight0();
    initLightA = false;

    // changing noiseSeed changes the flow field pattern
    noiseSeed(1);

    setRGB(50, 100, 200, 250, 250, 50);

    lightX -= 4;
    lightY += 0.2;
  } else if (song.currentTime() < 7.13) {
    initLight1();
    initLightB = false;
    noiseSeed(2);
    setRGB(200, 250, 50, 100, 250, 50);
    lightX -= 3.8;
    lightY -= 1.5;
  } else if (song.currentTime() < 10.67) {
    initLight2();
    initLightC = false;
    noiseSeed(50);
    setRGB(50, 100, 250, 50, 200, 250);
    lightX -= 4;
    lightY += 0.5;
  } else if (song.currentTime() < 14.21) {
    noiseSeed(4);
    setRGB(255, 255, 255, 255, 255, 255);

    // here the light follows the mouse
    lightX = mouseX;
    lightY = mouseY;
  } else if (song.currentTime() > 14.21) {
    if (song.currentTime() < 29) {
      initLight3();
      initLightD = false;
    } else {
      // after this point, it resets the init flags
      initLightA = true;
      initLightB = true;
      initLightC = true;
      initLightD = true;
    }

    noiseSeed(10);

    let rand = random();

    // randomly switches between green/pink-ish palette and white
    if (rand > 0.5) {
      setRGB(100, 255, 50, 200, 255, 200);
    } else {
      setRGB(255, 255, 255, 255, 255, 255);
    }

    if (lightX > width || lightX < 0) {
      dir = dir * -1;
    }

    // louder moments cause the light to jump to random positions
    if (lightning > 1.5) {
      lightX = random(100, 900);
      lightY = random(50, 513);
    }
  }
}

function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

// each initLight function sets the starting position of the spotlight
// for a particular section, but only once
function initLight0() {
  if (initLightA == true) {
    lightX = 950;
    lightY = 20;
  }
}

function initLight1() {
  if (initLightB == true) {
    lightX = 900;
    lightY = 500;
  }
}

function initLight2() {
  if (initLightC == true) {
    lightX = 950;
    lightY = 20;
  }
}

function initLight3() {
  if (initLightD == true) {
    lightX = 10;
    lightY = 553;
  }
}

// helper function for setting color gradient endpoints
function setRGB(a, b, c, d, e, f) {
  r1 = a;
  r2 = b;
  g1 = c;
  g2 = d;
  b1 = e;
  b2 = f;
}

// Question: How can I synchronize the 'glitchAmount' trigger with the BPM of a sound track?
// questions:
// 1. why does noiseSeed changing at different song times feel almost like changing the wind?
// 3. if the background were fully opaque every frame, would the flow field lose most of its look?
// 4. how would this change if particles drew lines instead of points?
 