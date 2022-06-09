const router = require("express").Router();
const path = require("path");
const fs = require("fs");

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
    res.redirect("/");
})

module.exports = router;