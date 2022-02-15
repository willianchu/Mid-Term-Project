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
    const {
      title,
      description,
      cut_note,
      time_limit,
      url_quiz_image,
      owner_id,
    } = req.body;
    db.query(
      `INSERT INTO quizzes(title, description, cut_note, time_limit, url_quiz_image, owner_id)
    VALUES ($1, $2, $3, $4, $5, $6);`,
      [title, description, cut_note, time_limit, url_quiz_image, owner_id]
    )
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:id", (req, res) => {
    const {
      title,
      description,
      cut_note,
      time_limit,
      url_quiz_image,
      owner_id,
    } = req.body;
    db.query(
      `UPDATE quizzes SET title = $1, description = $2, cut_note = $3, time_limit = $4, url_quiz_image = $5, owner_id = $6
      WHERE id = $7;`,
      [
        title,
        description,
        cut_note,
        time_limit,
        url_quiz_image,
        owner_id,
        req.params.id,
      ]
    )
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id", (req, res) => {
    db.query(`DELETE FROM quizzes WHERE id = $1;`, [req.params.id])
      .then(() => {
        res.json({ data: "Data deleted!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
