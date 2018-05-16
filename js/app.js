let circles = [];
let velocityScale = 1

var setup = function () {

    createCanvas(windowWidth, windowHeight); // window.innerWidth
    background(0); // black background; could also use RGB: background(0, 0, 0);

    colorMode(HSB, 255); // Use Hue Saturation Brightness, with a range of 0-255 for each

    noStroke(); // Don't draw a border on shapes
    frameRate(30);


};

var sensor = 0.0;
var socket = io();
socket.on('sensor', function(data){
    // console.log('sensor data', data);
    sensor = data;

});

// let circles = [];
// let velocityScale = 1

// var setup = function () {

//     createCanvas(windowWidth, windowHeight); // window.innerWidth
//     background(0); // black background; could also use RGB: background(0, 0, 0);

//     colorMode(HSB, 255); // Use Hue Saturation Brightness, with a range of 0-255 for each

//     noStroke(); // Don't draw a border on shapes

// };


var draw = function () {
    var m = sensor * 1000;

    var hue = map(m, 0, windowWidth, 0, 255);

    console.log(hue);
    
    // ellipse(windowWidth / 2, windowHeight / 2, m );
    // console.log(`sensor draw: ${sensor*100000}`);
    // var xPosition = sensor *  random(0, windowWidth );
    // var yPosition = sensor * random(0, windowHeight);
    // // console.log(xPosition, yPosition)
    // // console.log('m:', m)
    // // ellipse(xPosition, yPosition, m );
    // ellipse(sensor*windowWidth, windowHeight/2, m)
    // fill(hue, 100, 255);

    // console.log(m);
    
    if (keyIsDown(RETURN)){
    background(0); //
    }

    if (m === 0) {
        circles = [];

    }


    if (m > 0) {
        // var hue = map(mouseX, 0, windowWidth, 0, 255)
        var circle = {
            velocityX: random(-10, 10),
            velocityY: random(-10, 10),
            x: m,
            y: m,
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

        // c.bright--
        fill(c.hue, 155, c.bright)
        ellipse(c.x, c.y, random(80), random(80))
        // text('p5 is cool', c.x, c.y)

        } // Fourth Example
    }
            
}




