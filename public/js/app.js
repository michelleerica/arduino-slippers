

// CALIBRATION: 

// z pos: 
// x: -62 / -125 
// y: -62 / -125
// z: 1000 / 937 

let circles = [];
let velocityScale = 1;

// const averageSize = 3;
// let averageAcc = {
//   xVals: new Array(averageSize),
//   yVals: new Array(averageSize),
//   zVals: new Array(averageSize),
//   x: 0,
//   y: 0,
//   z: 0

// };
// console.log(averageAcc);

let sensor = {
  speed: 0,
  debug: 'hi',
  accX: 0.0,
  accY: 0.0,
  accZ: 0.0,
  fsrOne: 0.5,
  fsrTwo: 0.5,
  lastDataTimestamp: 0,
  counter: 0
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


};

const addToAverage = (averages, sensorData, frame) => {
  // add to array
  const i = frame % averageSize;  // wrap the index by the array length
  averages.xVals[i] = sensorData.accX;
  averages.yVals[i] = sensorData.accY;
  averages.zVals[i] = sensorData.accZ;
  // console.log(i, averages.zVals[i], averages, sensorData);
  sensor.debug = averages.zVals.toString()
  // calculate new averages
  var xt=0, yt=0, zt=0;
  for (let i = 0; i < averageSize; i++) {
    xt += averages.xVals[i];
    yt += averages.yVals[i];
    zt += averages.zVals[i];
  }
  averages.x = xt / averageSize;
  averages.y = yt / averageSize;
  averages.z = zt / averageSize;

  // console.log(averages.z)

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

  noStroke(); // Don't draw a border on shapes
  frameRate(10);
  noLoop();

  initSocket();

};

// var fsrOne = 0.00;
// var fsrTwo = 0.00;
// var accX = 0.00;
// var accY = 0.00;
// var accZ = 0.00;

var draw = function () {
  
  background(0);
  
  // FSR gives us 0-1 values, so need to multiple to be useful
  // var x = sensor.fsrOne * 1000;
  // var y = sensor.fsrTwo * 1000;

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
      var hue = map(255, 0, windowWidth, 0, 255)
      var circle = { 
        size: accZScaled,
        x: sensor.accX, 
        y: sensor.accY, 
        hue: hue, 
        bright: 255 
      };

      circles.push(circle);


    } // if statement

    for (let i = 0; i < circles.length; i++) {
      var c = circles[i];


      fill(c.hue, 155, c.bright);
      ellipse(c.x, c.y, c.size, c.size);

    } // for

   
};




