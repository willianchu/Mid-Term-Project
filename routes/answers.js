const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM answers;`)
      .then((data) => {
        const answers = data.rows;
        res.json({ answers });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM answers WHERE id= $1;`, [req.params.id])
      .then((data) => {
        const answer = data.rows[0];
        res.json({ answer });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    console.log(req)
    db.query(
      `INSERT INTO answers(id, question_id, alternative_id, test_id)
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
      `UPDATE answers(id, question_id, alternative_id, test_id)
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
      `DELETE FROM answers WHERE  id = $1;`, [req.params.id]
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
