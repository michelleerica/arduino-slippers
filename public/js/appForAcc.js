//Code for visualisation of accelerometer data.
// Currently not working most likely due to hardware issue (data received is inconsistent with physical positioning)

var setup = function() {
  createCanvas(windowWidth, windowHeight); 
  background(255); 
//   frameRate(10);
};

var accX = 0.00;
var accY = 0.00;
var accZ = 0.00;
var socket = io();
socket.on('sensor', function (data) {
    console.log('working?')
    console.log('sensor data', data);
    accX = data.x ? data.x : 0;
    accY = data.y ? data.y : 0;
    accZ = data.z ? data.z : 0;

    console.log({accX});
    console.log({accY});
    console.log({accZ});

});

let circles = [];
let velocityScale = 1;

// test draw a circle
function draw() {

    // debugger;
    var circle = {
        velocityX: random(-10, 10),
        velocityY: random(-10, 10),
        x: accX,
        y: accY,
        hue: hue,
        bright: 255
    };

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
        

} //draw
draw();