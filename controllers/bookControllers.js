const mongoose = require("mongoose");
const User = require("../models/userModel").user;
const Book = require("../models/userModel").book;
const axios = require("axios").default;
const jwt = require("jsonwebtoken");

//Getting the user by token
const getUser = async (req) => {
  const token = req.cookies.jwt;
  userID = jwt.decode(token)._id;
  user = await User.findById(userID);
  return user;
};
// const dynamicSort = (property, sortOrder) => {
//   return function (a, b) {
//     if (sortOrder == -1) {
//       return b[property].localeCompare(a[property]);
//     } else {
//       return a[property].localeCompare(b[property]);
//     }
//   };
// };

module.exports = {
  // Showing all user books
  allBooks: async (req, res) => {
    try {
      // Sorting the books
      const sortBy = req.query.sortBy;
      const sortOrder = req.query.order;
      if (req.query.order == undefined || req.query.sortBy == undefined)
        res.redirect(`/book/?sortBy=_id&order=-1&p=1`);
      const booksPerPage = 10;
      const pageNumber = req.query.p;
      const bookIndex = (pageNumber - 1) * booksPerPage;
      const orderQuery = {};
      orderQuery[sortBy] = sortOrder;
      const user = await getUser(req);
      // books = user.book.sort(dynamicSort(sortBy, sortOrder));
      books = user.book;
      // Pagination
      const maxResult = books.length;
      const maxPage = Math.ceil(maxResult / 10);
      console.log(`${books.length} Books Ordered Successfully`);
      books = books.slice(bookIndex, bookIndex + booksPerPage);
      res.render("bookViews/index", {
        title: "Home",
        books,
        sortBy,
        sortOrder,
        pageNumber,
        maxPage,
      });
    } catch (e) {
      console.log("Couldn't order and/or show books\n", e);
    }
  },
  // Delete all user books
  allBooksDeleted: async (req, res) => {
    try {
      const user = await getUser(req);
      // user.book.length = 0;
      // await user.save();
      console.log("All user books deleted");
      res.send();
    } catch (e) {
      console.log("Couldn't delete user books\n", e);
    }
  },
  // A form where a new book can be added
  bookForm: async (req, res) => {
    try {
      res.render("bookViews/add", { title: "Add", added: 0 });
    } catch (e) {
      console.log("Book Form couldn't be viewed\n", e);
    }
  },
  // The process of adding a book to the user
  addBook: async (req, res) => {
    try {
      if (isNaN(req.body.year)) req.body.year = 0;
      const user = await getUser(req);
      books = user.book;
      const book = new Book({
        title: req.body.title,
        year: req.body.year,
        author: req.body.author,
        description: req.body.description,
        notes: req.body.notes,
        quotes: req.body.quotes,
      });
      books.push(book);
      console.log("Book added", book.title);
      await user.save();
      res.render("bookViews/add", {
        title: "Add",
        added: 1,
      });
      // // Checking if the same book and the same author were used before.
      // const oldBook = await Book.findOne({
      //   $and: [{ title: req.body.title }, { author: req.body.author }],
      // });
      // // If it's a unique record, save it to the database
      // if (oldBook === null || oldBook._id.toString() === req.params.id) {
      //   await book.save();
      //   console.log("New book added: ", book.title);
      //   res.render("bookViews/add", {
      //     title: "Add",
      //     added: 1,
      //   });
      // } else {
      //   // Else, prompt to the user that the book already exists
      //   console.log("This book already exists: ", book.title);
      //   res.json({ id: oldBook._id });
      // }
    } catch (e) {
      console.log("Book couldn't be added\n", e);
    }
  },
  // deleting a book from the user
  deleteBook: async (req, res) => {
    try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      console.log("Book deleted: ", deletedBook.title);
      res.send();
    } catch (e) {
      console.log("Book couldn't be deleted\n", e);
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
      console.log("Book retrieved successfully: ", book.title);
      res.render("bookViews/book", { title: "Book Directory", book });
    } catch (e) {
      "Book couldn't be found\n", e;
      res.render("bookViews/404", { title: 404 });
    }
  },
  // Browse books
  browseBooks: async (req, res) => {
    try {
      var searchQuery = req.query.q;
      var pageNumber = req.query.p;
      var startIndex = (pageNumber - 1) * 10;
      // Checking the number of search results
      var response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&startIndex=800`
      );
      const maxResult = response.data.totalItems - 1;
      const maxPage = Math.ceil(maxResult / 10);
      response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&startIndex=${startIndex}`
      );
      var books = response.data.items;
      // If there are no search results
      if (books == undefined) {
        books = [];
        console.log("No results to be shown");
        res.render(`bookViews/browse`, {
          title: "Browse",
          books,
          pageNumber,
          searchQuery,
          maxPage,
        });
      }
      // Formating the books for output
      for (var i = 0; i < 10; i++) {
        var bookInfo = response.data.items[i].volumeInfo;
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
        // Check if the book is already in the user database
        var added;
        const oldBook = await Book.findOne({
          $and: [{ title: bookTitle }, { author: bookAuthors }],
        });
        if (oldBook == null) added = false;
        else added = true;
        bookInfo = Object.assign(bookInfo, { added });
      }
      console.log("Books shown to browse");
      res.render(`bookViews/browse`, {
        title: `Browse`,
        books,
        pageNumber,
        searchQuery,
        maxPage,
      });
    } catch (e) {
      console.log("Default browse page couldn't be displayed: ", e);
    }
  },
  error404: async (req, res) => {
    res.render("bookViews/404", { title: 404 });
  },
};
