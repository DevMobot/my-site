const router = require("express").Router();
const path = require("path");

router.get('/',function(req,res) {
  res.sendFile(path.join(__dirname, "../", "pages/home.html"));
  //res.sendFile(path.join())

});

module.exports = router;