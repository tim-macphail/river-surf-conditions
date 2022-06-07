import { TextField, Button, Typography, LinearProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";

import { RiverDataset, featureDescriptions } from "../logic/data";
import * as normalization from "../logic/normalization";
import * as models from "../logic/models";

/**
 * Used for testing my Tensorflow model
 * Routed at "/tens"
 */
export default function Tens() {
  const [flow, setFlow] = useState();
  const [waterLevel, setWaterLevel] = useState();
  const [prediction, setPrediction] = useState(0);
  const [status, setStatus] = useState("loading...");
  const [modelStatus, setModelStatus] = useState("(Model Status )loading...");
  const [loaded, setLoaded] = useState(0);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const setup = async () => {
      riverData.loadData();
      arraysToTensors();
      const model = models.linearRegressionModel();
      setModel(model);

      await run(model);
    };
    setup();
  }, []);

  // Some hyperparameters for model training.
  const NUM_EPOCHS = 1;
  const BATCH_SIZE = 1;
  const LEARNING_RATE = 0.01;

  const riverData = new RiverDataset();
  const tensors = {};

  // Convert loaded data into tensors and creates normalized versions of the
  // features.
  function arraysToTensors() {
    tensors.rawTrainFeatures = tf.tensor2d(riverData.trainFeatures);
    tensors.trainTarget = tf.tensor2d(riverData.trainTarget);
    // Normalize mean and standard deviation of data.
    let { dataMean, dataStd } = normalization.determineMeanAndStddev(
      tensors.rawTrainFeatures
    );
    // console.log(Array.from(dataMean.dataSync())[0]);
    console.log(Array.from(tensors.rawTrainFeatures.dataSync()));
    // console.log(Array.from(dataStd.dataSync())[0]);

    tensors.trainFeatures = normalization.normalizeTensor(
      tensors.rawTrainFeatures,
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

    return model;
  }

  /**
   * Compiles `model` and trains it using the train data and runs model against
   * test data. Issues a callback to update the UI after each epcoh.
   *
   * @param {tf.Sequential} model Model to be trained.
   */
  async function run(model) {
    model.compile({
      optimizer: tf.train.sgd(LEARNING_RATE),
      loss: "meanSquaredError",
    });

    let trainLogs = [];

    setStatus("Training...");
    await model.fit(tensors.trainFeatures, tensors.trainTarget, {
      batchSize: BATCH_SIZE,
      epochs: NUM_EPOCHS,
      validationSplit: 0.2,
      verbose: true,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          setModelStatus(`Epoch ${epoch + 1} of ${NUM_EPOCHS} completed.`);
          trainLogs.push(logs);
          setLoaded(epoch + 1);
        },
      },
    });

    setStatus("Done!");
  }

  function makePrediction() {
    const output = model.predict(tf.tensor2d([[flow, waterLevel]]));
    const prediction = Array.from(output.dataSync())[0];
    setPrediction(prediction);
  }

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={(loaded * 100) / NUM_EPOCHS}
        />
      </Box>
      <Typography>{status}</Typography>
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
        disabled={loaded !== NUM_EPOCHS}
      >
        Predict
      </Button>
      <Typography variant="h5">
        {prediction !== 0 && `Prediction: ${prediction.toFixed(3)}`}
      </Typography>
    </>
  );
}
