const request = require("request");
const { mongoClient } = require("../mongoClient");
const url =
  "https://environment.alberta.ca/apps/Basins/data/figures/river/abrivers/stationdata/R_HG_05BH004_table.json";

// helper function to do request
function getEntries() {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        const parsedBody = JSON.parse(body)[0];
        const entries = parsedBody["data"];
        resolve({ entries });
      } else {
        reject(error);
      }
    });
  });
}

// TODO: make utilize getEntries()
const getBowRiverData = (req, res) => {
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const parsedBody = JSON.parse(body)[0];
      const entries = parsedBody["data"];
      return res.status(200).send({ entries });
    }
    return res.status(400).send("Error getting data");
  });
};

// !Testing
const clearDB = async (req, res) => {
  const rating = 4.2345; // TODO: hardcoded
  try {
    const db = mongoClient.db("sample_rsc");
    await db.collection("sample_ratings").deleteMany({});
    console.log("Successfully cleared DB");
  } catch (error) {
    console.log("Error clearing db" + error);
  }
};

const getRating = async (req, res) => {
  const rating = 4.2345; // TODO: hardcoded
  return res.status(200).send({ rating });
};

// TODO: some middleware to check if image contains a virus
const uploadPhoto = async (req, res) => {
  // New
  console.log(req.file);
  return res.status(500).send("Error occured when uploading photo");
  return;

  // Old
  const { rating, date } = req.body;
  try {
    const db = mongoClient.db("sample_rsc");
    await db.collection("sample_ratings").insertOne({
      rating: rating,
      date: date,
    });
  } catch (error) {
    return res.status(500).send("Error occured when uploading photo");
  }
  return res.status(200).send("Successfully uploaded photo");
};

const findNearest = async (req, res) => {
  const { dateStr } = req.body;
  const { entries } = await getEntries();

  const targetDate = new Date(dateStr);
  let closestEntry = entries[0];
  let closestEntryDate = new Date(closestEntry[0]);

  entries.forEach((entry) => {
    const entryDate = new Date(entry[0]);
    if (
      Math.abs(entryDate - targetDate) < Math.abs(closestEntryDate - targetDate)
    ) {
      closestEntry = entry;
      closestEntryDate = new Date(closestEntry[0]);
    }
  });
  console.log("Target: \t" + targetDate);
  console.log("Closest: \t" + closestEntryDate);
  console.log(
    "Difference is " +
      Math.abs(closestEntryDate - targetDate) / 60000 +
      " minutes"
  );
  return res.status(200).send({ closestEntry });
};

module.exports = {
  getBowRiverData,
  getRating,
  uploadPhoto,
  clearDB,
  findNearest,
};
