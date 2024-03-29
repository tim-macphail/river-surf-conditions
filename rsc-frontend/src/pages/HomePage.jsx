import { useState, useEffect } from "react";
import {
  IconButton,
  Button,
  CircularProgress,
  Rating,
  Typography,
  CssBaseline,
} from "@mui/material";
import { Box } from "@mui/system";
import { Refresh } from "@mui/icons-material";
import RatingDialogue from "../components/RatingDialogue";
import SuccessSnack from "../components/SuccessSnack";
import axios from "axios";
import {
  normalizeData,
  predictQuality,
  trainModel,
  trainingData,
} from "../logic/utils";

/**
 * Home page of the website
 * Displays live conditions and predicted rating
 *
 */
export default function LiveConditions() {
  const [entries, setEntries] = useState([]);
  const [conditions, setConditions] = useState({
    time: 0,
    waterLevel: 0,
    flow: 0,
  });
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [givingRating, setGivingRating] = useState(false);
  const [successMessage, showSuccessMessage] = useState(false);
  const [failureMessage, showFailureMessage] = useState(false);

  const handleRatingClose = (result) => {
    if (result === "success") showSuccessMessage(true);
    if (result === "failure") showFailureMessage(true);
    if (result === "cancel");

    setGivingRating(false);
  };

  const getRiverData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://rivers.alberta.ca/apps/Basins/data/figures/river/abrivers/stationdata/R_HG_05BH004_table.json"
      );
      const entries = response.data[0].data;
      setEntries(entries);
      const recentEntry = entries[entries.length - 1];
      const [unparsedTime, waterLevel, flow] = recentEntry;
      const time = new Date(Date.parse(unparsedTime));
      setConditions({
        time: time,
        waterLevel: waterLevel,
        flow: flow,
      });
      getRating(recentEntry);
      setLoading(false);
    } catch (error) {
      console.log("Caught error: " + error);
      setConditions("Error");
      setLoading(false);
    }
  };

  const getRating = async (recentEntry) => {
    const [time, waterLevel, flow] = recentEntry;
    const normalizedTrainingData = normalizeData(trainingData);

    // Train the model
    const model = await trainModel(normalizedTrainingData);

    // Make a prediction
    const prediction = predictQuality(
      model,
      parseFloat(flow),
      parseFloat(waterLevel)
    );
    setRating(prediction);
  };

  useEffect(() => {
    async function fetchData() {
      await getRiverData();
    }
    fetchData();
  }, []);

  const { time, waterLevel, flow } = conditions;
  return (
    <>
      <CssBaseline />
      {!loading && (
        <IconButton size="large" color="inherit" onClick={getRiverData}>
          <Refresh fontSize="large" />
        </IconButton>
      )}
      {loading && conditions ? (
        <CircularProgress mt={2} />
      ) : (
        <Box mb={4}>
          <Typography variant="body">
            {time &&
              `Gathered at ${
                time.getHours() > 12
                  ? (time.getHours() - 12).toString()
                  : time.getHours().toString()
              }:${time.getMinutes().toString().padStart(2, "0")} ${
                time.getHours() >= 12 ? "PM" : "AM"
              }`}
          </Typography>
          <Typography variant="h3">
            Water level: {waterLevel && waterLevel.toFixed(2)}m
          </Typography>
          <Typography variant="h3">
            Flow: {flow && flow.toFixed(2)} cms
          </Typography>
          <Typography variant="h3">
            Predicted rating: {rating && rating.toFixed(1)}
          </Typography>
          <Rating
            value={rating}
            precision={0.1}
            size="large"
            sx={{ fontSize: "4rem" }}
            readOnly
          />
        </Box>
      )}
      <Box flexDirection="row">
        <Button
          sx={{ mx: 1, my: 1 }}
          variant="outlined"
          onClick={() => setGivingRating(true)}
        >
          Rate the current conditions
        </Button>
        <Button sx={{ mx: 1, my: 1 }} variant="outlined" href="/upload">
          Upload a photo
        </Button>
        <Button sx={{ mx: 1, my: 1 }} variant="outlined" href="/photos">
          View a photo
        </Button>
      </Box>
      {givingRating && (
        <RatingDialogue
          entries={entries}
          open={givingRating}
          close={handleRatingClose}
        />
      )}
      {successMessage && (
        <SuccessSnack
          message="Response recorded"
          onClose={() => showSuccessMessage(false)}
        />
      )}
      {failureMessage && (
        <SuccessSnack
          message="Error!"
          onClose={() => showFailureMessage(false)}
        />
      )}
    </>
  );
}
