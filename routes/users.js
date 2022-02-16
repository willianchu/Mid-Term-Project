/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const database = require("../lib/database");
const router = express.Router();
const cookieSession = require('cookie-session')
const app = express()
app.use(cookieSession({
 name: 'session',
 keys: ['key1', 'key2']
}))

module.exports = (db) => {
  // parameter database
  // router.get("/", (req, res) => {
  //   database.getQuizScore(6)
  //     .then(data => {
  //       const score =  data;
  //       console.log("questions",({ score }));
  //       res.json({ score });
  //     })
  //     .catch(err => {
  //       res
  //         .status(500)
  //         .json({ error: err.message });
  //     });
  // });

  app.get("/login/:user_id", (req, res) => {
    req.session.user_id = req.params.user_id;
    res.redirect('/');
  });

  router.get("/results/:id", (req, res) => {
    database
      .getUserScore(req.session.user_id, req.params.id)
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
