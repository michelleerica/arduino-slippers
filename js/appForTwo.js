let circles = [];
let velocityScale = 1

var setup = function () {

    createCanvas(windowWidth, windowHeight); // window.innerWidth
    background(0); // black background; could also use RGB: background(0, 0, 0);

    colorMode(HSB, 255); // Use Hue Saturation Brightness, with a range of 0-255 for each

    noStroke(); // Don't draw a border on shapes
    frameRate(10);


};

var firstSensor = 0.00;
var secondSensor = 0.00;
var socket = io();
socket.on('sensor', function (data) {
    console.log('sensor data', data);
    firstSensor = data.firstSensor ? data.firstSensor : 0;
    secondSensor = data.secondSensor ? data.secondSensor : 0;
    // debugger;
    console.log('firstSensor:', firstSensor);
    console.log("secondSensor:", secondSensor);
    
});

var draw = function () {
    // var m = sensor1 * 1000;

    var x = firstSensor * 1000;
    var y = secondSensor * 1000;

    var hue = map(y, 0, windowWidth, 0, 255);

    // to clear screen
    if (keyIsDown(RETURN)) {
        background(0); //
        circles = [];
    }

    // to stop current drawing
    if (x === 0) {
        circles = [];
    }

    // to draw
    if (x > 0 || y > 0) {
        // var hue = map(mouseX, 0, windowWidth, 0, 255)
        var circle = {
            velocityX: random(-10, 10),
            velocityY: random(-10, 10),
            x: x,
            y: y,
            hue: hue,
            bright: 255
        };

        circles.push(circle)
        // } // keypress

        for (let i = 0; i < circles.length; i++) {
            var c = circles[i]

            c.x += c.velocityX * velocityScale
            c.y += c.velocityY * velocityScale

            if (c.x >= windowWidth || c.x <= 0) {
                c.velocityX *= -1
            }
            if (c.y >= windowHeight || c.y <= 0) {
                c.velocityY *= -1
            }

            fill(c.hue, 155, c.bright)
            ellipse(c.x, c.y, random(80), random(80))

        } // if statement
    }

}




