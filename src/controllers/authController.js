const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config()


//register an User
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        // bcrpyt salt rounds
        const saltRounds = 10; 

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        // if the password doesnt match with the regex
        if (!passwordRegex.test(password)) {
        return res.status(400).json({
            errors: [{
            status: 400,
            source: { pointer: "/data/attributes/password" },
            title: "Invalid Attribute",
            detail: "Password must contain at least one uppercase letter and one number"
            }]
        });
        }


        // we hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // we save in the database (validations de mongoose se disparan aquí)
        const newUser = await User.create({ email, password: hashedPassword });

        res.status(201).json({
            data: {
                type: "users",
                id: newUser._id,
                attributes: {
                    email: newUser.email,
                    createdAt: newUser.createdAt
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
                    detail: "Email already registered"
                }]
            });
        }

        //validation with the User schema
        if (err.name === "ValidationError") {
            const errors = Object.keys(err.errors).map(key => ({
                status: 400,
                source: { pointer: `/data/attributes/${key}` },
                title: "Invalid Attribute",
                detail: err.errors[key].message // send the error message in the User schema
            }));
            return res.status(400).json({ errors });
        }

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
    try {
        const { email, password } = req.body;
        
        //we verify if the email exists in the database
        const user = await User.findOne({ email });

        // if the user doesnt exists return 401 status
        if (!user) {
            return res.status(401).json({
                errors: [{
                    status: 401,
                    title: "Unauthorized",
                    source: { pointer: "/data/attributes/email" },
                    detail: "Invalid email or password"
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
                    detail: "Invalid email or password"
                }]
            })
        }

        //we define the payload for jwt
        const payload = {
            id: user._id,
            email: user.email,
        }

        // we crete the token with the payload info and the jwt secret token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.status(200).json({
            data: {
                type: "users",
                id: user._id, 
                attributes: {
                    email: user.email,
                    token: token
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
                detail: err.errors[key].message
            }));
            return res.status(400).json({ errors });
        }

        res.status(500).json({
            errors: [{
                status: 500,
                title: "Internal Server Error",
                source: { pointer: "/server" },
                detail: "An unexpected error occurred on the server."
            }]
        });
    }
}

module.exports = { register, login };
