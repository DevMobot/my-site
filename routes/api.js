const router = require("express").Router();
const path = require("path");
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const ytas = require('youtube-audio-stream');

router.get('/getTracks',function(req, res) {
    res.json(req.session.tracks);
    //console.log(req.session.tracks); 
});
router.get('/ytstream', async (req, res) => {
    const vID = req.query.vID;
    if (!vID) return res.send("err, no vid id");
    ytas('https://www.youtube.com/watch?v='+vID).pipe(res);
})
router.get('/ytp', async (req, res) => {
    try {
        const playlistURL = req.query.playlistURL;
        const playlistID = new URL(playlistURL).searchParams.get("list")
        if (!playlistID) return res.send("Error. No list ID found...");

        const data = await yts({ listId: playlistID })

        const playlist_title = data.title;
        const playlist_vid_count = data.videos.length;
        const videos = data.videos;

        res.cookie("playlistURL", playlistURL);
        res.cookie("playlist_vid_count", playlist_vid_count);
        res.cookie("playlist_title", playlist_title);

        req.session.tracks = [];

        videos.forEach(v => {
            req.session.tracks.push({ title: v.title, videoId: v.videoId });
        })

        console.log(playlistID);
        res.send("k")
    } catch (e) {
        //console.log(e);
        res.send("Err\n"+e);
    }
    
})
module.exports = router;