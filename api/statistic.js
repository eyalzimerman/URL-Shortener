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
      res.status(200).json(statistic);
    })
    .catch((error) => {
      res.status(500).send(`${error}`);
    });
});

module.exports = router;
