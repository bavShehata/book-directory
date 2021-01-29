const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BookSchema = new Schema({
  title: String,
  year: Number,
  author: { type: String, default: "Unknown" },
  description: { type: String, default: "None" },
  notes: { type: String, default: "None" },
  quotes: { type: String, default: "None" },
});

const book = mongoose.model("book", BookSchema);
module.exports = book;
