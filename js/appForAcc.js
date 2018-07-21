//Code for visualisation of accelerometer data.
// Currently not working most likely due to hardware issue (data received is inconsistent with physical positioning)

var setup = function() {
  createCanvas(windowWidth, windowHeight); // window.innerWidth
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


function draw() {
    var positionX = [];
    var positionY = [];
    var positionZ = [];

    positionX.push(accX);
    positionY.push(accY);

    stroke(0);
    // debugger;
    if (positionX.length >= 1) {
        for (let i = 0; i < positionX; i++) {
            console.log(positionX[i]);
            // const x = positionX[i];
            // const y = positionY[i];
            // const z = positionZ[i];
            console.log({positionX});

            line(i, i, i+1, i+1)        
        }
    }



}
