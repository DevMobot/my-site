const express = require('express')
const app = express()
const port = process.env.PORT || 80;
const path = require('path');

const HomeRouter = require("./routes/home.js");

app.use("/resources", express.static("./css/"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", HomeRouter);

/*
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/views/home.html'))
})  

app.get('/:id', function (req, res) {
    res.send('Hello ' + req.params.id)
}) 
*/

app.listen(port, () => {
    console.log(`Site open on port ${port}`);
})