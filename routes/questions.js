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
  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM questions WHERE id= $1;`, [req.params.id])
      .then((data) => {
        const question = data.rows[0];
        res.json({ question });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    const {question, url_picture_link, quiz_id } = req.body;
    db.query(
      `INSERT INTO questions(question, url_picture_link, quiz_id)
    VALUES ($1, $2, $3);`, [question, url_picture_link, quiz_id]
    )
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:id", (req, res) => {
    const {question, url_picture_link, quiz_id} = req.body;
    db.query(
      `UPDATE questions SET question = $1, url_picture_link = $2, quiz_id = $3
      WHERE id = $4;`,
      [question, url_picture_link, quiz_id, req.params.id]
    )
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id", (req, res) => {
    db.query(`DELETE FROM questions WHERE  id = $1;`, [req.params.id])
      .then(() => {
        res.json({ data: "Data deleted!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
