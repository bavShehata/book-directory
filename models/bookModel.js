const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BookSchema = new Schema({
  title: String,
  year: Number,
  author: String,
  description: String,
  notes: String,
  quotes: String,
});

const book = mongoose.model("book", BookSchema);
module.exports = book;
