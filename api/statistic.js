const express = require("express");
const fsPromise = require("fs/promises");
const DataBase = require("../script");
const DB = new DataBase();

const router = express.Router();

router.get("/:shorturlId", (req, res) => {
  const { shorturlId } = req.params;
  DB.isExist(shorturlId, "shortUrlId")
    .then((statistic) => {
      if (!statistic) {
        res
          .status(404)
          .json({ message: `${new Error()} Short Url Does Not Exist` });
      }
      const data = [];
      data.push(statistic);
      res.status(200).render("statistic", { datas: data });
    })
    .catch((error) => {
      res.status(500).send(`${error}`);
    });
});

router.get("/", (req, res) => {
  fsPromise
    .readFile("./database/database.json")
    .then((data) => {
      res.status(200).render("statistic", { datas: JSON.parse(data) });
    })
    .catch((error) => {
      res.status(500).send(`${error}`);
    });
});

module.exports = router;
