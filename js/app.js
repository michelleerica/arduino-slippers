let circles = [];
let velocityScale = 1

var setup = function () {

    createCanvas(windowWidth, windowHeight); // window.innerWidth
    background(0); // black background; could also use RGB: background(0, 0, 0);

    colorMode(HSB, 255); // Use Hue Saturation Brightness, with a range of 0-255 for each

    noStroke(); // Don't draw a border on shapes
    frameRate(10);


};

var fsrOne = 0.00;
var fsrTwo = 0.00;
var socket = io();
socket.on('sensor', function (data) {
    console.log('sensor data', data);
    fsrOne = data.fsrOne ? data.fsrOne : 0;
    fsrTwo = data.fsrTwo ? data.fsrTwo : 0;
    accX = data.accX ? data.accX : 0;
    accY = data.accY ? data.accY : 0;
    accZ = data.accZ ? data.accZ : 0;
    // debugger;
    console.log('fsrOne:', fsrOne);
    console.log("fsrTwo:", fsrTwo);
    console.log({ accX });
    console.log({ accY });
    console.log({ accZ });

});

var draw = function () {

    var hue = map(255, 0, windowWidth, 0, 255);

    // to clear screen
    if (keyIsDown(RETURN)) {
        background(0); //
        circles = [];
    }

    // to stop current drawing
    if (fsrOne === 0 && fsrTwo === 0) {
      circles = [];
    }

    // to draw
    if (fsrOne > 0 || fsrTwo > 0) {
      // var hue = map(mouseX, 0, windowWidth, 0, 255)
      var circle = { 
        velocityX: accX,
         velocityY: accY, 
        x: fsrOne, 
          y: fsrTwo, 
         hue: hue, 
         bright: 255 };

      circles.push(circle);
      // } // keypress

      for (let i = 0; i < circles.length; i++) {
        var c = circles[i];

        c.x += c.velocityX * velocityScale;
        c.y += c.velocityY * velocityScale;

        if (c.x >= windowWidth || c.x <= 0) {
          c.velocityX *= -1;
        }
        if (c.y >= windowHeight || c.y <= 0) {
          c.velocityY *= -1;
        }

        fill(c.hue, 155, c.bright);
        ellipse(c.x, c.y, random(80), random(80));
      }
    } // if statement
};




