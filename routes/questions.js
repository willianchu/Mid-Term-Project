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
    console.log(req)
    db.query(
      `INSERT INTO questions(id, question, url_picture_link, quiz_id)
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
      `UPDATE questions(id, question, url_picture_link, quiz_id)
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
      `DELETE FROM questions WHERE  id = $1;`, [req.params.id]
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
