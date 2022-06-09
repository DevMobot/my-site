const router = require("express").Router();
const path = require("path");
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const ytas = require('youtube-audio-stream');
const deleteFile = require('../deleteFile.js');
const fs = require('fs');
const host = "localhost:3000";

router.get('/getTracks',function(req, res) {
    res.send(req.session.tracks);
    //console.log(req.session.tracks)
});
router.get('/ytstream', async (req, res) => {
	
    const vID = req.query.vID;
    
    let trackIndex = req.session.track_index;
    
    if (!vID) return res.send("err, no vid id");
    
    let audioFile = `/resources/audios/cache/${vID}.mp3`;
        
    if (fs.existsSync(path.join(__dirname, "..", audioFile))) {
    	
    	res.sendFile(path.join(__dirname, "..", `/resources/audios/cache/${vID}.mp3`));
    	
    	let nextTrackVID = req.session.tracks[trackIndex+1].videoId;
    	
    	ytdl('https://www.youtube.com/watch?v='+nextTrackVID).pipe(fs.createWriteStream(path.join(__dirname, "..", '/resources/audios/cache/'+nextTrackVID+'.mp3')));
    	
    	req.session.track_index = req.session.track_index+1;
    	
    } else {
    	//console.log('h')
    	ytas('https://www.youtube.com/watch?v='+vID).pipe(res);
    	let nextTrackVID = req.session.tracks[trackIndex+1].videoId;
    	ytdl('https://www.youtube.com/watch?v='+nextTrackVID).pipe(fs.createWriteStream(path.join(__dirname, "..", '/resources/audios/cache/'+nextTrackVID+'.mp3')));
    	
    	req.session.track_index = req.session.track_index+1;
    	
    }
    //ytas('https://www.youtube.com/watch?v='+vID).pipe(res);
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

        //res.cookie("playlist_vid_count", playlist_vid_count);
		req.session.track_index = 0;
        req.session.tracks = [];

        videos.forEach(async v => {
            req.session.tracks.push({ 
                title: v.title.replace(/[^\w\s]/gi, '').split(/ +/).join("_"),
                path: `http://${host}/api/ytstream?vID=${v.videoId}`,
                artist: `${v.author.name}`,
                image: `${v.thumbnail}`,
                videoId: `${v.videoId}`
            });
        })

        //console.log(videos);
        //console.log(playlistID);
        res.redirect('http://'+host+'/player');

    } catch (e) {
        //console.log(e);
        res.send("Err\n"+e);
    }
    
})

module.exports = router;