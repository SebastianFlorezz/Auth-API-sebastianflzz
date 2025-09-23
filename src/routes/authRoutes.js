const { Router } = require("express")
const {register, login} = require("../controllers/authController.js")
//i need to add the controllers to use in the routes
const router = Router()


// register user 
router.post("/register", register);

//login user
router.post("/login", login);

// refresh token
router.post("/refresh");

// logout
router.post("/logout");

module.exports = router;