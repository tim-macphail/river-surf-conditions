require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const conditions = require("./queries/conditions");
const predictions = require("./predictions");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, false);
  else cb(new Error("File not of correct type"), true);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  // fileFilter: fileFilter,
});

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

app.post("/predict", predictions.getPrediction);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
