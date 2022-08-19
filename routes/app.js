const router = require("express").Router();
const path = require("path");
const fs = require('fs');

let host = require("../server.js").host;

router.get("/", (req, res) => {
    res.send("ok");
}).get("/main", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "App/Main.json"));
})

module.exports = router;