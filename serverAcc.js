
// Require the serialport node module
var SerialPort = require('serialport');
var createInterface = require("readline").createInterface;

var serialPort = new SerialPort("/dev/cu.usbmodem14621", { baudRate: 115200 });
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


        var re1 = '.*?';	// Non-greedy match on filler
        var re2 = '(\\d+)';	// Integer Number 1
        var re3 = '.*?';	// Non-greedy match on filler
        var re4 = '(\\d+)';	// Integer Number 2
        var re5 = '.*?';	// Non-greedy match on filler
        var re6 = '(\\d+)';	// Integer Number 3

        var p = new RegExp(re1 + re2 + re3 + re4 + re5 + re6, ["i"]);
        var m = p.exec(line);
        if (m != null) {
            var int1 = m[1];
            var int2 = m[2];
            var int3 = m[3];
        };
            var sensor = {
                x: parseFloat(int1),
                y: parseFloat(int2),
                z: parseFloat(int3)
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