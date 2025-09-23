const { Router } = require("express")
//i need to add the controllers to use in the routes
const router = Router()


// register user 
router.post("/register");

//login user
router.post("/login");

// refresh token
router.post("/refresh");

// logout
router.post("/logout");

module.exports = router;