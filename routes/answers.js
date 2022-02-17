const express = require("express");
const database = require('../lib/database');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    database.getAllAnswers()
      .then((data) => {
        const answers = data;
        res.json({ answers });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/:id", (req, res) => {

    database.getAnswersByTestId(req.params.id)
      .then((data) => {
        const answer = data;
        res.json({ answer });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    database.insertAnswer(req.body) // (question_id, alternative_id, test_id)
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:id", (req, res) => {
    console.log("route",req.params.id ,req.body);
    database.updateAnswer(req.params.id ,req.body)
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id", (req, res) => {
    database.deleteAnswers(req.params.id)
      .then((result) => {
        if  (result === null) {
          res.status(404).json({ error: "Data not found!" });
        } else {
          res.json({ data: "Data deleted!" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
