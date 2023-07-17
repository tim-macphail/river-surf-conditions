import { sequential, layers, tensor2d } from "@tensorflow/tfjs";
export const flowRateMin = 50;
export const flowRateMax = 250;
export const waterLevelMin = 0.5;
export const waterLevelMax = 2;
export const ratingMin = 1;
export const ratingMax = 5;

/**
 * Converts a Date object into a string usable by an
 * <input type="datetime-local" /> component
 * @param {Date} date
 * @returns {string} dateStr
 */
export const stringify = (date) => {
  // Adjust for UTC conversion
  let adjustedDate = date;
  adjustedDate.setHours(adjustedDate.getHours() - 6); // ? depends on daylight saving time?
  let dateStr = adjustedDate.toISOString();
  // Format for html input type=datetime-local
  dateStr = dateStr.slice(0, dateStr.lastIndexOf(":"));
  return dateStr;
};

// Define the training data
export const trainingData = [
  {
    flowRate: 177,
    waterLevel: 1.5,
    qualityRating: 4.5,
  },
  {
    flowRate: 1.5549999999973223,
    waterLevel: 1.5549999999973223,
    qualityRating: 4.5,
  },
  {
    flowRate: 139.29872767273434,
    waterLevel: 1.4049999999973224,
    qualityRating: 2,
  },
  {
    flowRate: 56.73,
    waterLevel: 0.98,
    qualityRating: 4,
  },
];

// Normalize the training data
export function normalizeData(data) {
  return data.map((item) => ({
    flowRate: (item.flowRate - flowRateMin) / (flowRateMax - flowRateMin),
    waterLevel:
      (item.waterLevel - waterLevelMin) / (waterLevelMax - waterLevelMin),
    qualityRating: (item.qualityRating - ratingMin) / (ratingMax - ratingMin),
  }));
}

// Denormalize the prediction
export function denormalizePrediction(prediction) {
  const ratingMin = 1;
  const ratingMax = 5;

  return prediction * (ratingMax - ratingMin) + ratingMin;
}

// Create and train the model
export async function trainModel(data) {
  const model = sequential();
  model.add(layers.dense({ units: 8, inputShape: [2], activation: "relu" }));
  model.add(layers.dense({ units: 1, activation: "sigmoid" }));

  const xs = tensor2d(data.map((item) => [item.flowRate, item.waterLevel]));
  const ys = tensor2d(data.map((item) => [item.qualityRating]));

  await model.compile({ optimizer: "adam", loss: "meanSquaredError" });
  await model.fit(xs, ys, { epochs: 100 });

  return model;
}

// Normalize input data and make a prediction
export function predictQuality(model, flowRate, waterLevel) {
  const normalizedFlowRate =
    (flowRate - flowRateMin) / (flowRateMax - flowRateMin);
  const normalizedWaterLevel =
    (waterLevel - waterLevelMin) / (waterLevelMax - waterLevelMin);

  const input = tensor2d([[normalizedFlowRate, normalizedWaterLevel]]);
  const prediction = model.predict(input).dataSync()[0];
  const denormalizedPrediction = denormalizePrediction(prediction);

  return denormalizedPrediction;
}

// Update the model with additional training data
export async function updateModel(model, flowRate, waterLevel, rating) {
  const normalizedFlowRate = (flowRate - 50) / (250 - 50);
  const normalizedWaterLevel = (waterLevel - 0.5) / (2 - 0.5);
  const normalizedRating = (rating - 1) / (5 - 1);

  const xs = tensor2d([[normalizedFlowRate, normalizedWaterLevel]]);
  const ys = tensor2d([[normalizedRating]]);

  await model.fit(xs, ys, { epochs: 10 });

  return model;
}
