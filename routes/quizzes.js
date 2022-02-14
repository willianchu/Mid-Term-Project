const express = require("express");
const database = require('../lib/database');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    database.getAllQuizzes()
      .then((data) => {
        const quizzes = data;
        res.json({ quizzes });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/:quizID", (req, res) => {
    console.log("quiz request",req.params.quizID);
    database.getQuizByQuizId(req.params.quizID)
      .then((data) => {
        const quizID = data;
        res.json({ quizID });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    console.log(req.body);
    database.addQuiz(req.body)
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:quizID", (req, res) => {
    database.updateQuiz(req.params)
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:quizID", (req, res) => {
    database.deleteQuiz(req.params.quizID)
      .then(() => {
        res.json({ data: "Data deleted!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};

