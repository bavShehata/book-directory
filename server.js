//Environment variables
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

// middleware & static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// register view engine
app.set("view engine", "ejs");

//Routes
const bookRoutes = require("./routes/bookRoutes");

//Book Routes
app.use("/book", bookRoutes);
