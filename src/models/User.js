const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio"],
    lowercase: true,
    trim: true,
    validate: [
        {
        validator: v => /^.{8,20}$/.test(v),
        message: "El nombre de usuario debe tener entre 8 y 20 caracteres"
        },
        {
        validator: v => /^[a-zA-Z0-9._]+$/.test(v),
        message: "El nombre de usuario solo puede contener letras, números, '.' o '_'"
        },
        {
        validator: v => !/^[_\.]/.test(v),
        message: "El nombre de usuario no puede empezar con '.' o '_'"
        },
        {
        validator: v => !/[_\.]$/.test(v),
        message: "El nombre de usuario no puede terminar con '.' o '_'"
        },
        {
        validator: v => !/(\.\.|__|_.|._)/.test(v),
        message: "El nombre de usuario no puede contener secuencias como '__', '..', '._' o '_.'."
        }
    ]
    },


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
             /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
            "Password must contain at least one uppercase letter and one number"
        ]},
    
    createdAt: {
        type: Date,
        default: Date.now
    }

}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);