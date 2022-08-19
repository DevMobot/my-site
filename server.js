const express = require('express'); 
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const os = require("os");
const WebSocketServer = require('websocket').server;

// SERVER 
const app = express();

var port = process.env.PORT || 80; // PORT 

if (!process.env.PORT && os.platform() == "android") port = 3000; 
module.exports.port = port;
module.exports.host = "mann-mohit.herokuapp.com";


app.use(express.static(__dirname + '/resources/')); // ROOT TO ACCESS FILES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: "mann-mohit-cyberaxy-mobot",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false
    }
}));

// INCLUDE ROUTERS 
const HomeRouter = require("./routes/home.js"); 
const ApiRouter = require("./routes/api.js");
const YtdlRouter = require("./routes/ytdl.js");

app.use("/", HomeRouter);
app.use("/api", ApiRouter);
app.use("/ytdl", YtdlRouter);


// 404 PAGE 
app.use((req, res, next) => { // 404
    res.status(404).sendFile(path.join(__dirname, "/pages/404.html"));
})

// SERVER START
var listener = app.listen(port, () => {
    console.log(`Ready! Listening on port ${port}`);
})

//----------------------------------------------------------------------------------
// GENERATE REQUIRED FOLDERS

if (!fs.existsSync(path.join(__dirname, "/resources/audios"))) fs.mkdirSync(path.join(__dirname, "/resources/audios"));
if (!fs.existsSync(path.join(__dirname, "/resources/audios/cache"))) fs.mkdirSync(path.join(__dirname, "/resources/audios/cache"));

//----------------------------------------------------------------------------------
// CREATE WEBSOCKET 

const wsServer = new WebSocketServer({
    httpServer: app,
    autoAcceptConnections: false
})
function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

//----------------------------------------------------------------------------------------