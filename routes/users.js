"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {
  
  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
      });
  });
  
  return router;
<<<<<<< HEAD
};
=======
};
>>>>>>> d80e8b2369997c761b7d22195256f81709c94db3
