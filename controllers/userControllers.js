const mongoose = require("mongoose");
const User = require("../models/userModel");
const axios = require("axios").default;
const jwt = require("jsonwebtoken");
require("dotenv/config");
const maxAge = 3 * 24 * 60 * 60;

module.exports = {
  // Rendring login page
  getLogin: async (req, res) => {
    try {
      res.render("userViews/login.ejs", {
        title: "login",
        username: "",
        password: "",
        errMsg: "",
      });
    } catch (e) {
      console.log("Couldn't get login page\n", e);
    }
  },
  postLogin: async (req, res) => {
    const { username, password } = req.body;
    try {
      // Authenitcation and token
      const matchedUser = await User.login(username, password);
      // If a user is found
      // Create JWT Token
      const token = jwt.sign({ _id: matchedUser._id }, process.env.jwtSecret, {
        expiresIn: maxAge,
      });
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      console.log(matchedUser._id);
      res.redirect("/book/?sortBy=_id&order=-1&p=1");
    } catch (e) {
      console.log("Couldn't log in\n", e);
      res.render("userViews/login.ejs", {
        title: "login",
        username: username,
        password: password,
        errMsg: e.message,
      });
    }
  },
  getSignup: async (req, res) => {
    try {
      res.render("userViews/signup.ejs", {
        title: "Sign Up",
        err: "",
        errMsg: "",
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: "",
      });
    } catch (e) {
      console.log("Couldn't get signup page\n", e);
    }
  },
  postSignup: async (req, res) => {
    // Add the new account to the database
    const { fname, lname, email, username, password } = req.body;
    try {
      const user = await User.create({
        fname,
        lname,
        email,
        username,
        password,
      });
      console.log("New user created: ", email);
      res.status(201).redirect("/");
    } catch (e) {
      const { err, errMsg } = handleSignupErrors(e);
      console.log(errMsg);
      // console.log(e, error);
      res.render("userViews/signup.ejs", {
        title: "Sign Up",
        err,
        errMsg,
        fname,
        lname,
        email,
        username,
        password,
      });
    }
  },
  logOut: async (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 1 });
      res.redirect("/");
    } catch (e) {
      console.log("Couldn't logout\n", e);
    }
  },
};

function handleSignupErrors(e) {
  // Invalid input
  var error = { email: "", password: "" };
  var outputError = {
    err: "passwordHolder",
    errMsg: "Unknown error, please try again later",
  };
  if (e.message.includes("user validation failed")) {
    Object.values(e.errors).forEach((error) => {
      const path = error.properties.path;
      // If the password is less than 6 characters
      if (path == "password") {
        outputError.err = "passwordShort";
        outputError.errMsg = "Password should be at least 6 characters!";
      }
      // If the email is invalid
      else if (path == "email") {
        outputError.err = "emailInv";
        outputError.errMsg = "Please enter a valid Email";
      }
    });
  }
  // If there is a duplication
  if (e.code == 11000) {
    // Email
    if (e.keyPattern.email) {
      outputError.err = "emailDup";
      outputError.errMsg = "Email is already taken";
    }
    // Username
    if (e.keyPattern.username) {
      outputError.err = "usernameDup";
      outputError.errMsg = "Username is already taken";
    }
  }
  return outputError;
}
