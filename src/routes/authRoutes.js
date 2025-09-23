const { Router } = require("express")
const {register, login} = require("../controllers/authController.js")
//i need to add the controllers to use in the routes
const router = Router()


// register user 
router.post("/register", register);

//login user
router.post("/login", login);

// refresh token
router.post("/refresh", (req, res)=> {
    res.send("Refresh token is not implemented yet")
});

// logout
router.post("/logout", (req,res)=>{
    res.send("Logout route not implemented yet")
});

module.exports = router;