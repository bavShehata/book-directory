const jwt = require("jsonwebtoken");
const User = require("../models/userModel").user;

module.exports = {
  requireAuth: (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if token exists
    if (token) {
      jwt.verify(token, process.env.jwtSecret, (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.redirect("/");
        }
        console.log(decodedToken);
        next();
      });
    } else {
      res.redirect("/");
    }
  },

  // Check current user
  checkUser: async (req, res, next) => {
    const token = req.cookies.jwt;

    // Check if token exists
    if (token) {
      jwt.verify(token, process.env.jwtSecret, async (err, decodedToken) => {
        if (err) {
          console.log(err);
          res.locals.user = null;
          next();
        }
        console.log("Current User middleware");
        console.log(decodedToken);
        try {
          const user = await User.findById(decodedToken._id);
          res.locals.user = user;
          console.log("Current user is ", user.username);
          next();
        } catch (e) {
          console.log("Couldn't authenticate\n", e);
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  },
};
