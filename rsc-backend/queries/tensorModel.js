const { mongoClient } = require("../mongoClient");
const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

let model;

const init = async () => {
  model = await tf.loadLayersModel("file://./model-1a/model.json");
  model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
};
// init();

const trainingValues = {
  flow: 7,
  waterLevel: 1.05,
  rating: 3,
};

const xs = tf.tensor2d(
  [trainingValues.flow, trainingValues.waterLevel],
  [1, 2]
);
const ys = tf.tensor2d([trainingValues.rating], [1, 1]);

const train = (xs, ys) => {
  model.fit(xs, ys, { epochs: 1000, verbose: false }).then(() => {
    console.log("Done training");
    // model.save("file://./model-1a");
  });
};

const createModel = () => {
  model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: 2 }));
  model.compile({ optimizer: "sgd", loss: "meanSquaredError" });
  train(xs, ys);
};
createModel();

const predict = (flow, waterLevel) => {
  const output = model.predict(tf.tensor2d([flow, waterLevel], [1, 2]));
  const prediction = Array.from(output.dataSync())[0];
  return prediction;
};

const getPrediction = (req, res) => {
  const { flow, waterLevel } = req.body;
  const prediction = predict(flow, waterLevel);
  if (prediction) {
    return res.status(200).send({ prediction });
  }
  return res.status(500).send("Error");
};

const rateCurrent = async (req, res) => {
  const { userRating, entries } = req.body;
  const recentEntry = entries[entries.length - 1];
  const [time, waterLevel, flow] = recentEntry;
  try {
    const db = mongoClient.db("sample_rsc");
    await db.collection("sample_ratings").insertOne({
      waterLevel,
      flow,
      userRating,
    });

    const xs = tf.tensor2d([[flow, waterLevel]]);
    const ys = tf.tensor2d([userRating], [1, 1]);
    // train(xs, ys);
  } catch (error) {
    console.log("error");
    return res.status(500).send("Error recording rating: " + error);
  }
  return res.status(200).send("Rating recorded successfully");
};

module.exports = {
  getPrediction,
  rateCurrent,
};
