require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const api = require("./api");
const path = require("path");
const pug = require("pug");

app.use(cors());

app.use("/api", api);

app.use("/public", express.static(`./public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "pug");

module.exports = app;
