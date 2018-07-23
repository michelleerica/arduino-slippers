
// Require the serialport node module
var SerialPort = require('serialport');
var createInterface = require("readline").createInterface;

var serialPort = new SerialPort("/dev/cu.usbmodem14521", { baudRate: 115200 });
var lineReader = createInterface({ input: serialPort });


var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/socket.html');
});

// Serves resources from public folder
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));

// listen for websocket connections from the browser
io.on('connection', function (socket) {
    console.log('a user connected');
    
    // convert data from Arduino (structured as a string) into an object
    lineReader.on('line', function (line) {
        console.log(`line: ${line}`);
        var ar = line.split(";");
        var sensor = {
            fsrOne: parseFloat(ar[0]),
            fsrTwo: parseFloat(ar[1]),
            accX: parseFloat(ar[2]),
            accY: parseFloat(ar[3]),
            accZ: parseFloat(ar[4])
        };
        console.log(sensor);
        io.emit('sensor', sensor);  // send to browser!
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