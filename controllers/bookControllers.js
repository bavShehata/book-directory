const mongoose = require("mongoose");
const Book = require("../models/bookModel");

module.exports = {
  // Showing all user books
  allBooks: (req, res) => {
    Book.find()
      .then((books) => res.render("bookViews/index", { title: "Home", books }))
      .catch((err) => console.log("Error: ", err));
  },
  // A form where a new book can be added
  bookForm: (req, res) => {
    res.render("bookViews/add", { title: "Add", confirm: "" });
  },
  // The process of adding a book from the form to the user
  addBook: (req, res) => {
    const book = new Book({
      title: req.body.title,
      year: req.body.year,
      author: req.body.author,
      description: req.body.description,
      notes: req.body.notes,
      quotes: req.body.quotes,
    });
    // Checking if the same book and the same author were used before.
    Book.findOne(
      {
        $and: [{ title: req.body.title }, { author: req.body.author }],
      },
      (err, record) => {
        if (record === null) {
          book.save(() => {
            console.log("New book added: ", book.title);
            res.render("bookViews/add", {
              title: "Add",
              confirm: `${book.title} has been added!`,
            });
          });
        } else {
          console.log("This book already exists: ", book.title);
          res.render("bookViews/add", {
            title: "Add",
            confirm: `${book.title} already exists!`,
          });
        }
      }
    );
  },
  // deleting a book from the user
  deleteBook: (req, res) => {
    Book.findOneAndDelete({ _id: req.params.id }, (error, record) =>
      console.log("Book Deleted: ", record.title)
    );
  },
};
