const express = require('express'); 
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const config = require("./config.js");
const app = express();
const port = process.env.PORT || 80; // GET PORT TO LISTEN ON
module.exports.port = port;

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
    saveUninitialized: false
}));

app.use("/", HomeRouter); // HOME ROUTES
app.use("/api", ApiRouter); // API ROUTER
app.use("/ytdl", YtdlRouter); // YTDL ROUTER
app.use("/d", dRouter);

app.use((req, res, next) => { // 404
    res.status(404).sendFile(path.join(__dirname, "/pages/404.html"));
})
// LISTENING FOR REQUESTS
var listener = app.listen(port, () => {
    console.log(`READY! Listening on port ${port}`);
    config.set("port", listener.address().port);
    config.set("host", `http://localhost:${listener.address().port}`)
})
