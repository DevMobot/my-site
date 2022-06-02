const router = require("express").Router();
const path = require("path");
const fs = require("fs");

router.get('/',function(req,res) {
  res.sendFile(path.join(__dirname, "..", "pages/d.html"));
});
router.get('/:page', function(req, res) {
    let file = path.join(__dirname, "..", `pages/d/${req.params.page}.html`);
    if (fs.existsSync(file)) return res.sendFile(file);
    res.sendFile(path.join(__dirname, "..", "pages/404.html"));
});

module.exports = router;