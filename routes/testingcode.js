const express = require('express');
const database = require('../lib/database');
const router  = express.Router();

module.exports = (db) => { // query 01_search_users_by_email.sql
  router.get("/", (req, res) => {
    database.getUserByEmail('asherpoole@gmx.com')
      .then(data => {
        const user =  data;
        console.log("users",({ user }));
        res.json({ user });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

module.exports = (db) => { // query 02_search_users_by_id.sql
  router.get("/", (req, res) => {
    database.getUserById(1)
      .then(data => {
        const user =  data;
        console.log("users",({ user }));
        res.json({ user });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

module.exports = (db) => { // query 03_search_quizzes_by_user_id.sql
  router.get("/", (req, res) => {
    database.getQuizzesByUserById(1)
      .then(data => {
        const quizzes =  data;
        console.log("quizzes",({ quizzes }));
        res.json({ quizzes });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

const express = require('express');
const database = require('../lib/database');
const router  = express.Router();

module.exports = (db) => { // parameter database
  router.get("/", (req, res) => {
    database.getUserScore(2,6)
      .then(data => {
        const quizzes =  data;
        console.log("questions",({ quizzes }));
        res.json({ quizzes });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};