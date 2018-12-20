var osc = require("osc"),
  express = require("express"),
  websocket = require("ws"),
  readline = require("readline"),
  argv = require('minimist')(process.argv.slice(2));
  Leap = require("leapjs");

const SONICPI = argv.s || false;
// const BROWSER = argv.b || false;
const USE_OSC_BUNDLES = !SONICPI;
const OSC_REMOTE_HOST = "0.0.0.0";
const OSC_REMOTE_PORT = argv._[0] || (SONICPI ? "4559" : "4567");
const WEBSOCKETS_PORT = 8081;
const WEBSOCKETS_TO_OSC_SEND_PORT = argv.osc || 4559;

// if(SONICPI) OSC_REMOTE_PORT= 4559;

const EVERY_N_FRAMES = argv.f || 1;
if(argv.leap){
  console.log('Sending every ' + EVERY_N_FRAMES + ' frames.');
  // console.log(argv);
}

var getIPAddresses = function () {
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

// for catching keypresses
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  // if (key.ctrl && key.name === 'c') {
  //   process.exit();
  // } else {
  //
  // }

  // if(key.name === 'd') {
  //   argv.D = !argv.D;
  // } else {
  process.exit();
  // TODO: close all open ports neatly!
  // }
});


// // Sonic Pi forwarding port
// var piPort = new osc.UDPPort({
//     // OSC RECEIVE (listening) port:
//     localAddress: "0.0.0.0",
//     localPort:  9999, //argv._[1] || 57121, // || process.argv[2]

//     // OSC SEND (forwarding) port:
//     remoteAddress: "127.0.0.1",
//     remotePort: 4559 //7500 // process.argv[3] ||
// });
// piPort.open();


// Bind to a UDP socket to listen for incoming OSC events.
var udpPort = new osc.UDPPort({
    // OSC RECEIVE (listening) port:
    localAddress: "0.0.0.0",
    localPort:  argv._[1] || 57121, // || process.argv[2]

    // OSC SEND (forwarding) port:
    remoteAddress: "127.0.0.1",
  remotePort: WEBSOCKETS_TO_OSC_SEND_PORT // process.argv[3] ||
});

udpPort.on("ready", function () {
  var ipAddresses = getIPAddresses();
  console.log("Listening for OSC over UDP.");
  ipAddresses.forEach(function (address) {
      console.log(" Host:", address + ", Port:", udpPort.options.localPort);
  });
  console.log(`Listening for WebSockets connections at http://localhost:${WEBSOCKETS_PORT}/`);

  if(argv.leap){
    console.log(`Leap OSC sending to http://${OSC_REMOTE_HOST}:${OSC_REMOTE_PORT}/`);
    startLeap();
  }

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

    
    socketPort.on("error", function () {
      // Need to do something, anything here to prevent error from killing this process
      // Seems to be more important to close relay here - don't seem to need the 'close' event handler??
      relay.close();
      console.log('Closed WebSocket relay due to socket disconnect!');
    });

});

