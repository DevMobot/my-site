const router = require("express").Router();
const path = require("path");

router.get('/',function(req, res) {
    res.send("k")
});

module.exports = router;