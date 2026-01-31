const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../auth.js');

router.post("/register",userController.registerUser);

router.post("/login", userController.loginUser)

router.get("/details", auth.verify, userController.getUserDetails)

module.exports = router;