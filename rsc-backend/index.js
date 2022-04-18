require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const conditions = require("./queries/conditions");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();
const port = process.env.PORT || 3001;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "./rsc-frontend/build")));

app.get("/", (req, res) => {
  res.send("RSC");
});

app.get("/bowRiverData", conditions.getBowRiverData);
app.get("/rating", conditions.getRating);

app.post("/findNearest", conditions.findNearest);
app.post("/clearDB", conditions.clearDB);

app.post("/uploadPhoto", upload.single("image"), conditions.uploadPhoto);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
