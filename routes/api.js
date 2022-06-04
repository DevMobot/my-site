const router = require("express").Router();
const path = require("path");
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const ytas = require('youtube-audio-stream');

router.get('/getTracks',function(req, res) {
    res.send(req.session.tracks);
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

        res.cookie("playlist_vid_count", playlist_vid_count);

        req.session.tracks = [];

        videos.forEach(async v => {
            req.session.tracks.push({ 
                title: v.title.replace(/[^\w\s]/gi, '').split(/ +/).join("_"),
                path: `http://localhost/api/ytstream?vID=${v.videoId}`,
                artist: `${v.author.name}`,
                image: `${v.thumbnail}`
            });
        })

        //console.log(videos);
        //console.log(playlistID);
        res.redirect('http://localhost/player');

    } catch (e) {
        //console.log(e);
        res.send("Err\n"+e);
    }
    
})
module.exports = router;