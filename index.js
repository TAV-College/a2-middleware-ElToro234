// Base imports
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const logger = require('./middleware/logging');
const { verifyToken } = require('./middleware/auth');


// Router Imports
const mainRouter = require("./routers/main.js");
const bookRouter = require("./routers/books.js");
const authRouter = require('./routers/auth');
const port = process.env.PORT || 3000;

// Create & Configure App
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// Apply routers
app.use('/', mainRouter);
app.use('/api', authRouter); // Routes for authentication
app.use('/api', booksRouter); // Apply token verification to specific routes


// Load routers
app.use("", mainRouter);
app.use("", bookRouter);

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

// Run app
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
