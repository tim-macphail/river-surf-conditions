import * as normalization from "./normalization";

const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");

// const xs = tf.tensor2d([flow, waterLevel], [1, 2]);
// const ys = tf.tensor2d([rating], [1, 1]);

tensors = {};

trainFeatures = [
  [90, 1],
  [80, 1],
  [70, 1],
  [60, 1],
  [50, 1],
];
trainTarget = [5, 4, 3, 2, 1];

testFeatures = [
  [91, 1],
  [81, 1],
  [71, 1],
  [61, 1],
  [51, 1],
];
testTarget = [5, 4, 3, 2, 1];

function arraysToTensors() {
  tensors.rawTrainFeatures = tf.tensor2d(trainFeatures);
  tensors.trainTarget = tf.tensor2d(trainTarget);
  tensors.rawTestFeatures = tf.tensor2d(testFeatures);
  tensors.testTarget = tf.tensor2d(testTarget);
  // Normalize mean and standard deviation of data.
  let { dataMean, dataStd } = normalization.determineMeanAndStddev(
    tensors.rawTrainFeatures
  );

  tensors.trainFeatures = normalization.normalizeTensor(
    tensors.rawTrainFeatures,
    dataMean,
    dataStd
  );
  tensors.testFeatures = normalization.normalizeTensor(
    tensors.rawTestFeatures,
    dataMean,
    dataStd
  );
}

arraysToTensors();
