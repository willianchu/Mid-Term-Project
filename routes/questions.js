const express = require("express");
const database = require('../lib/database');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    database.getAllQuestions()
      .then((data) => {
        const questions = data;
        res.json({ questions });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/:questionsID", (req, res) => {
    database.getQuestionsByQuizId(req.params.questionsID)
      .then((data) => {
        const id = data;
        res.json({ id });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    database.insertQuestion(req.body)
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:questionsID", (req, res) => {
    database.updateQuestion(req.params) //goes everything in the params
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:questionsID", (req, res) => {
    db.query(
      `DELETE FROM questions WHERE  questionsID = $1;`, [req.params.questionsID]
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
