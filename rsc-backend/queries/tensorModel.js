const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

let model;

const init = async () => {
  model = await tf.loadLayersModel("file://./model-1a/model.json");
  model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
};
init();

// Generate synthetic data for training,
// since flow data is not available from Alberta Environment and Rivers yet
const xs = tf.tensor2d([
  [1, 2],
  [3, 4],
]);
const ys = tf.tensor2d([1, 3], [2, 1]);

const train = (xs, ys) => {
  // Train the model
  model.fit(xs, ys, { epochs: 100, verbose: false }).then(() => {
    console.log("Done training");
    model.save("file://./model-1a");
  });
};

const predict = (flow, waterLevel) => {
  // train(xs, ys);
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

const rateCurrent = (req, res) => {
  const { userRating, entries } = req.body;
  const recentEntry = entries[entries.length - 1];
  const [time, waterLevel, flow] = recentEntry;
  console.log({ waterLevel: waterLevel, flow: flow });
  try {
    const xs = tf.tensor2d([[flow, waterLevel]]);
    const ys = tf.tensor2d([userRating], [1]);
    train(xs, ys);
  } catch (error) {
    return res.status(500).send("Error recording rating: " + error);
  }
  return res.status(200).send("Rating recorded successfully");
};

module.exports = {
  getPrediction,
  rateCurrent,
};
