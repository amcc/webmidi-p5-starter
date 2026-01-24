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

  // enable WebMidi.js
  WebMidi.enable()
    .then(onEnabled)
    .catch((err) => alert(err));

  // Function triggered when WEBMIDI.js is ready
  function onEnabled() {
    // Display available MIDI input devices
    if (WebMidi.inputs.length < 1) {
      console.log("no midi devices found");
    } else {
      // find all the inputs and log them to the console
      // WebMidi.inputs.forEach((device, index) => {
      //   console.log(index + ": " + device.name);
      // });

      midiInput = WebMidi.getInputByName("MPD218 Port A");
      midiInput.addListener("noteon", (e) => noteOn(e));
      midiInput.addListener("controlchange", (e) => controlChange(e));
    }
  }
}

function draw() {
  background(bgColour, 100, 100);
  fill(circleHue, 100, 100);
  currentCircleStroke = lerp(currentCircleStroke, circleStroke, damp);
  strokeWeight(currentCircleStroke);
  currentCircleSize = lerp(currentCircleSize, circleSize, damp);
  circle(width / 2, height / 2, currentCircleSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function noteOn(note) {
  console.log(note.value, note.velocity);
  if (note.note.number === 48) {
    circleSize = map(note.value, 0, 1, 0, width);
    circleHue = map(note.value, 0, 1, 0, 360);
  }
}

function controlChange(pot) {
  if (pot.controller.number === 3) {
    circleSize = map(pot.value, 0, 1, 0, width);
  }
  if (pot.controller.number === 9) {
    circleHue = map(pot.value, 0, 1, 0, 360);
  }
  if (pot.controller.number === 12) {
    circleStroke = map(pot.value, 0, 1, 0, 100);
  }
  if (pot.controller.number === 13) {
    bgColour = map(pot.value, 0, 1, 360, 0);
  }
}
