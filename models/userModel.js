const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const argon2 = require("argon2");

const BookSchema = new Schema({
  title: String,
  year: Number,
  author: { type: String, default: "Unknown" },
  description: { type: String, default: "None" },
  notes: { type: String, default: "None" },
  quotes: { type: String, default: "None" },
});
const UserSchema = new Schema({
  fname: { type: String, required: [true, "Please input a first name"] },
  lname: { type: String, required: [true, "Please input a last name"] },
  email: {
    type: String,
    required: [true, "Please input an Email"],
    unique: [true, "This Email is already taken"],
    lowercase: true,
    validate: [isEmail, "Please enter a valid Email"],
  },
  username: {
    type: String,
    required: [true, "Please input a username"],
    unique: [true, "This username is already taken"],
  },
  password: {
    type: String,
    required: [true, "Please input a password"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  book: [BookSchema],
});

// Hashing the password before getting it saved to database
UserSchema.pre("save", async function (next) {
  this.password = await argon2.hash(this.password, {
    type: argon2.argon2id,
  });
  console.log(this);
  next();
});

// Static method to login user
UserSchema.statics.login = async function (username, password) {
  console.log(username);
  const user = await this.findOne({ username });
  if (user) {
    const auth = await argon2.verify(user.password, password);
    if (auth) {
      return user;
    }
    throw Error("Password is incorrect");
  }
  throw Error("Username is incorrect");
};

const user = mongoose.model("user", UserSchema);
const book = mongoose.model("book", BookSchema);
module.exports = { user, book };
