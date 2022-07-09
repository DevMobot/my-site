const router = require("express").Router();
const path = require("path");
const fs = require('fs');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const dl_path_mp4 = "../resources/videos/";

// THIS IS /YTDL/ HANDLER

router.get('/',async function (req, res) {

    if (!req.query.search) return res.sendFile(path.join(__dirname, "..", "pages/ytdl.html"))

    const search = req.query.search;
    
    const getVid = await yts.search(search).then(async results => {

        const videoURL = results.videos[0].url;
        const title = results.videos[0].title.replace(/[^\w\s]/gi, '').split(/ +/).join("_");

        res.setHeader('Content-disposition', 'attachment; filename='+title+'.mp4');

        const stream = await ytdl(videoURL).pipe(res);

    }).catch(e => {
        console.log("Could not download the video... \nError: " + e.message);
        return;
    });
});

module.exports = router;