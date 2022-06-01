const express = require('express') 
const app = express()
const fs = require("fs")
const path = require("path")
const port = process.env.PORT || 3000; // GET PORT TO LISTEN ON
module.exports.port = port;

const HomeRouter = require("./routes/home.js"); // INCLUDE HOME ROUTER
const ApiRouter = require("./routes/api.js");
const YtdlRouter = require("./routes/ytdl.js");

app.use(express.static(__dirname + '/resources/')); // ROOT TO ACCESS FILES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", HomeRouter); // HOME ROUTES
app.use("/api", ApiRouter); // API ROUTER
app.use("/ytdl", YtdlRouter);

app.use((req, res, next) => { // 404
    res.status(404).sendFile(path.join(__dirname, "/pages/404.html"));
})
// LISTENING FOR REQUESTS
app.listen(port, () => {
    console.log(`READY! Listening on port ${port}`);
})
