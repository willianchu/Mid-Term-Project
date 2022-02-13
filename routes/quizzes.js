const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM quizzes;`)
      .then((data) => {
        const quizzes = data.rows;
        res.json({ quizzes });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/:quizID", (req, res) => {
    db.query(`SELECT * FROM quizzes WHERE quizID = $1;`, [req.params.quizID])
      .then((data) => {
        const quizID = data.rows[0];
        res.json({ quizID });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    console.log(req)
    db.query(
      `INSERT INTO quizzes(column1, column2, …)
    VALUES (value1, value2, …);`
    )
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:quizID", (req, res) => {
    db.query(
      `UPDATE quizzes(column1, column2, …)
    VALUES (value1, value2, …)WHERE quizID = $1;`, [req.params.quizID]
    )
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:quizID", (req, res) => {
    db.query(
      `DELETE FROM quizzes WHERE quizID = $1;`, [req.params.quizID]
    )
      .then(() => {
        res.json({ data: "Data deleted!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

