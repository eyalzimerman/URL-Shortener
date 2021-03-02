const { DH_UNABLE_TO_CHECK_GENERATOR } = require("constants");
const express = require("express");
const fs = require("fs");
const DataBase = require("../scriptdatabase");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded());
const DB = new DataBase();

router.post("/new", (req, res) => {
  const { url } = req.body;
  DB.addUrl(url);
  res.status(200).json({ original_url: `${url}`, shorturl: "1" });
});

module.exports = router;
