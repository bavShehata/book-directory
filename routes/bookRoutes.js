const express = require("express");
const router = express.Router();

//Requiring the controllers
const bookControllers = require("../controllers/bookControllers");

//Get all books
router.get("/", bookControllers.allBooks);

//Delete all books
router.delete("/", bookControllers.allBooksDeleted);

//Get books sorted index
router.get(`/sort/`, bookControllers.allBooksSorted);

//New book form
router.get("/add", bookControllers.bookForm);

//Add a new book
router.post("/add", bookControllers.addBook);

//Browsing books
router.get("/browse", bookControllers.browseBooks);

//Searching browsing books
router.get("/browse/:query", bookControllers.browseBooksSearch);

//Delete a book by ID
router.delete("/:id", bookControllers.deleteBook);

//Update a book by ID
router.put("/:id", bookControllers.updateBook);

//Details of a book
router.get("/:id", bookControllers.getBook);

module.exports = router;
