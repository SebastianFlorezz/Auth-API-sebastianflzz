const User = require("../models/User.js");




//register an User
const register = async (req, res) => {

    try{
        const {email, password} = req.body;

        //we verify if the email exists
        const emailExists = await User.findOne({email});

        // if email exist
        if (emailExists){
            return res.status(400).json({
                error: "User already exist"
            })
        }

        
        // we save in the database
        const newUser = await User.create({email, password});

        res.status(201).json({
            message: "User created succesfully" // TASK: fill the json with more attributes
        })
    } catch(err) {
        res.status(500).json({
            error: "Register error"
        })
    }
}



// login an User

const login = async (req, res) => {

}

module.exports = {register, login}