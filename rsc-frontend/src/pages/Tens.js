import { TextField, Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import axios from "axios";

export default function Tens() {
  const [flow, setFlow] = useState();
  const [waterLevel, setWaterLevel] = useState();
  const [prediction, setPrediction] = useState(0);

  const handleClick = () => {
    const reqBody = {
      flow: parseInt(flow),
      waterLevel: parseInt(waterLevel),
    };
    axios.post("/predict", reqBody).then((response) => {
      const { prediction } = response.data;
      setPrediction(prediction);
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        "& .MuiTextField-root": { mb: 4 },
      }}
    >
      <Typography variant="h1">Predict Rating</Typography>
      <TextField
        label="Flow"
        onChange={(e) => setFlow(e.target.value)}
        focused
      />
      <TextField
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
    </Box>
  );
}
