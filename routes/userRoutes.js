const express = require("express");
const router = express.Router();

//Requiring the controller
const userControllers = require("../controllers/userControllers");

//Get login page
router.get(`/`, userControllers.getLogin);

//Login
router.post("/", userControllers.postLogin);

//Get signup page
router.get("/signup", userControllers.getSignup);

//Create an account
router.post(`/`, userControllers.postSignup);

module.exports = router;
