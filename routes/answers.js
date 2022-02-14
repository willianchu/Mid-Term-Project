const express = require("express");
const database = require('../lib/database');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    database.getAllAlternatives()
      .then((data) => {
        const answers = data;
        res.json({ answers });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/:answersID", (req, res) => {

    // get one answer by id ? use function below
    //database.getAlternativesByAlternativeId(req.params.answersID)
    
    // getAlternativesByQuestionId() group answers by question id
    database.getAlternativesByQuestionId(req.params.answersID)
      .then((data) => {
        const id = data;
        res.json({ id });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    console.log(req);
    database.insertAlternative(req.body) // object with all the data
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:answersID", (req, res) => {
    database.updateAlternative(req.params.answersID)
      .then(() => {
        res.json({ data: "Data updated!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:answersID", (req, res) => {
    database.deleteAlternative(req.params.answersID)
      .then(() => {
        res.json({ data: "Data deleted!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
