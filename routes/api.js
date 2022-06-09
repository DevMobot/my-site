const router = require("express").Router();
const path = require("path");
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const ytas = require('youtube-audio-stream');
const deleteFile = require('../deleteFile.js');
const fs = require('fs');

const config = require("../config.js");
const host = config.get("host"); 

router.get('/getTracks',function(req, res) {
    res.send(req.session.tracks);
    //console.log(req.session.tracks)
});
router.get('/trackindexsave', (req, res) => {
    let index = req.query.ti;
    req.session.track_index = parseInt(index);
    res.send("k")
})
router.get("/seeking", (req, res) => {
    //console.log(req.session.disableSeeking);
    if (req.session.disableSeeking) res.send("yes");
    else res.send("no");
})
router.get('/ytstream', async (req, res) => {
	
    const vID = req.query.vID;
    
    let trackIndex = req.session.track_index;
    
    if (!vID) return res.send("err, no vid id");
    
    let audioFile = `/resources/audios/cache/${vID}.mp3`;
        
    if (fs.existsSync(path.join(__dirname, "..", audioFile))) {
    	
    	res.sendFile(path.join(__dirname, "..", `/resources/audios/cache/${vID}.mp3`));
    	
    	let nextTrackVID = req.session.tracks[trackIndex+1].videoId;

    	if (!fs.existsSync(path.join(__dirname, "..", `/resources/audios/cache/${nextTrackVID}.mp3`)) && !req.session.noSeek) {
            ytdl('https://www.youtube.com/watch?v='+nextTrackVID).pipe(fs.createWriteStream(path.join(__dirname, "..", '/resources/audios/cache/'+nextTrackVID+'.mp3')));
        }
    	
    } else {
    	//console.log('h')
    	ytas('https://www.youtube.com/watch?v='+vID).pipe(res);

    	let nextTrackVID = req.session.tracks[trackIndex+1].videoId;
    	if (!fs.existsSync(path.join(__dirname, "..", `/resources/audios/cache/${nextTrackVID}.mp3`)) && !req.session.noSeek) {
            ytdl('https://www.youtube.com/watch?v='+nextTrackVID).pipe(fs.createWriteStream(path.join(__dirname, "..", '/resources/audios/cache/'+nextTrackVID+'.mp3')));
        }
    }
    //ytas('https://www.youtube.com/watch?v='+vID).pipe(res);
})
router.get('/ytp', async (req, res) => {
    try {
        const playlistURL = req.query.playlistURL;
        const disableSeeking = req.query.disableSeeking;

        const playlistID = new URL(playlistURL).searchParams.get("list")
        if (!playlistID) return res.send("Error. No list ID found...");

        const data = await yts({ listId: playlistID })

        if (disableSeeking === "true") {
            res.cookie("noSeek", "yes");
            req.session.noSeek = true;
        }
        //console.log(disableSeeking + " -api.js 67");

        const playlist_title = data.title;
        const playlist_vid_count = data.videos.length;
        const videos = data.videos;

        //res.cookie("playlist_vid_count", playlist_vid_count);

		req.session.track_index = 0;
        req.session.tracks = [];

        videos.forEach(async v => {
            let t = v.title.replace(/[^\w\s]/gi, '').split(/ +/).join("_");
            if (t.length > 30) t.substring(0, 30);
            req.session.tracks.push({ 
                title: t,
                path: `http://${host}/api/ytstream?vID=${v.videoId}`,
                artist: `${v.author.name}`,
                image: `${v.thumbnail}`,
                videoId: `${v.videoId}`
            });
        })

        res.redirect('http://'+host+'/player');

    } catch (e) {
        //console.log(e);
        res.send("Err\n"+e);
    }
    
})

module.exports = router;