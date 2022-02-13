const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM questions;`)
      .then((data) => {
        const questions = data.rows;
        res.json({ questions });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/:questionsID", (req, res) => {
    db.query(`SELECT * FROM questions WHERE questionsID= $1;`, [req.params.questionsID])
      .then((data) => {
        const id = data.rows[0];
        res.json({ id });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    console.log(req)
    db.query(
      `INSERT INTO questions(column1, column2, …)
    VALUES (value1, value2, …);`
    )
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:questionsID", (req, res) => {
    db.query(
      `UPDATE questions(column1, column2, …)
    VALUES (value1, value2, …)WHERE questionsID = $1;`, [req.params.questionsID]
    )
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:questionsID", (req, res) => {
    db.query(
      `DELETE FROM questions WHERE  questionsID = $1;`, [req.params.questionsID]
    )
      .then(() => {
        res.json({ data: "Data deleted!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router
};
