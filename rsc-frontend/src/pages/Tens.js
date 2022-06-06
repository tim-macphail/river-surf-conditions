import { TextField, Button, Typography, LinearProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
// import * as tfvis from "@tensorflow/tfjs-vis";

import { RiverDataset, featureDescriptions } from "../logic/data";
import * as normalization from "../logic/normalization";

/**
 * Used for testing my Tensorflow model
 * Routed at "/tens"
 */
export default function Tens() {
  const [flow, setFlow] = useState();
  const [waterLevel, setWaterLevel] = useState();
  const [prediction, setPrediction] = useState(0);
  const [status, setStatus] = useState("Waiting...");
  const [baseStatus, setBaseStatus] = useState("(Baseline Status) Waiting...");
  const [modelStatus, setModelStatus] = useState("(Model Status )Waiting...");
  const [loaded, setLoaded] = useState(0);
  const [model, setModel] = useState(null);

  const handleClick = () => {
    const reqBody = {
      flow: parseFloat(flow),
      waterLevel: parseFloat(waterLevel),
    };
    axios.post("/predict", reqBody).then((response) => {
      const { prediction } = response.data;
      setPrediction(prediction);
    });
  };

  useEffect(() => {
    const setup = async () => {
      await riverData.loadData();
      setStatus("Data loaded, converting to tensors");
      arraysToTensors();
      setStatus(
        "Data is now available as tensors.\n" + "Click a train button to begin."
      );
      // TODO Explain what baseline loss is. How it is being computed in this
      // Instance
      setBaseStatus("Estimating baseline loss");
      computeBaseline();

      const model = multiLayerPerceptronRegressionModel2Hidden();
      setModel(model);

      await run(model, "linear");
    };
    setup();
  }, []);

  /**
   * Begin TFJS example
   */

  // Some hyperparameters for model training.
  const NUM_EPOCHS = 20;
  const BATCH_SIZE = 40;
  const LEARNING_RATE = 0.01;

  const riverData = new RiverDataset();
  const tensors = {};

  // Convert loaded data into tensors and creates normalized versions of the
  // features.
  function arraysToTensors() {
    tensors.rawTrainFeatures = tf.tensor2d(riverData.trainFeatures);
    tensors.trainTarget = tf.tensor2d(riverData.trainTarget);
    tensors.rawTestFeatures = tf.tensor2d(riverData.testFeatures);
    tensors.testTarget = tf.tensor2d(riverData.testTarget);
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

  /**
   * Builds and returns Multi Layer Perceptron Regression Model
   * with 2 hidden layers, each with 10 units activated by sigmoid.
   *
   * @returns {tf.Sequential} The multi layer perceptron regression mode  l.
   */
  function multiLayerPerceptronRegressionModel2Hidden() {
    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        inputShape: [riverData.numFeatures],
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

    // model.summary();
    return model;
  }

  /**
   * Compiles `model` and trains it using the train data and runs model against
   * test data. Issues a callback to update the UI after each epcoh.
   *
   * @param {tf.Sequential} model Model to be trained.
   * @param {boolean} weightsIllustration Whether to print info about the learned
   *  weights.
   */
  async function run(model, modelName) {
    model.compile({
      optimizer: tf.train.sgd(LEARNING_RATE),
      loss: "meanSquaredError",
    });

    let trainLogs = [];
    // const container = document.querySelector(`#${modelName} .chart`);

    setStatus("Starting training process...");
    await model.fit(tensors.trainFeatures, tensors.trainTarget, {
      batchSize: BATCH_SIZE,
      epochs: NUM_EPOCHS,
      validationSplit: 0.2,
      verbose: true,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          await setModelStatus(
            `Epoch ${epoch + 1} of ${NUM_EPOCHS} completed.`,
            modelName
          );
          trainLogs.push(logs);
          setLoaded(epoch + 1);
          // tfvis.show.history(container, trainLogs, ["loss", "val_loss"]);
        },
      },
    });

    setStatus("Done!");
  }

  function computeBaseline() {
    const avgPrice = tensors.trainTarget.mean();
    const baseline = tensors.testTarget.sub(avgPrice).square().mean();
    const baselineMsg = `Baseline loss (meanSquaredError) is ${baseline
      .dataSync()[0]
      .toFixed(2)}`;
    setBaseStatus(baselineMsg);
  }

  function makePrediction() {
    const output = model.predict(tf.tensor2d([[flow, waterLevel]]));
    const prediction = Array.from(output.dataSync())[0];
    setPrediction(prediction);
    const status = `Prediction: ${prediction.toFixed(2)}`;
    setStatus(status);
  }

  /**
   * End TFJS example
   */

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress variant="determinate" value={(loaded * 100) / 20} />
      </Box>
      <Typography>{status}</Typography>
      <Typography>{baseStatus}</Typography>
      <Typography>{modelStatus}</Typography>
      <Typography variant="h3">Predict Rating</Typography>
      <TextField
        label="Flow"
        onChange={(e) => setFlow(parseFloat(e.target.value))}
        focused
      />
      <TextField
        sx={{ m: 2 }}
        label="Water Level"
        onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
        focused
      />
      <Button
        variant="contained"
        onClick={makePrediction}
        disabled={loaded !== 20}
      >
        Predict
      </Button>
      <Typography variant="h5">
        {prediction !== 0 && `Prediction: ${prediction.toFixed(3)}`}
      </Typography>
    </>
  );
}
