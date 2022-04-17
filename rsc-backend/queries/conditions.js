const request = require("request");
const { mongoClient } = require("../mongoClient");

const getBowRiverData = (req, res) => {
  request(
    "https://environment.alberta.ca/apps/Basins/data/figures/river/abrivers/stationdata/R_HG_05BH004_table.json",
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const parsedBody = JSON.parse(body)[0];
        const entries = parsedBody["data"];
        return res.status(200).send({ entries });
      }
      return res.status(400).send("Error getting data");
    }
  );
};

const clearDB = async (req, res) => {
  const rating = 4.2345; // TODO: hardcoded
  // !Testing
  try {
    const db = mongoClient.db("sample_rsc");
    await db.collection("sample_ratings").deleteMany({});
    console.log("deleted many");
  } catch (error) {
    console.log(error);
  }
};

const getRating = async (req, res) => {
  const rating = 4.2345; // TODO: hardcoded
  return res.status(200).send({ rating });
};

const setRating = async (req, res) => {
  const { rating, date } = req.body;
  console.log(rating);
  console.log(date);
  try {
    const db = mongoClient.db("sample_rsc");
    await db.collection("sample_ratings").insertOne({
      rating: rating,
      date: date,
    });
  } catch (error) {
    return res.status(500).send("Error occured when adding rating");
  }
  return res.status(200).send("Successfully added rating");
};

module.exports = {
  getBowRiverData,
  getRating,
  setRating,
  clearDB,
};
