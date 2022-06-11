const express = require('express'); 
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const config = require("./config.js");

const app = express();

const port = process.env.PORT || 80; // GET PORT TO LISTEN ON
module.exports.port = port;
module.exports.host = "mann-mohit.herokuapp.com"//+port; //mann-mohit.herokuapp.com

const HomeRouter = require("./routes/home.js"); // INCLUDE HOME ROUTER
const ApiRouter = require("./routes/api.js");
const YtdlRouter = require("./routes/ytdl.js");
const dRouter = require("./routes/d.js");

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

app.use("/", HomeRouter); // HOME ROUTES
app.use("/api", ApiRouter); // API ROUTER
app.use("/ytdl", YtdlRouter); // YTDL ROUTER
app.use("/d", dRouter);

app.use((req, res, next) => { // 404
    res.status(404).sendFile(path.join(__dirname, "/pages/404.html"));
})

var listener = app.listen(port, () => {
    console.log(`READY! Listening on port ${port}`);
    config.set("port", listener.address().port);
    config.set("host", `localhost:${listener.address().port}`);
})

if (!fs.existsSync(path.join(__dirname, "/resources/audios"))) fs.mkdirSync(path.join(__dirname, "/resources/audios"));
if (!fs.existsSync(path.join(__dirname, "/resources/audios/cache"))) fs.mkdirSync(path.join(__dirname, "/resources/audios/cache"));

//-----------------------------------------------
