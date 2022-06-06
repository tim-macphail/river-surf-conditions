/** Helper class to handle loading training and test data. */
export class RiverDataset {
  constructor() {
    // Arrays to hold the data.
    this.trainFeatures = null;
    this.trainTarget = null;
    this.testFeatures = null;
    this.testTarget = null;
  }

  get numFeatures() {
    // If numFetures is accessed before the data is loaded, raise an error.
    if (this.trainFeatures == null) {
      throw new Error("'loadData()' must be called before numFeatures");
    }
    return this.trainFeatures[0].length;
  }

  /** Loads training and test data. */
  // TODO: hardcoded
  async loadData() {
    this.trainFeatures = [
      [90, 1],
      [80, 1],
      [70, 1],
      [60, 1],
      [50, 1],
    ];
    this.trainTarget = [[5], [4], [3], [2], [1]];
    this.testFeatures = [
      // [91, 1],
      // [81, 1],
      // [71, 1],
      // [61, 1],
      [51, 1],
    ];
    this.testTarget = [
      // [50],
      // [40],
      // [30],
      // [20],
      [10],
    ];

    shuffle(this.trainFeatures, this.trainTarget);
    shuffle(this.testFeatures, this.testTarget);
  }
}

export const featureDescriptions = ["flow", "water level"];

/**
 * Shuffles data and target (maintaining alignment) using Fisher-Yates
 * algorithm.flab
 */
function shuffle(data, target) {
  let counter = data.length;
  let temp = 0;
  let index = 0;
  while (counter > 0) {
    index = (Math.random() * counter) | 0;
    counter--;
    // data:
    temp = data[counter];
    data[counter] = data[index];
    data[index] = temp;
    // target:
    temp = target[counter];
    target[counter] = target[index];
    target[index] = temp;
  }
}
