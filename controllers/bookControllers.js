const mongoose = require("mongoose");
const Book = require("../models/bookModel");

module.exports = {
  allBooks: (req, res) => {
    Book.find()
      .then((books) => res.render("bookViews/index", { title: "Home", books }))
      .catch((err) => console.log("Error: ", err));
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
      console.log("New book added: ", book.title);
      res.render("bookViews/add", {
        title: "Add",
        confirm: `${book.title} has been added!`,
      });
    });
  },
  deleteBook: (req, res) => {
    Book.findOneAndDelete({ _id: req.params.id }, (error, record) =>
      console.log("Book Deleted: ", record.title)
    );
  },
};
