const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const requestIdMiddleware = require("./middlewares/requestId.js")
const PORT = process.env.PORT || 5000;


connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(requestIdMiddleware);

app.use("/api", authRoutes);


app.listen(PORT, function(err){
    if (err){ console.log("Error in the server setup")};
    
    console.log("Server listening on Port: " + PORT);
});