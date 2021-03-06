const express = require("express");
const router = express.Router();

//Requiring the controllers
const bookControllers = require("../controllers/bookControllers");

//Get all books (sorted or not)
router.get(`/`, bookControllers.allBooks);

//Delete all books
router.delete("/", bookControllers.allBooksDeleted);

//404 page
router.get("/404", bookControllers.error404);

//New book form
router.get("/add", bookControllers.bookForm);

//Add a new book
router.post("/add", bookControllers.addBook);

//Browsing books
router.get("/browse", bookControllers.browseBooks);

//Delete a book by ID
router.delete("/:id", bookControllers.deleteBook);

//Update a book by ID
router.put("/:id", bookControllers.updateBook);

//Details of a book
router.get("/:id", bookControllers.getBook);

//404 error
router.use(bookControllers.error404);

module.exports = router;
