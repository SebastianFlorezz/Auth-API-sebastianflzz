const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true,
        match: [
             /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
             "Please fill with a valid email address"
        ]
    },


    password: {
        type: String, 
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 characters long"],
        match: [
            /^(?=.*[A-Z])(?=.*\d).+$/,
            "Password must contain at least one uppercase letter and one number"
        ]},
    
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);