import { useState, useEffect } from "react";
import {
  IconButton,
  Button,
  CircularProgress,
  Rating,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Refresh } from "@mui/icons-material";
import RatingDialogue from "../components/RatingDialogue";
import SuccessSnack from "../components/SuccessSnack";
import { uniformStyle } from "../styles/styles";
const axios = require("axios");

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
  const [rating, setRating] = useState(4.3);
  const [loading, setLoading] = useState(true);
  const [givingRating, setGivingRating] = useState(false);
  const [successMessage, showSuccessMessage] = useState(false);

  const handleRatingClose = (result) => {
    showSuccessMessage(result);
    setGivingRating(false);
  };

  const getRiverData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/bowRiverData");
      const { entries } = response.data;
      setEntries(entries);
      const recentEntry = entries[entries.length - 1];
      const [time, waterLevel, flow] = recentEntry;
      const entryTime = new Date(Date.parse(time));
      setConditions({
        time: entryTime,
        waterLevel: waterLevel,
        flow: 91.3574543, // TODO: hardcoded
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setConditions("Error");
      setLoading(false);
    }
  };

  const getRating = async () => {
    const recentEntry = entries[entries.length - 1];
    const [time, waterLevel, flow] = recentEntry;
    const reqBody = {
      flow: flow,
      waterLevel: waterLevel,
    };
    try {
      const response = await axios.post("/predict", reqBody);
      setRating(response.data.rating);
      console.log(response.data.rating);
    } catch (error) {
      console.log(error);
    }
  };

  const giveRating = () => {
    setGivingRating(true);
  };

  useEffect(() => {
    getRiverData();
    getRating();
  }, []);

  const { time, waterLevel, flow } = conditions;
  return (
    <Box sx={uniformStyle}>
      {!loading && (
        <IconButton size="large" color="inherit" onClick={getRiverData}>
          <Refresh fontSize="large" />
        </IconButton>
      )}
      {loading && conditions ? (
        <CircularProgress mt={2} mb={2} />
      ) : (
        <Box mt={4} mb={4}>
          <Typography variant="body">
            {`Gathered at ${
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
        <Button sx={{ mx: 1 }} variant="outlined" href="/upload">
          Upload a photo
        </Button>
        <Button sx={{ mx: 1 }} variant="outlined" onClick={giveRating}>
          {givingRating ? "choose a rating" : "Rate the current conditions"}
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
    </Box>
  );
}