const express = require("express");
const fsPromise = require("fs/promises");
const DataBase = require("../scriptdatabase");
const validUrl = require("valid-url");
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded());
const DB = new DataBase();

// Post method
router.post("/new", checkIfExist, (req, res) => {
  const { url } = req.body;
  if (!validUrl.isUri(url)) {
    res.status(400).json({ massage: `${new Error()} Invalid URL` });
    return;
  }
  DB.addUrl(url)
    .then((newUrl) => {
      res
        .status(201)
        .json(
          `original_url: ${newUrl.originalUrl}, short_url: ${newUrl.shortUrlId}`
        );
    })
    .catch((error) => {
      res.status(500).send(`${error}`);
    });
});

//Get method
router.get("/:shorturl", checkUrlFormat, (req, res) => {
  const { shorturl } = req.params;
  DB.isExist(shorturl, "shortUrlId")
    .then((objUrl) => {
      if (!objUrl) {
        res
          .status(404)
          .json({ message: `${new Error()} Short Url Is Not Found` });
        return;
      }
      DB.updateRedirectClicks(shorturl);
      res.redirect(`${objUrl.originalUrl}`);
    })
    .catch((error) => {
      res.status(500).send(`${error}`);
    });
});

// Check if Url Is Exist middleware
function checkIfExist(req, res, next) {
  const { url } = req.body;
  DB.isExist(url, "originalUrl")
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

// Check Url Format
function checkUrlFormat(req, res, next) {
  const { shorturl } = req.params;
  Number(shorturl);
  if (shorturl.length !== 13 || /\D/.test(shorturl)) {
    res.status(400).json({ message: "ERROR: Wrong Format" });
    return;
  }
  next();
}

module.exports = { router, DB };
