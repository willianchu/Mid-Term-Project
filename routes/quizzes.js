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
  router.get("/:id", (req, res) => {
    database.getQuizByQuizId(req.params.id)
      .then((data) => {
        const quiz = data;
        res.json({ quiz });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    const {
      title,
      description,
      cut_note,
      time_limit,
      url_quiz_image,
      owner_id,
    } = req.body;
    database.addQuiz(req.body)
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:id", (req, res) => {
    database.updateQuiz(req.body) //goes everything in the params (id)
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id", (req, res) => {
    database.deleteQuiz(req.params.id)
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
