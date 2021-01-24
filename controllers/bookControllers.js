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
    Book.findOne({
      $and: [{ title: req.body.title }, { author: req.body.author }],
    }).then((oldBook) => {
      // If it's a unique record, then save it to the database
      if (oldBook === null) {
        book.save().then(() => {
          console.log("New book added: ", book.title);
          res.render("bookViews/add", {
            title: "Add",
            confirm: `${book.title} has been added!`,
          });
        });
      } else {
        // Else, prompt to the user that the book already exists
        console.log("This book already exists: ", book.title);
        res.render("bookViews/add", {
          title: "Add",
          confirm: `${book.title} already exists!`,
        });
      }
    });
  },
  // deleting a book from the user
  deleteBook: (req, res) => {
    Book.findOneAndDelete({ _id: req.params.id }).then((deletedBook) =>
      console.log("Book Deleted: ", deletedBook.title)
    );
  },
  // upading a book for the user
  updateBook: (req, res) => {
    Book.findOne({ _id: req.params.id }).then((newBook) => {
      // Checking if the same book and the same author were used before.
      Book.findOne({
        $and: [{ title: req.body.data[0] }, { author: req.body.data[2] }],
      }).then((oldBook) => {
        // If it's a unique record, then save it to the database
        if (oldBook === null || oldBook._id.toString() === req.params.id) {
          // Check if the year is a number
          if (isNaN(req.body.data[1])) {
            console.log("The year must be a number: ", oldBook.title);
            Book.find()
              .then((books) => res.status(400).send())
              .catch((err) => console.log("Error: ", err));
          }
          // Check if the book has no title, year, or author
          else if (
            req.body.data[0] == "" ||
            req.body.data[1] == "" ||
            req.body.data[2] == ""
          ) {
            console.log("Every book must have a name and an author and a year");
            Book.find()
              .then((books) => {
                res.status(408).send();
              })
              .catch((err) => console.log("Error: ", err));
          } else {
            // Update book
            newBook.title = req.body.data[0];
            newBook.year = req.body.data[1];
            newBook.author = req.body.data[2];
            newBook.description = req.body.data[3];
            newBook.notes = req.body.data[4];
            newBook.quotes = req.body.data[5];
            newBook.save().then(() => {
              console.log("Book updated Succefully: ", newBook.title);
            });
          }
        } else {
          // Else, prompt to the user that the book already exists
          console.log("This book already exists: ", oldBook.title);
          Book.find()
            .then((books) => res.status(409).send())
            .catch((err) => console.log("Error: ", err));
        }
      });
    });
  },
  // Get a specific book
  getBook: (req, res) => {
    Book.findOne({ _id: req.params.id }).then((book) => {
      console.log("Book info: ", book.title);
      res.render("bookViews/book", { title: book.title, book });
    });
  },
};
