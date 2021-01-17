const mongoose = require("mongoose");
const Book = require("../models/bookModel");

module.exports = {
  allBooks: (req, res) => {
    res.render("bookViews/index", { title: "Home" });
  },
  bookForm: (req, res) => {
    res.render("bookViews/add", { title: "Add", confirm: "" });
  },
  addBook: (req, res) => {
    const book = new Book({
      title: req.body.title,
      year: req.body.year,
      author: req.body.author,
      description: req.body.description,
      notes: req.body.notes,
      quotes: req.body.quotes,
    });
    book.save(() => {
      console.log("New book added");
      res.render("bookViews/add", {
        title: "Add",
        confirm: `${book.title} has been added!`,
      });
    });
  },
};
