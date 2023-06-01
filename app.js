const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//
const createError = require('http-errors');

// For debugging
const debug = require("debug")("app");

//For Environmental Variables
require("dotenv").config();

//For Production Deployment
// const compression = require("compression");
// const helmet = require("helmet");


//Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const inventoryRouter = require('./routes/inventory')

//Mongoose Setup
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.DB_URI;

//Initialize DB connection
main().catch((err) => debug(err));
async function main() {
  console.log("Attempting to connect to MongoDB");
  await mongoose.connect(mongoDB);
  console.log(`You're all connected to MongoDB atlas!`);
}

const app = express();

// Set up rate limiter: maximum of twenty requests per minute
// const RateLimit = require("express-rate-limit");
// const limiter = RateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 20,
// });
// Apply rate limiter to all requests
// app.use(limiter);

// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
// app.use(helmet());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/inventory', inventoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
