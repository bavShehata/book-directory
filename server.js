require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

//Connect to database
const dbURI = `mongodb+srv://${process.env.dbUser}:${process.env.dbPass}@${process.env.dbProject}.ni1ct.mongodb.net/${process.env.dbName}?retryWrites=true&w=majority`;
mongoose
  .connect(dbURI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(
    app.listen(8002, () => {
      console.log("Listening on port 8002");
    })
  )
  .catch((error) => console.log(error));

// Book Class
const Book = require("./models/bookModel");

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// register view engine
app.set("view engine", "ejs");

//Routes
//GET Route
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});
app.get("/add", (req, res) => {
  res.render("add", { title: "Add", confirm: "" });
});
//Adding a book
app.post("/add", (req, res) => {
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
    res.render("add", {
      title: "Add",
      confirm: `${book.title} has been added!`,
    });
  });
});
