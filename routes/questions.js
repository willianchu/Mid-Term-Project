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
  router.get("/:id", (req, res) => {
    //getQuizCorrectAlternatives(req.params.id) //this version only returns the correct alternatives for each question of the quiz.id
    database.getQuestionsByQuizId(req.params.id) // it's a quiz id
      .then((data) => { // retrieves all questions with all alternatives for a quiz
        const question = data;
        res.json({ question });
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
  router.put("/:id", (req, res) => {
    database.updateQuestion(req.params.id, req.body)
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id", (req, res) => {
    database.deleteQuestion(req.params.id)
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
