const mongoose = require("mongoose");
const Book = require("../models/bookModel");
const axios = require("axios").default;
module.exports = {
  // Showing all user books
  allBooks: async (req, res) => {
    const books = await Book.find();
    res.render("bookViews/index", { title: "Home", books });
  },
  // A form where a new book can be added
  bookForm: async (req, res) => {
    res.render("bookViews/add", { title: "Add", confirm: "" });
  },
  // The process of adding a book from the form to the user
  addBook: async (req, res) => {
    if (isNaN(req.body.year)) req.body.year = 0;
    const book = new Book({
      title: req.body.title,
      year: req.body.year,
      author: req.body.author,
      description: req.body.description,
      notes: req.body.notes,
      quotes: req.body.quotes,
    });
    // Checking if the same book and the same author were used before.
    const oldBook = await Book.findOne({
      $and: [{ title: req.body.title }, { author: req.body.author }],
    });
    // If it's a unique record, save it to the database
    if (oldBook === null) {
      await book.save();
      console.log("New book added: ", book.title);
      res.send();
    } else {
      // Else, prompt to the user that the book already exists
      console.log("This book already exists: ", book.title);
      res.status(409).send();
    }
  },
  // deleting a book from the user
  deleteBook: async (req, res) => {
    const deletedBook = await Book.findOneAndDelete({ _id: req.params.id });
    console.log("Book deleted: ", deletedBook.title);
    res.send();
  },
  // upading a book for the user
  updateBook: async (req, res) => {
    const newBook = await Book.findOne({ _id: req.params.id });
    // Checking if the same book and the same author were used before.
    const oldBook = await Book.findOne({
      $and: [{ title: req.body.data[0] }, { author: req.body.data[2] }],
    });
    // If it's a unique record, save it to the database
    if (oldBook === null || oldBook._id.toString() === req.params.id) {
      // Check if the year is a number
      if (isNaN(req.body.data[1])) {
        console.log("The year must be a number: ", oldBook.title);
        res.status(400).send();
      }
      // Check if the book has no title, year, or author
      else if (
        req.body.data[0] == "" ||
        req.body.data[1] == "" ||
        req.body.data[2] == ""
      ) {
        console.log("Every book must have a name and an author and a year");
        res.status(408).send();
      } else {
        // Update book
        newBook.title = req.body.data[0];
        newBook.year = req.body.data[1];
        newBook.author = req.body.data[2];
        newBook.description = req.body.data[3];
        newBook.notes = req.body.data[4];
        newBook.quotes = req.body.data[5];
        await newBook.save();
        console.log("Book updated Successfully: ", newBook.title);
      }
    } else {
      // Else, prompt to the user that the book already exists
      console.log("This book already exists: ", oldBook.title);
      res.status(409).send();
    }
  },
  // Get a specific book
  getBook: async (req, res) => {
    const books = await Book.find();
    const book = await Book.findOne({ _id: req.params.id });
    try {
      console.log("Book info: ", book.title);
      res.render("bookViews/book", { title: "Book Directory", book });
    } catch {
      console.log("asdasdas");
      res.render("bookViews/index", { title: "Home", msg: "", books });
      console.log("obj");
    }
  },
  // Browse books
  browseBooks: async (req, res) => {
    // Get 10 random books
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var RGLetter = possible[Math.floor(Math.random() * (possible.length - 1))];
    const RGNumber = Math.floor(Math.random() * 240); // the number of current books for the query "e" is 254
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${RGLetter}&startIndex=${RGNumber}`
    );
    const books = response.data.items;
    for (var i = 0; i < 10; i++) {
      const bookInfo = response.data.items[i].volumeInfo;
      const bookTitle = bookInfo.title;
      var bookYear = bookInfo.publishedDate;
      if (bookYear !== undefined)
        //Get only the year of the book
        bookYear = bookInfo.publishedDate.substring(0, 4).trim();
      else bookYear = "Unknown";
      var bookAuthors = bookInfo.authors;
      if (bookAuthors !== undefined) {
        const authors = () => {
          // Find the number of authors
          const authorCount = bookInfo.authors.length;
          var authors = "";
          for (var j = 0; j < authorCount; j++) {
            // Add each author and a comma and whitespace
            authors += `${bookInfo.authors[j]}, `;
          }
          // Remove the comma and whitespace of the last author
          authors = authors.substring(0, authors.length - 2).trim();
          return authors;
        };
        bookAuthors = authors();
      } else bookAuthors = "Unknown";
      var bookDescription = bookInfo.description;
      if (bookDescription === undefined) bookDescription = "None";
    }
    console.log("Books shown to browse");
    res.render("bookViews/browse", { title: "Browse", books });
  },
};
