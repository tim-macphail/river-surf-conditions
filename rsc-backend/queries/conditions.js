/**
 * Handles requests to get the current conditions
 */

const request = require("request");
const { mongoClient } = require("../mongoClient");
const riversUrl =
  "https://environment.alberta.ca/apps/Basins/data/figures/river/abrivers/stationdata/R_HG_05BH004_table.json";

// helper function to do request
function getEntries() {
  return new Promise(function (resolve, reject) {
    request(riversUrl, function (error, res, body) {
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

/**
 * @param {*} req
 * @param {*} res
 * @returns {Array} entries
 */
// TODO: make utilize getEntries()
const getBowRiverData = (req, res) => {
  request(riversUrl, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const parsedBody = JSON.parse(body)[0];
      const entries = parsedBody["data"];
      return res.status(200).send({ entries });
    }
    return res.status(400).send("Error getting data");
  });
};

/**
 * For testing purposes only,
 * removes all entries from sample_rsc.sample_ratings
 * @param {*} req
 * @param {*} res
 */
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

/**
 * Uploads a photo with a date and a rating to the DB
 * @param {*} req
 * @param {*} res
 * @returns
 */
// TODO: some middleware to check if image contains a virus
const uploadPhoto = async (req, res) => {
  const photo = req.file;
  const { date, userRating } = req.body;

  try {
    const db = mongoClient.db("sample_rsc");
    await db.collection("sample_ratings").insertOne({
      rating: userRating,
      date: date,
      photo: photo,
    });
  } catch (error) {
    return res.status(500).send("Error occured when uploading photo");
  }
  return res.status(200).send("Successfully uploaded photo");
};

/**
 * Finds the nearest entry to a given date
 * @param {*} req
 * @param {*} res
 * @returns
 */
const findNearest = async (req, res) => {
  const { dateStr, entries } = req.body;

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
  const diffMins = Math.abs(closestEntryDate - targetDate) / 60000;
  return res.status(200).send({ closestEntry, diffMins });
};

module.exports = {
  getBowRiverData,
  uploadPhoto,
  clearDB,
  findNearest,
};
