const express = require("express");
const fsPromise = require("fs/promises");
const DataBase = require("../scriptdatabase");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded());
const DB = new DataBase();

// Post method
router.post("/new", checkIfExist, (req, res) => {
  const { url } = req.body;
  DB.addUrl(url).then((newUrl) => {
    res
      .status(200)
      .json(
        `original_url: ${newUrl.originalUrl}, short_url: ${newUrl.shortUrlId}`
      );
  });
});

//Get method
router.get("/:shorturl", (req, res) => {
  const { shorturl } = req.params;
  DB.findOriginalUrl(shorturl).then((objUrl) => {
    objUrl.redirectCount++;
    res.redirect(`${objUrl.originalUrl}`);
  });
});

// Check if Url Is Exist middleware
function checkIfExist(req, res, next) {
  const { url } = req.body;
  DB.isExist(url)
    .then((data) => {
      if (data) {
        res.status(200).json(data);
        return;
      }
      throw new Error();
    })
    .catch((e) => {
      next();
    });
}

module.exports = router;
