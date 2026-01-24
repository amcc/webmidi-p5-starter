// we will use this to store the MIDI device once we find it
let midiInput = null;

// set some initial values for our sketch
let circleSize = 100;
let circleHue = 0;
let circleStroke = 10;
let bgColour = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  // ebable WebMidi.js
  WebMidi.enable()
    .then(onEnabled)
    .catch((err) => alert(err));
}

// SEE THE COMMENTED OUT CODE IN onEnabled() FOR HELP FINDING YOUR DEVICE NAME
// this function is called once WebMidi.js is ready to use
function onEnabled() {
  if (WebMidi.inputs.length < 1) {
    console.log("no midi devices found");
    return;
  }

  // WHEN STARTING OUT USE THE CODE BELOW TO FIND YOUR DEVICE NAME
  // THE LOOP BELOW WILL LOG EVERY CONNECTED MIDI DEVICE TO THE CONSOLE
  // WebMidi.inputs.forEach((device, index) => {
  //   console.log(index + ": " + device.name);
  // });

  // ADD YOUR DEVICE NAME INSTEAD OF "MPD218 Port A"
  midiInput = WebMidi.getInputByName("MPD218 Port A");

  // if we dont find the device, exit
  if (!midiInput) {
    console.log("Device not found");
    return;
  }

  midiInput.addListener("noteon", noteOn);
  midiInput.addListener("controlchange", controlChange);
  midiInput.addListener("channelaftertouch", pressure);
}

function draw() {
  background(bgColour, 100, 100);

  stroke(0);
  strokeWeight(circleStroke);
  fill(circleHue, 100, 100);

  circle(width / 2, height / 2, circleSize);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// MIDI event handlers
// these are called whenever a MIDI message is received
// the 'note', 'pot', and 'touch' objects contain useful information about the message
function noteOn(note) {
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

function pressure(touch) {
  console.log(touch);
  circleStroke = midiMap(touch.value, 0, 100);
}

// MIDI values are always 0–1
// This converts them into useful screen values
function midiMap(value, min, max) {
  return map(value, 0, 1, min, max);
}
