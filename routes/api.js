const router = require("express").Router();
const path = require("path");

router.get('/',function(req, res) {
    res.sendFile(path.join(__dirname, "..", "resources/test.json"));     
});

module.exports = router;