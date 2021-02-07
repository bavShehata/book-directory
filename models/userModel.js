const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  username: String,
  password: String,
});

const user = mongoose.model("user", UserSchema);
module.exports = user;
