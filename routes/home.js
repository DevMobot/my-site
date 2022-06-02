const router = require("express").Router();
const path = require("path");
const fs = require("fs");

router.get('/',function(req,res) {
  res.sendFile(path.join(__dirname, "..", "pages/home.html"));
});

module.exports = router;