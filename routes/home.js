const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const clear_cache = require("../clear_cache.js");

const host = require("../server.js").host;

router.get('/',function(req,res) {
    res.sendFile(path.join(__dirname, "..", "pages/home.html"));
});
router.get('/player', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "pages/player.html"));
})
router.get('/stt', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "pages/stt.html"));
})
router.get("/exit_player", (req, res) => {
    req.session.track_index = 0;
    req.session.tracks = [];
    clear_cache();
    res.redirect("/");
})

module.exports = router;