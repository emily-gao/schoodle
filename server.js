"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();

const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const cookieSession = require('cookie-session');

// Seperated Routes for each Resource
const clientRouteFactory = require('./routes/index');
const apiRouteFactory = require("./routes/api");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIESECRET || 'development'],

  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Mount all resource routes
const router = express.Router();
apiRouteFactory(router, knex, 'users');
apiRouteFactory(router, knex, 'votes');
apiRouteFactory(router, knex, 'events');
apiRouteFactory(router, knex, 'event_options');
clientRouteFactory(router, knex);

app.use("/", router);

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
