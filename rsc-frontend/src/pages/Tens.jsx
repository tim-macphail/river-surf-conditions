import { TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import {
  normalizeData,
  predictQuality,
  trainModel,
  trainingData,
} from "../logic/utils";

/**
 * Used for testing my Tensorflow model
 * Routed at "/tens"
 */
export default function Tens() {
  const [flow, setFlow] = useState();
  const [waterLevel, setWaterLevel] = useState();
  const [prediction, setPrediction] = useState(0);

  const handleClick = async () => {
    // Normalize the training data
    const normalizedTrainingData = normalizeData(trainingData);

    // Train the model
    const model = await trainModel(normalizedTrainingData);

    // Make a prediction
    const prediction = predictQuality(
      model,
      parseFloat(flow),
      parseFloat(waterLevel)
    );
    setPrediction(prediction);
  };

  return (
    <>
      <Typography variant="h3">Predict Rating</Typography>
      <TextField
        label="Flow"
        onChange={(e) => setFlow(e.target.value)}
        focused
      />
      <TextField
        sx={{ m: 2 }}
        label="Water Level"
        onChange={(e) => setWaterLevel(e.target.value)}
        focused
      />
      <Button variant="contained" onClick={handleClick}>
        Predict
      </Button>
      <Typography variant="h5">
        {prediction !== 0 && `Prediction: ${prediction.toFixed(3)}`}
      </Typography>
    </>
  );
}
