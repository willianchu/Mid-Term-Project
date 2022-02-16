/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */


const express = require('express');
const database = require('../lib/database');
const router  = express.Router();

module.exports = (db) => { // parameter database
  router.get("/results/:id", (req, res) => {
    database.getUserScore(4, req.params.id) // (Logged in user id, Quiz id)
      .then((data) => {
        const results = data;
        res.json({ results });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
