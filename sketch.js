// we will use this to store the MIDI device once we find it
let midiInput = null;
let circleSize = 100;
let currentCircleSize = circleSize;
let circleHue = 0;
let circleStroke = 10;
let currentCircleStroke = circleStroke;
let bgColour = 0;
let damp = 0.1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  WebMidi.enable()
    .then(onEnabled)
    .catch((err) => alert(err));
}

function onEnabled() {
  if (WebMidi.inputs.length < 1) {
    console.log("no midi devices found");
    return;
  }

  midiInput = WebMidi.getInputByName("MPD218 Port A");

  if (!midiInput) {
    console.log("MPD218 not found");
    return;
  }

  midiInput.addListener("noteon", noteOn);
  midiInput.addListener("controlchange", controlChange);
  midiInput.addListener("channelaftertouch", pressure);
}

function draw() {
  background(bgColour, 100, 100);

  stroke(0);
  strokeWeight(currentCircleStroke);
  fill(circleHue, 100, 100);

  currentCircleStroke = lerp(currentCircleStroke, circleStroke, damp);
  currentCircleSize = lerp(currentCircleSize, circleSize, damp);

  circle(width / 2, height / 2, currentCircleSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function noteOn(note) {
  // note.value = velocity (0–1)
  // note.note.number = which pad

  if (note.note.number === 48) {
    circleSize = midiMap(note.value, 0, width);
    circleHue = midiMap(note.value, 0, 360);
  }
}

function controlChange(pot) {
  if (pot.controller.number === 3) {
    circleSize = midiMap(pot.value, 0, width);
  } else if (pot.controller.number === 9) {
    circleHue = midiMap(pot.value, 0, 360);
  } else if (pot.controller.number === 12) {
    circleStroke = midiMap(pot.value, 0, 100);
  } else if (pot.controller.number === 13) {
    bgColour = midiMap(pot.value, 360, 0);
  }
}

function pressure(pad) {
  circleStroke = midiMap(pad.value, 0, 100);
}

// MIDI values are always 0–1
// This converts them into useful screen values
function midiMap(value, min, max) {
  return map(value, 0, 1, min, max);
}
