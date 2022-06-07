import * as tf from "@tensorflow/tfjs";

/**
 * Builds and returns Linear Regression Model.
 *
 * @returns {tf.Sequential} The linear regression model.
 */
export function linearRegressionModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [2], units: 1 }));

  return model;
}

/**
 * Builds and returns Multi Layer Perceptron Regression Model
 * with 1 hidden layer, each with 10 units activated by sigmoid.
 *
 * @returns {tf.Sequential} The multi layer perceptron regression model.
 */
export function multiLayerPerceptronRegressionModel1Hidden() {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [2],
      units: 50,
      activation: "sigmoid",
      kernelInitializer: "leCunNormal",
    })
  );
  model.add(tf.layers.dense({ units: 1 }));

  return model;
}

/**
 * Builds and returns Multi Layer Perceptron Regression Model
 * with 2 hidden layers, each with 10 units activated by sigmoid.
 *
 * @returns {tf.Sequential} The multi layer perceptron regression model.
 */
export function multiLayerPerceptronRegressionModel2Hidden() {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [2],
      units: 50,
      activation: "sigmoid",
      kernelInitializer: "leCunNormal",
    })
  );
  model.add(
    tf.layers.dense({
      units: 50,
      activation: "sigmoid",
      kernelInitializer: "leCunNormal",
    })
  );
  model.add(tf.layers.dense({ units: 1 }));

  return model;
}
