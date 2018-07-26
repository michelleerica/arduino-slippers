

let circles = [];
let velocityScale = 1

let sensor = {
  speed: 0,
  debug: 'hi',
  accX: 0.0,
  accY: 0.0,
  accZ: 0.0,
  fsrOne: 0.5,
  fsrTwo: 0.5,
};

window.onload = () => {

  const gui = new dat.GUI();
  gui.add(sensor, "accX").listen();
  gui.add(sensor, "accY").listen();
  gui.add(sensor, "accZ").listen();
  gui.add(sensor, "fsrOne", 0.0, 1.0).listen();
  gui.add(sensor, "fsrTwo", 0.0, 1.0).listen();


};

var setup = function () {

    createCanvas(windowWidth, windowHeight); // window.innerWidth
    background(0); // black background; could also use RGB: background(0, 0, 0);

    colorMode(HSB, 255); // Use Hue Saturation Brightness, with a range of 0-255 for each

    noStroke(); // Don't draw a border on shapes
    frameRate(10);


};

// var fsrOne = 0.00;
// var fsrTwo = 0.00;
// var accX = 0.00;
// var accY = 0.00;
// var accZ = 0.00;
var socket = io();
socket.on('sensor', function (data) {
    // console.log('sensor data', data);
    sensor.fsrOne = data.fsrOne ? data.fsrOne : 0;
    sensor.fsrTwo = data.fsrTwo ? data.fsrTwo : 0;
    sensor.accX = data.accX ? data.accX : 0;
    sensor.accY = data.accY ? data.accY : 0;
    sensor.accZ = data.accZ ? data.accZ : 0;
    // debugger;
    // console.log('fsrOne:', fsrOne);
    // console.log("fsrTwo:", fsrTwo);
    // console.log({ accX });
    // console.log({ accY });
    // console.log({ accZ });

});

var draw = function () {
  
  background(0);
  
  // FSR gives us 0-1 values, so need to multiple to be useful
  var x = sensor.fsrOne * 1000;
  var y = sensor.fsrTwo * 1000;

  sensor.accZ = (sensor.accZ / windowHeight) * 100;

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
        velocityX: sensor.accX,
        velocityY: sensor.accY, 
        size: sensor.accZ,
        x: sensor.fsrOne, 
        y: sensor.fsrTwo, 
        hue: hue, 
        bright: 255 
      };

      circles.push(circle);


    } // if statement

    for (let i = 0; i < circles.length; i++) {
      var c = circles[i];
      // console.log('BEFORE:', c.velocityX, c.x, c.y)
      c.x += (c.velocityX * velocityScale);
      c.y += (c.velocityY * velocityScale);
      // console.log("AFTER:", c.velocityX, c.x, c.y);

      if (c.x >= windowWidth || c.x <= 0) {
        c.velocityX *= -1;
      }
      if (c.y >= windowHeight || c.y <= 0) {
        c.velocityY *= -1;
      }

      fill(c.hue, 155, c.bright);

      // if (sensor.accZ > 0) {
        // debugger;
        // console.log(c.x, c.y, sensor.accZ, sensor.accZ);
        ellipse(c.x, c.y, c.size, c.size);
      // } else {
      
      //   ellipse(c.x, c.y, random(80), random(80));
      // }
    } // for

   
};




