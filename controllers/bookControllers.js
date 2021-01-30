const mongoose = require("mongoose");
const Book = require("../models/bookModel");
const axios = require("axios").default;
module.exports = {
  // Showing all user books
  allBooks: async (req, res) => {
    try {
      const books = await Book.find().sort({ _id: -1 });
      res.render("bookViews/index", { title: "Home", books });
    } catch {
      console.log("Your books could not be viewed");
    }
  },
  // Showing all user books sorted
  allBooksSorted: async (req, res) => {
    try {
      const sortBy = req.query.sortBy;
      var orderQuery = {};
      orderQuery[sortBy] = req.query.order;
      console.log(orderQuery);
      const books = await Book.find().sort(orderQuery);
      res.send();
    } catch (e) {
      console.log("Couldn't order books\n", e);
    }
  },
  // A form where a new book can be added
  bookForm: async (req, res) => {
    try {
      res.render("bookViews/add", { title: "Add", added: 0 });
    } catch {
      console.log("Book Form couldn't be viewed");
    }
  },
  // The process of adding a book from the form to the user
  addBook: async (req, res) => {
    try {
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
        res.render("bookViews/add", {
          title: "Add",
          added: 1,
        });
      } else {
        // Else, prompt to the user that the book already exists
        console.log("This book already exists: ", book.title);
        res.status(409).send();
      }
    } catch {
      console.log("Book couldn't be added");
    }
  },
  // deleting a book from the user
  deleteBook: async (req, res) => {
    try {
      const deletedBook = await Book.findOneAndDelete({ _id: req.params.id });
      console.log("Book deleted: ", deletedBook.title);
      res.send();
    } catch {
      console.log("Book couldn't be deleted");
    }
  },
  // upading a book for the user
  updateBook: async (req, res) => {
    try {
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
    } catch (e) {
      console.log("Book could not be updated");
    }
  },
  // Get a specific book
  getBook: async (req, res) => {
    try {
      const books = await Book.find().sort({ _id: -1 });
      const book = await Book.findOne({ _id: req.params.id });
      try {
        console.log("Book info: ", book.title);
        res.render("bookViews/book", { title: "Book Directory", book });
      } catch {
        res.render("bookViews/index", { title: "Home", msg: "", books });
      }
    } catch {
      ("Book couldn't be found");
    }
  },
  // Browse books
  browseBooks: async (req, res) => {
    try {
      console.log("No query");
      const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      searchQuery = possible[Math.floor(Math.random() * (possible.length - 1))];
      RGNumber = Math.floor(Math.random() * 30); // the number of current books for the query "e" is 254

      // Get 10 random books
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&startIndex=${RGNumber}`
      );
      const books = response.data.items;
      for (var i = 0; i < 10; i++) {
        const bookInfo = response.data.items[i].volumeInfo;
        const bookTitle = bookInfo.title;
        console.log(bookTitle);

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
    } catch {
      console.log("Default browse page couldn't be displayed");
      res.redirect(`book/browse/`);
    }
  },
  // Browse books
  browseBooksSearch: async (req, res) => {
    try {
      var searchQuery = req.params.query;
      console.log("QUERY: ", searchQuery);
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}`
      );
      const books = response.data.items;
      for (var i = 0; i < 10; i++) {
        const bookInfo = response.data.items[i].volumeInfo;
        const bookTitle = bookInfo.title;
        console.log(bookTitle);
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
      console.log("Search done");
      res.render("bookViews/browse", {
        title: `Browse: ${searchQuery}`,
        books,
      });
      console.log("Search done for real");
    } catch {
      var searchQuery = req.params.query;
      console.log("Your searched browse page couldn't be displayed");
      res.redirect(`book/browse/${bookQuery}`);
    }
  },
};
