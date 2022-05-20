const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

// Arguments: <training flow> <training waterLevel> <training rating>, <flow to predict> <waterLevel to predict>
const trainingValues = process.argv.slice(2, 5).map((s) => parseFloat(s));
const predictionValues = process.argv.slice(5, 7).map((s) => parseFloat(s));

const train = async (flow, waterLevel, rating) => {
  const xs = tf.tensor2d([flow, waterLevel], [1, 2]);
  const ys = tf.tensor2d([rating], [1, 1]);

  await model.fit(xs, ys, { epochs: 1000, verbose: false }).then(() => {
    console.log("Done training");
  });
};

const predict = (flow, waterLevel) => {
  const output = model.predict(tf.tensor2d([flow, waterLevel], [1, 2]));
  const prediction = Array.from(output.dataSync())[0];
  console.log(prediction);
};

function main() {
  model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: 2 }));
  model.compile({ optimizer: "sgd", loss: "meanSquaredError" });

  train(...trainingValues).then(() => predict(...predictionValues));
}

main();
