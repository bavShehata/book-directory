//Environment variables
require("dotenv/config");

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

//Connect to database
const dbURI = `mongodb://${process.env.dbUser}:${process.env.dbPass}@${process.env.dbProject}-shard-00-00.ni1ct.mongodb.net:27017,${process.env.dbProject}-shard-00-01.ni1ct.mongodb.net:27017,${process.env.dbProject}-shard-00-02.ni1ct.mongodb.net:27017/${process.env.dbName}?ssl=true&replicaSet=atlas-xnqgbv-shard-0&authSource=admin&retryWrites=true&w=majority`;
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// register view engine
app.set("view engine", "ejs");

//Routes
const bookRoutes = require("./routes/bookRoutes");

//Book Routes
app.use("/book", bookRoutes);
