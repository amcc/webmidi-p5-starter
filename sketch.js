// we will use this to store the MIDI device once we find it
let midiInput = null;

// set some initial values for our sketch
let circleSize = 100;
let circleHue = 0;
let circleStroke = 10;
let bgColour = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // use HSB mode as it makes colour more fun
  // H = Hue from 0 to 360
  // S = Saturation from 0 - 100
  // B = Brightness from 0 - 100
  colorMode(HSB);

  // enable WebMidi.js
  WebMidi.enable()
    .then(onEnabled)
    .catch((err) => alert(err));
}

// this function is called once WebMidi.js is ready to use
function onEnabled() {
  if (WebMidi.inputs.length < 1) {
    console.log("no midi devices found");
    return;
  }

  // THE LOOP BELOW WILL LOG EVERY CONNECTED MIDI DEVICE
  // THERE MAY BE DEFAULT DEVICES ALREADY ON YOUR SYSTEM
  // HARDWARE MIDI DEVICES WILL HAVE A NAME YOU RECOGNISE
  WebMidi.inputs.forEach((device, index) => {
    console.log(index + ": " + device.name);
  });

  // HERE ARE SOME EXAMPLE DEVICE NAMES YOU CAN USE
  // THE ABOVE CODE GIVES YOU THE EXACT NAME FOR YOUR DEVICE
  // The below code assumes your device is "MPD218 Port A"

  midiInput = WebMidi.getInputByName("MPD218 Port A");

  // if we dont find the device, exit
  if (!midiInput) {
    console.log("Device not found");
    return;
  }

  // This code sets up listeners for:
  // Pressing a pad/key that plays a note
  midiInput.addListener("noteon", noteOn);
  // Twisting a pot/knob
  midiInput.addListener("controlchange", controlChange);
  // The pressure on a note/pad after its touched
  midiInput.addListener("channelaftertouch", pressure);
}

function draw() {
  background(bgColour, 100, 100);

  stroke(0);
  strokeWeight(circleStroke);
  fill(circleHue, 100, 100);

  // draw a circle
  circle(width / 2, height / 2, circleSize);
}

// MIDI event handlers
// these are called whenever a MIDI message is received
// the 'note', 'pot', and 'touch' objects contain useful information about the message

// respond to notes / pads
function noteOn(note) {
  // log the note number and value to the console
  console.log("note: " + note.note.number + " value: " + note.value);
  if (note.note.number === 41) {
    circleSize = midiMap(note.value, 0, width);
    circleHue = midiMap(note.value, 0, 360);
  }
}

// respond to changes in the pots
function controlChange(pot) {
  // log the controller number and value to the console
  console.log("pot: " + pot.controller.number + " value: " + pot.value);

  // look for different pots, find their number in the console
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

// some MIDI devices support pressure/aftertouch messages
// this function is called whenever a pressure message is received
function pressure(touch) {
  console.log("pressure: " + touch.value);
  circleStroke = midiMap(touch.value, 0, 100);
}

// MIDI values are always 0–1
// This converts them into useful screen values
function midiMap(value, min, max) {
  return map(value, 0, 1, min, max);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
