const express = require("express");
const router = express.Router();

//Requiring the controllers
const bookControllers = require("../controllers/bookControllers");

//Get all books
router.get("/", bookControllers.allBooks);

//New book form
router.get("/add", bookControllers.bookForm);

//Add a new book
router.post("/add", bookControllers.addBook);

//Delete a book by ID
router.delete("/:id", bookControllers.deleteBook);

module.exports = router;
