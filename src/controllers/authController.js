const User = require("../models/User.js");
const bcrypt = require("bcrypt");



//register an User
const register = async (req, res) => {

    try{
        const {email, password} = req.body;
        const saltRounds = 10; // bcrpyt salt rounds

        //we verify if the email exists
        const emailExists = await User.findOne({email});

        // if email exist
        if (emailExists){
            return res.status(400).json({
                error: "User already exist"
            })
        }

        // we hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        
        // we save in the database
        const newUser = await User.create({email, password: hashedPassword});

        res.status(201).json({
            message: "User created succesfully", // TASK: fill the json with more attributes
            data: newUser
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            error: "Register error" // TASK: fill the json with more attributes
        })
    }
}



// login an User

const login = async (req, res) => {

}

module.exports = {register, login};