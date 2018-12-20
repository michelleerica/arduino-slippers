const WEBSOCKETS_PORT = 8081;


var osc = require("osc"),
    express = require("express"),
    websocket = require("ws"),
    fs = require("fs"),
    argv = require('minimist')(process.argv.slice(2));


var SerialPort = require('serialport');
var createInterface = require("readline").createInterface;

// Assume the first /dev/cu.usbmodem device file is the Arduino
var files = fs.readdirSync("/dev").filter(fn => fn.startsWith("cu.usbmodem"));
var deviceFilename = '/dev/' + files[0];


var serialPort = new SerialPort(deviceFilename, { baudRate: 115200 });
var lineReader = createInterface({ input: serialPort });


var getIPAddresses = function() {
  var os = require("os"),
    interfaces = os.networkInterfaces(),
    ipAddresses = [];

  for (var deviceName in interfaces) {
    var addresses = interfaces[deviceName];
    for (var i = 0; i < addresses.length; i++) {
      var addressInfo = addresses[i];
      if (addressInfo.family === "IPv4" && !addressInfo.internal) {
        ipAddresses.push(addressInfo.address);
      }
    }
  }

  return ipAddresses;
};

var udpPort = new osc.UDPPort({
    // OSC RECEIVE (listening) port:
    localAddress: "0.0.0.0",
    localPort: argv._[1] || 7110, // || process.argv[2]

    // TODO: remove this?
    // OSC SEND (ie forwarding from the browser back to OSC) port:
    remoteAddress: "127.0.0.1",
    remotePort: 5555 // process.argv[3] ||
});

udpPort.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
    console.log(`Listening for WebSockets connections at http://localhost:${WEBSOCKETS_PORT}/`);

});

udpPort.open();

// Create an Express-based Web Socket server to which OSC messages will be relayed.
var appResources = __dirname + "/web",
    app = express(),
    server = app.listen(WEBSOCKETS_PORT),
    wss = new websocket.Server({
        server: server
    });

app.use("/", express.static(appResources));

wss.on("connection", function (socket) {
    console.log("A Web Socket connection has been established.");
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    // This relay forwards all OSC messages received on the OSC listening
    // port (7110) to the browser via the websockets port (8081)
    var relay = new osc.Relay(udpPort, socketPort, {
        raw: true
    });

        // convert data from Arduino (structured as a string) into an object
    // lineReader.on('line', function (line) {
    //     console.log(`line: ${line}`);
    //     var ar = line.split(";");
    //     var sensor = {
    //         fsrOne: parseFloat(ar[0]),
    //         fsrTwo: parseFloat(ar[1]),
    //         accX: parseFloat(ar[2]),
    //         accY: parseFloat(ar[3]),
    //         accZ: parseFloat(ar[4])
    //     };
    //     // console.log(sensor);
    //     var ret = io.emit('sensor', sensor);  // send to browser!
    // });
        // convert data from Arduino (structured as a string) into an object
    // lineReader.on('line', function (line) {
    //     console.log(`line: ${line}`);
    //     var ar = line.split(";");
    //     var sensor = {
    //         fsrOne: parseFloat(ar[0]),
    //         fsrTwo: parseFloat(ar[1]),
    //         accX: parseFloat(ar[2]),
    //         accY: parseFloat(ar[3]),
    //         accZ: parseFloat(ar[4])
    //     };
    //     // console.log(sensor);
    //     var ret = io.emit('sensor', sensor);  // send to browser!
    // });

    // convert data from Arduino(structured as a string) into an object
    lineReader.on('line', function (line) {
        // console.log(`line: ${line}`);
        var ar = line.split(";");
       
        // console.log(ar);

        socketPort.send({
            address: "/shoe",
            args: [
                { type: 'f', value: parseFloat(ar[0]) },
                { type: 'f', value: parseFloat(ar[1]) },
                { type: 'i', value: parseInt(ar[2]) },
                { type: 'i', value: parseInt(ar[3]) },
                { type: 'i', value: parseInt(ar[4]) },
            ]
        });

    });


    // setInterval(() => {
    //     console.log('sending!');
    //     socketPort.send({
    //         address: "/carrier/frequency",
    //         args: [
    //         {
    //             type: "f",
    //             value: 440
    //         }
    //         ]
    //     });
    // }, 1000);

    socketPort.on("error", function () {
        // Need to do something, anything here to prevent error from killing this process
        // Seems to be more important to close relay here - don't seem to need the 'close' event handler??
        relay.close();
        console.log('Closed WebSocket relay due to socket disconnect!');
    });

});
// // listen for websocket connections from the browser
// io.on('connection', function (socket) {
//     console.log('a user connected');
     
    // convert data from Arduino (structured as a string) into an object
    // lineReader.on('line', function (line) {
    //     console.log(`line: ${line}`);
    //     var ar = line.split(";");
    //     var sensor = {
    //         fsrOne: parseFloat(ar[0]),
    //         fsrTwo: parseFloat(ar[1]),
    //         accX: parseFloat(ar[2]),
    //         accY: parseFloat(ar[3]),
    //         accZ: parseFloat(ar[4])
    //     };
    //     // console.log(sensor);
    //     var ret = io.emit('sensor', sensor);  // send to browser!
    // });

    // });
    

// for debugging without a listening browser page
// lineReader.on('line', function (line) {
//     console.log(line);
//     io.emit('sensor', { value: line });
// });

