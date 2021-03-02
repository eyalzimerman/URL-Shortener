const { Router } = require("express");
const shorturl = require("./shorturl");
const statistic = require("./statistic");

const api = Router();

api.use("/shorturl", shorturl);
api.use("/statistic", statistic);
api.use("*", (req, res) => {
  res.status(404).send({ message: "Page Not Found" });
});

module.exports = api;
