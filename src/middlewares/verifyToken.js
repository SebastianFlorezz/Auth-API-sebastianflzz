const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET

function verifyToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if(!token) {
        return res.status(401).json({
            error: "Authentication failed",
            message: "No authorization token provided",
            timestamp: new Date().toISOString()           
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded.user
        next()
    } catch(error){
        let errorMessage = "Invalid token"

        if (error instanceof jwt.TokenExpiredError){
            errorMessage = "Token expired"
        }

        if(error instanceof jwt.JsonWebTokenError){
            errorMessage = "Malformed token"
        }

        res.status(401).json({
            error: "Authentication failed",
            message: errorMessage,
            timestamp: new Date().toISOString()
        })
    }
}

module.exports = verifyToken