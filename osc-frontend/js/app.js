let circles = [];
let circleIndex = 0;
let circleCount= 0;
const MAX_CIRCLES = 100;
let velocityScale = 1;

let drawPointer = {};

let sensor = {
  speed: 0,
  debug: 'hi',
  accX: 0.0,
  accY: 0.0,
  accZ: 0.0,
  fsrOne: 0.5,
  fsrTwo: 0.5,
  lastDataTimestamp: 0,
  lastDrawTimestamp: 0,
  counter: 0
};

let controls = {
  accMoveScale: 0.01,
  wormLength: MAX_CIRCLES
};

window.onload = () => {

  const gui = new dat.GUI();
  gui.add(sensor, "debug").listen();
  gui.add(sensor, "accX").listen();
  gui.add(sensor, "accY").listen();
  gui.add(sensor, "accZ").listen();
  gui.add(sensor, "fsrOne", 0.0, 1.0).listen();
  gui.add(sensor, "fsrTwo", 0.0, 1.0).listen();
  gui.add(sensor, "counter").listen();
  gui.add(controls, "accMoveScale", 0, 0.1);
  gui.add(controls, "wormLength", 1, MAX_CIRCLES*2).onFinishChange(function(data){
    circleIndex = 0;
    circleCount = 0;
  });
};

const initOSC = () => {
  var oscPort = new osc.WebSocketPort({
    url: "ws://localhost:8081", // URL to your Web Socket server.
    metadata: true
  });
  // Opening the Port:
  oscPort.open();  

  // Listening for incoming OSC messages:
  oscPort.on("message", function (oscMsg) {

    sensor.fsrOne = oscMsg.args[0].value;
    sensor.fsrTwo = oscMsg.args[1].value;
    sensor.accX = oscMsg.args[2].value;
    sensor.accY = oscMsg.args[3].value;
    sensor.accZ = oscMsg.args[4].value;

    sensor.counter++;

    redraw();

    sensor.lastDataTimestamp = new Date().valueOf();
  });
};

const initSocket = () => {

  var socket = io();
  socket.on('sensor', function (data) {
    // console.log('sensor data', data);
    sensor.fsrOne = data.fsrOne ? data.fsrOne : 0;
    sensor.fsrTwo = data.fsrTwo ? data.fsrTwo : 0;

    const threshold = 64;

    if (Math.abs(sensor.accX - data.accX) > threshold) {
      sensor.accX = data.accX;
    }
    if (Math.abs(sensor.accY - data.accY) > threshold) {
      sensor.accY = data.accY;
    }

    if (Math.abs(sensor.accZ - data.accZ) > threshold) {
      sensor.accZ = data.accZ - 1000;
    }

    sensor.counter++;

    redraw();


    // debugger;
    // console.log('fsrOne:', fsrOne);
    // console.log("fsrTwo:", fsrTwo);
    // console.log({ accX });
    // console.log({ accY });
    // console.log({ accZ });

    sensor.lastDataTimestamp = new Date().valueOf();

  });
};


var setup = function () {

  createCanvas(windowWidth, windowHeight); // window.innerWidth
  background(0); // black background; could also use RGB: background(0, 0, 0);

  colorMode(HSB, 255); // Use Hue Saturation Brightness, with a range of 0-255 for each

  // noStroke(); // Don't draw a border on shapes
  frameRate(10);
  noLoop();
  
  noStroke();

  drawPointer = { x: width/2,  y: height/2 };

  // initSocket();
  initOSC();
  

};

var draw = function () {
  
  background(0); // clears screen

  var accZScaled = (sensor.accZ / windowHeight) * 100;

    // to clear screen
    if (keyIsDown(RETURN)) {
        background(0); //
        circles = [];
    }

    // to stop current drawing
    // if (sensor.fsrOne === 0 && sensor.fsrTwo === 0) {
    //   circles = [];
    // }

    // to draw
    if (sensor.fsrOne > 0 || sensor.fsrTwo > 0) {
      
      // reset pointer if 2 seconds since last draw
      const currentTimestamp = new Date().valueOf();
      if( (currentTimestamp - sensor.lastDrawTimestamp) > 2000 ){
        drawPointer = { x: width / 2, y: height / 2 };
      }

      // move pointer based on accelerometer movement
      drawPointer.x += sensor.accX * controls.accMoveScale;
      // drawPointer.y += (sensor.accZ-1000) * controls.accMoveScale;
      drawPointer.y += sensor.accY * controls.accMoveScale;

      // wrapping!
      if(drawPointer.x > width){
        drawPointer.x = 0;
      }
      if(drawPointer.x < 0){
        drawPointer.x = width;
      }
      if(drawPointer.y > height){
        drawPointer.y = 0;
      }
      if(drawPointer.y < 0){
        drawPointer.y = height;
      }

      circles[circleIndex] = {
        // size: accZScaled * 0.5,
        size: sensor.fsrOne * 100,
        // x: sensor.accX,
        // y: sensor.accY,
        x: drawPointer.x,  // circle is drawn at pointer position
        y: drawPointer.y,
        hue: sensor.counter % 255,
        bright: 255
      };
    
      // Increment index but WRAP, to keep array at fixed size
      // (i.e. will start overwriting circles at the start of the array
      // when the index reaches MAX_CIRCLES)
      circleIndex = (circleIndex + 1) % parseInt(controls.wormLength);
      
      circleCount++;

      sensor.lastDrawTimestamp = new Date().valueOf();
    } // sensor draw check

    for (let i = 0; i < Math.min(circleCount, controls.wormLength); i++) {
      var c = circles[i];


      fill(c.hue, 155, c.bright, 127);
      ellipse(c.x, c.y, c.size, c.size);

    } // for

   
};




