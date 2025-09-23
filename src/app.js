const express = require("express");
const app = express();
require("dotenv").config()
const connectDB = require("./config/db.js")

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, function(err){
    if (err){ console.log("Error in the server setup")};
    
    console.log("Server listening on Port: " + PORT);
});
