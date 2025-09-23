const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config()



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
                errors: [{
                        status: 400,
                        source: { pointer: "/data/attributes/email" },  
                        title: "Bad request",
                        detail: "Email already registered"
                    }]
            })
        }

        // we hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        
        // we save in the database
        const newUser = await User.create({email, password: hashedPassword});

        res.status(201).json({
            data: [{
                type: "users",
                id: newUser._id,
                attributes: {
                    email: newUser.email,
                    createdAt: newUser.createdAt
                }
            }]
        })
    } catch(err) {
        console.log(err)
        res.status(500).json({
            errors: [{
                status: 500,
                title: "Internal Server Error",
                source: { pointer: "/server" },
                detail: "An unexpected error occurred on the server."
            }]
        })
    }
}



// login an User

const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        
        //we verify if the email exists in the database
        const user = await User.findOne({email});

        // if the user doesnt exists return 401 status
        if(!user){
            return res.status(401).json({ error: "Invalid credentials"});
        };

        // we compare the password given by the user with the password on the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch){
            return res.status(401).json({error: "Invalid credentials"}) // TASK: fill the json with more attributes
        }

        //we define the payload for jwt
        const payload = {
            id: user._id,
            email: user.email,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"})
        res.status(200).json({token, user: {id: user._id, email: user.email}})
        

    } catch(err){
        console.error("error", (err))
    }

}

module.exports = {register, login};