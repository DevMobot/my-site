const express = require('express')
const app = express()
const port = 80;

app.use(express.static("./public/"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
    res.send("HELLO")
})  

app.get('/:id', function (req, res) {
    res.send('Hello ' + req.params.id)
})  

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})