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
  router.get("/:answersID", (req, res) => {
    db.query(`SELECT * FROM answers WHERE answersID= $1;`, [req.params.answersID])
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
      `INSERT INTO answers(column1, column2, …)
    VALUES (value1, value2, …);`
    )
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:answersID", (req, res) => {
    db.query(
      `UPDATE answers(column1, column2, …)
    VALUES (value1, value2, …)WHERE answersID = $1;`, [req.params.answersID]
    )
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:answersID", (req, res) => {
    db.query(
      `DELETE FROM answers WHERE  answersID = $1;`, [req.params.answersID]
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
