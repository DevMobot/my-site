const router = require("express").Router();
const path = require("path");
const clear_cache = require("../clear_cache.js");

router.get('/',function(req,res) {
    res.sendFile(path.join(__dirname, "..", "pages/home.html"));
    if (!req.session.tracks) {
        req.session.tracks = [{
            name: "L's Ideology",
            artist: "DeathNote",
            path: "../audios/ls-ideology.mp3",
            image: "../images/art.png",
            videoId: "P2OA4mQ3mkc"
        }];
        req.session.track_index = 0;
    }
})
.get('/player',(req, res) => {
    if (!req.session.tracks) {
        req.session.tracks = [{
            name: "L's Ideology",
            artist: "DeathNote",
            path: "../audios/ls-ideology.mp3",
            image: "../images/art.png",
            videoId: "P2OA4mQ3mkc"
        }];
        req.session.track_index = 0;
    }
    if (req.query.index) {
        if (req.query.index > req.session.tracks.length || req.query.index < 1) return res.redirect("/player"); 
        req.session.track_index = parseInt(req.query.index)-1;
        res.redirect("/player");
        return;
    }
    res.sendFile(path.join(__dirname, "..", "pages/player.html"));
})
.get("/exit_player", (req, res) => {
    req.session.track_index = 0;
    req.session.tracks = [];
    res.sendFile(path.join(__dirname, "..", "pages/exit_player.html"));
})
.get("/list", (req, res) => {
    const listid = req.query.id;
    if (!listid) return res.send("ERROR NO ID");
    const listurl = encodeURI("https://youtube.com/playlist?list=" + listid);
    res.redirect("/api/ytp?playlistURL="+listurl+"&disableSeeking=false");
})
.get("/fcc", (req, res) => {
    clear_cache();
    res.redirect("/");
})
.get("/loading", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "pages/loading.html"));
})
.get("/k", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "pages/k.html"));
})

module.exports = router;