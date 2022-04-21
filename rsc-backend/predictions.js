// const tf = require("@tensorflow/tfjs");
// require("@tensorflow/tfjs-node");

// const model = tf.sequential();
// // const model = await tf.loadLayersModel("./assets/model.json");
// model.add(tf.layers.dense({ units: 1, inputShape: [2] }));
// model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

// // Generate synthetic data for training
// const xs = tf.tensor2d([
//   [1, 2],
//   [3, 4],
// ]);
// const ys = tf.tensor2d([1, 3], [2, 1]);

// const train = (xs, ys) => {
//   // Train the model
//   model.fit(xs, ys, { epochs: 1000, verbose: false }).then(() => {
//     console.log("Done training");
//     try {
//       const saveResult = model.save("file:///model");
//     } catch (error) {
//       console.log("Error saving model");
//     }
//     console.log(saveResult);
//   });
// };

// const predict = (flow, waterLevel) => {
//   train(xs, ys);
//   console.log({ flow: flow, waterLevel: waterLevel });
//   const output = model.predict(tf.tensor2d([flow, waterLevel], [1, 2]));
//   const prediction = Array.from(output.dataSync())[0];
//   console.log(prediction);
//   return prediction;
// };

// const getPrediction = (req, res) => {
//   const { flow, waterLevel } = req.body;
//   const prediction = predict(flow, waterLevel);
//   if (prediction) {
//     return res.status(200).send({ prediction });
//   }
//   return res.status(500).send("Error");
// };

// module.exports = {
//   getPrediction,
// };

const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

const model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

const getPrediction = () => {
  model.save("file://./model-1a");
};

module.exports = {
  getPrediction,
};
