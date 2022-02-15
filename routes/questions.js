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
    database.getQuestionsByQuizId(req.params.id)
      .then((data) => {
        const question = data;
        res.json({ question });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
<<<<<<< HEAD
    console.log(req);
    database.insertQuestion(req.body)
=======
    const {question, url_picture_link, quiz_id } = req.body;
    db.query(
      `INSERT INTO questions(question, url_picture_link, quiz_id)
    VALUES ($1, $2, $3);`, [question, url_picture_link, quiz_id]
    )
>>>>>>> 59d3b65ff29bc4f5cd9f5eef230a1f6b21fd03ee
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:id", (req, res) => {
    const {question, url_picture_link, quiz_id} = req.body;
    database.updateQuestion(req.params) //goes everything in the params
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id", (req, res) => {
    database.deleteQuestion(req.params.id)
      .then(() => {
        res.json({ data: "Data deleted!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
