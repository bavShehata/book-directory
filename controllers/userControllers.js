const mongoose = require("mongoose");
const User = require("../models/userModel");
const axios = require("axios").default;
module.exports = {
  // Rendring login page
  getLogin: async (req, res) => {
    try {
      res.render("userViews/login.ejs", { title: "login" });
    } catch (e) {
      console.log("Couldn't get login page\n", e);
    }
  },
  postLogin: async (req, res) => {
    try {
      // Authenitcation and token

      res.redirect("/book/");
    } catch (e) {
      console.log("Couldn't create an account\n", e);
    }
  },
  getSignup: async (req, res) => {
    try {
      res.render("userViews/signup.ejs", { title: "Sign Up" });
    } catch (e) {
      console.log("Couldn't get signup page\n", e);
    }
  },
  postSignup: async (req, res) => {
    try {
      // Add the new account to the database

      res.redirect("/");
    } catch (e) {
      console.log("Couldn't create an account\n", e);
    }
  },
};
