// MIDI device
let midiInput = null;
let isConnected = false;

// Circle properties
let circleSize = 100;
let circleColor = 100;

function setup() {
  createCanvas(800, 600);

  // Connect to MIDI
  WebMidi.enable()
    .then(onEnabled)
    .catch((err) => console.log(err));
}

function onEnabled() {
  if (WebMidi.inputs.length < 1) {
    console.log("No MIDI devices found");
    return;
  }

  // Connect to first available MIDI device
  midiInput = WebMidi.inputs[2];
  isConnected = true;
  console.log("Connected to: " + midiInput.name);

  // Listen for knob turns (controller change)
  midiInput.addListener("controlchange", onKnobTurn);
}

function draw() {
  // Background
  background(220);

  // Draw circle
  fill(circleColor, 150, 200);
  noStroke();
  circle(width / 2, height / 2, circleSize);

  // Show connection status
  fill(0);
  textSize(14);
  text(isConnected ? "✓ MIDI Connected" : "⚠ No MIDI Device", 20, 30);
}

// MIDI event: knob turn
// Knob 3 (CC 3) = size
// Knob 9 (CC 9) = color
function onKnobTurn(event) {
  console.log(event);
  // Convert MIDI value (0-127) to 0-1 range
  let midiValue = event.value;

  // Knob 3 controls circle size
  if (event.controller.number === 3) {
    circleSize = map(midiValue, 0, 1, 50, 400);
  }

  // Knob 9 controls circle color
  if (event.controller.number === 9) {
    circleColor = map(midiValue, 0, 1, 0, 255);
  }
}
