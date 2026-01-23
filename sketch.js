// we will use this to store the MIDI device once we find it
let midiInput = null;

function setup() {
  createCanvas(windowWidth, windowHeight);

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
      WebMidi.inputs.forEach((device, index) => {
        console.log(index + ": " + device.name);
        midiInput = WebMidi.getInputByName("MPD218 Port A");
      });
    }
  }
}

function draw() {
  background(255);
  circle(width / 2, height / 2, 100);
  console.log(midiInput);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
