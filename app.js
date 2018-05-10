
// Require the serialport node module
var SerialPort = require('serialport');

var serialPort = new SerialPort("/dev/cu.usbmodem1411", {
    baudRate: 9600,
    parser: SerialPort.parsers.Readline
});

 // Open the port
serialPort.on("open", function () {
    console.log('open');
    serialPort.on('data', function (data) {
        console.log(data.toString());
    
    });
});