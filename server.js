
// Require the serialport node module
var SerialPort = require('serialport');
var createInterface = require("readline").createInterface;

var serialPort = new SerialPort("/dev/cu.usbmodem1451", { baudRate: 9600 });
var lineReader = createInterface({ input: serialPort });


var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")(http);


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/socket.html');
});

// listen for websocket connections from the browser
io.on('connection', function (socket) {
    console.log('a user connected');
    
    lineReader.on('line', function (line) {
        console.log(line);
        io.emit('sensor', line);  // send to browser!
    });
    
});

// for debugging without a listening browser page
// lineReader.on('line', function (line) {
//     console.log(line);
//     io.emit('sensor', { value: line });
// });



http.listen(3000, function () {
    console.log('listening on *:3000');
});