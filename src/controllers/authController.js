const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config()


//register an User
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //empty input validation
        if (!username || !email || !password) {
        const missing = !username ? "username" : !email ? "email" : "password";

            return res.status(400).json({
                errors: [{
                status: 400,
                title: "Invalid Attribute",
                source: { pointer: `/data/attributes/${missing}` },
                detail: `${missing.charAt(0).toUpperCase()}${missing.slice(1)} is required`,
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.requestId
                }
                }]
            });
        }


        // bcrpyt salt rounds
        const saltRounds = 10; 

        const passwordRegex = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
        // if the password doesnt match with the regex
        if (!passwordRegex.test(password)) {
        return res.status(400).json({
            errors: [{
            status: 400,
            source: { pointer: "/data/attributes/password" },
            title: "Invalid Attribute",
            detail: "Password must contain at least one uppercase letter, one number and 8 characters minimun",
            meta: {
                timestamp: new Date().toISOString(),
                requestId: req.requestId
            }
            }]
        });
        }


        // we hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // we save in the database (validations de mongoose se disparan aquí)
        const newUser = await User.create({ 
            username,
            email: email.toLowerCase(),
            password: hashedPassword });

        res.status(201).json({
            data: {
                type: "users",
                id: newUser._id,
                attributes: {
                    username,
                    email: newUser.email,
                    createdAt: newUser.createdAt
                },
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.requestId
                }
            }
        });
    } catch (err) {
        console.log(err)

        // duplicate email error
        if (err.code === 11000) {
            return res.status(409).json({
                errors: [{
                    status: 409,
                    source: { pointer: "/data/attributes/email" },
                    title: "Conflict",
                    detail: "Email already registered",
                    meta:{
                        timestamp: new Date().toISOString(),
                        requestId: req.requestId
                    }
                }]
            });
        }

        //validation with the User schema
        if (err.name === "ValidationError") {
            const errors = Object.keys(err.errors).map(key => ({
                status: 400,
                source: { pointer: `/data/attributes/${key}` },
                title: "Invalid Attribute",
                detail: err.errors[key].message,// send the error message in the User schema
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.requestId
                }
            }));
            return res.status(400).json({ errors });
        }

        res.status(500).json({
            errors: [{
                status: 500,
                title: "Internal Server Error",
                source: { pointer: "/server" },
                detail: "An unexpected error occurred on the server.",
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.requestId
                }
            }]
        })
    }
}


// login an User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //input validations
        if (!email || !password) {
        return res.status(400).json({
            errors: [{
            status: 400,
            title: "Invalid Attribute",
            source: { pointer: !email ? "/data/attributes/email" : "/data/attributes/password" },
            detail: !email 
                ? "Email is required" 
                : "Password is required",
            meta: {
                timestamp: new Date().toISOString(),
                requestId: req.requestId
            }
            }]
        });
    }
    
        //we verify if the email exists in the database
        const user = await User.findOne({ email });

        // if the user doesnt exists return 401 status
        if (!user) {
            return res.status(401).json({
                errors: [{
                    status: 401,
                    title: "Unauthorized",
                    source: { pointer: "/data/attributes/email" },
                    detail: "Invalid email or password",
                    meta: {
                        timestamp: new Date().toISOString(),
                        requestId: req.requestId
                    }
                }]
            });
        }

        // we compare the password given by the user with the password on the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                errors: [{
                    status: 401,
                    title: "Unauthorized",
                    source: { pointer: "/data/attributes/password" },
                    detail: "Invalid email or password",
                    meta: {
                        timestamp: new Date().toISOString(),
                        requestId: req.requestId
                    }
                }]
            })
        }

        //we define the payload for jwt
        const payload = {
            id: user._id,
            email: user.email,
            username: user.username
        }

        // we crete the token with the payload info and the jwt secret token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.status(200).json({
            data: {
                type: "users",
                id: user._id, 
                attributes: {
                    username: user.username,
                    email: user.email,
                    token: token
                },
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.requestId
                }
            }
        });
    } catch (err) {
        console.log(err)
        // if the error name is ValidationError send the model user DB error
        if (err.name === "ValidationError") {
            const errors = Object.keys(err.errors).map(key => ({
                status: 400,
                source: { pointer: `/data/attributes/${key}` },
                title: "Invalid Attribute",
                detail: err.errors[key].message,
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.requestId
                }
            }));
            return res.status(400).json({ errors });
        }

        res.status(500).json({
            errors: [{
                status: 500,
                title: "Internal Server Error",
                source: { pointer: "/server" },
                detail: "An unexpected error occurred on the server.",
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: req.requestId
                }
            }]
        });
    }
}

module.exports = { register, login };
