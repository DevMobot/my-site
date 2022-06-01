const router = require("express").Router();
const path = require("path");

router.get('/',function(req,res) {
  res.sendFile(path.join(__dirname, "..", "pages/home/home.html"));
});

module.exports = router;