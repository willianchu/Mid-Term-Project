const express = require("express");
const database = require('../lib/database');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    database.getAllAlternatives()
      .then((data) => {
        const alternatives = data;
        res.json({ alternatives });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/:id", (req, res) => {
    database.getAlternativesByAlternativeId(req.params.id)
      .then((data) => {
        const alternative = data;
        res.json({ alternative });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.post("/", (req, res) => {
    database.insertAlternative(req.body)
      .then(() => {
        res.json({ data: "Data created!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.put("/:id", (req, res) => {
    database.updateAlternative(req.params.id, req.body)
      .then((data) => {
        res.json({ alternative: data.rows[0] });
        //come back to this
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id", (req, res) => {
    database.deleteAlternative(req.params.id)
      .then(() => {
        res.json({ data: "Data deleted!" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router
};
