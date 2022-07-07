const router = require("express").Router();
const path = require("path");
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const ytas = require('youtube-audio-stream');
const deleteFile = require('../deleteFile.js');
const fs = require('fs');

const config = require("../config.js");
let host = require("../server.js").host;

router.get("/", (req, res) => {
    res.send("OK");
})
router.get("/log", (req, res) => {
    console.log(req.query.msg);
    res.send("k");
})
router.get('/getTracks', function(req, res) {
    const defTracks = [{
        name: "L's Ideology",
        artist: "DeathNote",
        path: "../audios/ls-ideology.mp3",
        image: "../images/art.png",
        videoId: "P2OA4mQ3mkc"
    }]
    if (!req.session.tracks) return res.send(defTracks);
    res.send(req.session.tracks || defTracks);
    //console.log(req.session.tracks)
});
router.get("/nextReady", function getSessionViaQuerystring (req, res, next) {
    var sessionId = req.query.session;
    if (!sessionId) return res.sendStatus(401); 
    req.cookies['connect.sid'] = req.query.session; // CHANGE SESSION
    next();
}, (req, res) => {
    if (req.session.nextReady || req.session.noSeek) return res.send("true");
    else return res.send("false");
});

router.get('/trackindexsave', function getSessionViaQuerystring (req, res, next) {
    var sessionId = req.query.session;
    if (!sessionId) return res.sendStatus(401); 
    req.cookies['connect.sid'] = req.query.session; // CHANGE SESSION
    next();
}, (req, res) => {
    let index = req.query.ti;
    req.session.track_index = parseInt(index);
    //console.log(index + " k32")
    res.send("k")
})
router.get("/getindex", function getSessionViaQuerystring (req, res, next) {
    var sessionId = req.query.session;
    if (!sessionId) return res.sendStatus(401); 
    req.cookies['connect.sid'] = req.query.session; // CHANGE SESSION
    next();
}, (req, res) => {
    res.send(req.session.track_index+"" || "0");
})
router.get("/seeking", (req, res) => {
    //console.log(req.session.disableSeeking);
    console.log(req.session.nextReady);
    console.log(req.session.noSeek);
    if (req.session.disableSeeking) res.send("yes");
    else res.send("no");
})

router.get('/ytstream', function getSessionViaQuerystring (req, res, next) {
    var sessionId = req.query.session;
    //console.log(sessionId);
    if (!sessionId) return res.sendStatus(401); // Or whatever
  
    // Trick the session middleware that you have the cookie;
    // Make sure you configure the cookie name, and set 'secure' to false
    // in https://github.com/expressjs/session#cookie-options
    req.cookies['connect.sid'] = req.query.session;
    //console.log("KKK -49 API.JS")
    next();
}, async (req, res) => {
    host = req.get('host');

    const vID = req.query.vID;
    
    let trackIndex = req.session.track_index;
    //console.log(req.session)
    
    if (!vID) return res.send("err, no vid id");
    
    let audioFile = `/resources/audios/cache/${vID}.mp3`;
        
    if (fs.existsSync(path.join(__dirname, "..", audioFile))) {
    	
    	res.sendFile(path.join(__dirname, "..", `/resources/audios/cache/${vID}.mp3`));
    	
    	if (req.session.tracks.length > trackIndex) {
            let nextTrackVID = req.session.tracks[trackIndex+1].videoId;    
            //console.log("KKK -68 API.JS")
            //console.log(nextTrackVID +" nti");
            //console.log(trackIndex+" ti");
            //console.log(!req.session.noSeek+" k");

    	    if (!fs.existsSync(path.join(__dirname, "..", `/resources/audios/cache/${nextTrackVID}.mp3`)) && !req.session.noSeek) {
                ytdl('https://www.youtube.com/watch?v='+nextTrackVID, {
                    quality: "highestaudio"
                }).pipe(fs.createWriteStream(path.join(__dirname, "..", '/resources/audios/cache/'+nextTrackVID+'.mp3'))).on('finish', () => {
                    return;
                })
                //console.log("KKK -72 API.JS")

            }
        }
    	
    } else {
    	//console.log('h')
    	ytas('https://www.youtube.com/watch?v='+vID).pipe(res);

        if (req.session.tracks.length > trackIndex) {
            let nextTrackVID = req.session.tracks[trackIndex+1].videoId;
    	    if (!fs.existsSync(path.join(__dirname, "..", `/resources/audios/cache/${nextTrackVID}.mp3`)) && !req.session.noSeek) {
                ytdl('https://www.youtube.com/watch?v='+nextTrackVID, {
                    quality: "highestaudio"
                }).pipe(fs.createWriteStream(path.join(__dirname, "..", '/resources/audios/cache/'+nextTrackVID+'.mp3'))).on("finish", () => {
                    return;
                });
                //console.log("KKK -92 API.JS")

            }
        }
    	
    }
    //ytas('https://www.youtube.com/watch?v='+vID).pipe(res);
})
router.get('/ytp', async (req, res) => {
    //host = config.get('host');
    host = req.get('host');

    try {
        const playlistURL = req.query.playlistURL;
        const disableSeeking = req.query.disableSeeking;

        const playlistID = new URL(playlistURL).searchParams.get("list")
        if (!playlistID) return res.send("Error. No list ID found...");

        const data = await yts({ listId: playlistID })

        //console.log(disableSeeking + " -api.js 67");

        const playlist_title = data.title;
        const playlist_vid_count = data.videos.length;
        const videos = data.videos;

        //res.cookie("playlist_vid_count", playlist_vid_count);

		req.session.track_index = 0;
        req.session.tracks = [];
        
        videos.forEach(async v => {
            let t = v.title.replace(/[^\w\s]/gi, '').split(/ +/).join(" ");
            if (t.length > 30) t.substring(0, 30);
            let p = `http://${host}/api/ytstream?vID=${v.videoId}&session=${req.sessionID}`;

            req.session.tracks.push({ 
                name: t,
                path: p,
                artist: `${v.author.name}`,
                image: `${v.thumbnail}`,
                videoId: `${v.videoId}`
            });
        })
        
        if (disableSeeking === "true") {
            res.cookie("noSeek", "yes");
            req.session.noSeek = true;
            res.redirect('http://'+host+'/player');
        }else {
            req.session.noSeek = false;
            ytdl(`https://www.youtube.com/watch?v=${videos[0].videoId}`, {
                quality: "highestaudio"
            }).pipe(fs.createWriteStream(path.join(__dirname, "..", '/resources/audios/cache/'+videos[0].videoId+'.mp3'))).on("finish", () => {
                res.redirect('http://'+host+'/player');
            });   
        } 
        //res.redirect('http://'+host+'/player');
        
    } catch (e) {
        //console.log(e);
        res.send("Err\n"+e);
    }
    
})

module.exports = router;