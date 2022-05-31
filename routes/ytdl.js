const router = require("express").Router();
const path = require("path");
const fs = require('fs');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

router.get('/',async function (req, res) {
    const search = req.query.search;
    const quality = req.query.quality || "highest";
    const format = req.query.format || "mp4";
    console.log(search)
    const getVid = await yts.search(search).then(async results => {

        const videoURL = results.videos[0].url;
        const title = results.videos[0].title.replace(/[^\w\s]/gi, '').split(/ +/).join("_");

        res.setHeader('Content-disposition', 'attachment; filename='+title+'.mp4');

        const stream = await ytdl(videoURL,  {
            highWaterMark: 33554432,
            quality: quality
        }).pipe(res);

    }).catch(e => {
        console.log("Could not download the video... \nError: " + e.message);
        return;
    });
});

module.exports = router;