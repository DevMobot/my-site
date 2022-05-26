const express = require('express')
const app = express()
const port = process.env.PORT || 80;
const path = require('path');

const HomeRouter = require("./routes/home.js");

app.use("/resources", express.static("./css/"))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", HomeRouter);

app.listen(port, () => {
    console.log(`Site open on port ${port}`);
})