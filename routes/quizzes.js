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
  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM quizzes WHERE id = $1;`, [req.params.id])
      .then((data) => {
        const quiz = data.rows[0];
        res.json({ quiz });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    console.log(req)
    db.query(
      `INSERT INTO quizzes(id, title, description, cut_note, time_limit, url_quiz_image, owner_id)
    VALUES (value1, value2, …);`
    )
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:id", (req, res) => {
    db.query(
      `UPDATE quizzes(id, title, description, cut_note, time_limit, url_quiz_image, owner_id)
    VALUES (value1, value2, …)WHERE id = $1;`, [req.params.id]
    )
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id", (req, res) => {
    db.query(
      `DELETE FROM quizzes WHERE id = $1;`, [req.params.id]
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

