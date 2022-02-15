const express = require("express");
const database = require('../lib/database');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    database.getAllTests()
      .then((data) => {
        const tests = data;
        res.json({ tests });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/:id", (req, res) => {
    database.getTestsByUser(req.params.id)
      .then((data) => {
        const test = data;
        res.json({ test });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    database.insertTest(req.body)
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:id", (req, res) => {
    database.updateTest(req.params.id, req.body)
      .then((data) => {
        res.json({ test: data.rows[0] });
        //come back to this
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id", (req, res) => {
    database.deleteTest(req.params.id)
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
