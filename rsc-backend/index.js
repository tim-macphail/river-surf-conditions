require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const conditions = require("./queries/conditions");
const tensorModel = require("./queries/tensorModel");
const path = require("path");
const multer = require("multer");

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

app.get("/bowRiverData", conditions.getBowRiverData);

app.post("/findNearest", conditions.findNearest);
app.post("/clearDB", conditions.clearDB);
// app.post("/uploadPhoto", upload.single("image"), conditions.uploadPhoto);
app.post("/uploadPhoto", conditions.uploadPhoto);
app.post("/predict", tensorModel.getPrediction);
app.post("/rateCurrent", tensorModel.rateCurrent);

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
