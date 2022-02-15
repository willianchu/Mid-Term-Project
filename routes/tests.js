const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM tests;`)
      .then((data) => {
        const tests = data.rows;
        res.json({ tests });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM tests WHERE id = $1;`, [req.params.id])
      .then((data) => {
        const test = data.rows[0];
        res.json({ test });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    const { user_id, quiz_id, date_created, finish_date } = req.body;
    db.query(
      `INSERT INTO tests (user_id, quiz_id, date_created, finish_date)
    VALUES ($1, $2, $3, $4);`,
      [user_id, quiz_id, date_created, finish_date]
    )
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:id", (req, res) => {
    const { user_id, quiz_id, date_created, finish_date } = req.body;
    db.query(
      `UPDATE tests SET user_id = $1, quiz_id = $2, date_created = $3, finish_date = $4
      WHERE id = $5;`,
      [user_id, quiz_id, date_created, finish_date, req.params.id]
    )
      .then((data) => {
        res.json({ test: data.rows[0] });
        //come back to this
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id", (req, res) => {
    db.query(`DELETE FROM tests WHERE id = $1;`, [req.params.id])
      .then(() => {
        res.json({ data: "Data deleted!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  // router.get("/:id/result", (req, res) => {
  //   db.query(`SELECT *, ARRAY_AGG(SELECT * FROM answers WHERE answers.test_id = $1) as answers FROM tests WHERE id = $1`, [req.params.id])
  //     .then((data) => {
  //       const test = data.rows;
  //       console.log("test",test)
  //       res.json({ test });
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ error: err.message });
  //     });
  // });

  return router;
};
