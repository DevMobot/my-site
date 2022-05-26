const express = require('express') 
const app = express()
const port = process.env.PORT || 80; // GET PORT TO LISTEN ON
const path = require('path');

const HomeRouter = require("./routes/home.js"); // INCLUDE HOME ROUTER

app.use(express.static(__dirname + '/public/')); // NOW PUBLIC FILES ARE ACCESSIBLE

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", HomeRouter); // HOME PAGE ROUTES

// LISTENING FOR REQUESTS
app.listen(port, () => {
    console.log(`READY! LISTENING ON PORT ${port}`);
})