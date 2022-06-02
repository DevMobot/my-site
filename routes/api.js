const router = require("express").Router();
const path = require("path");

router.get('/',function(req, res) {
    res.send("k")
    console.log(req.query.search);
});

module.exports = router;