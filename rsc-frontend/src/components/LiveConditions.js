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
import UploadModal from "./UploadModal";
import RatingDialogue from "./RatingDialogue";
import SuccessSnack from "./SuccessSnack";
const axios = require("axios");

export default function LiveConditions() {
  const [conditions, setConditions] = useState({
    time: 0,
    waterLevel: 0,
    flow: 0,
  });
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(false);
  const [oldestEntry, setOldestEntry] = useState();
  const [givingRating, setGivingRating] = useState(false);
  const [successMessage, showSuccessMessage] = useState(false);

  const handleRatingClose = (result) => {
    showSuccessMessage(result);
    setGivingRating(false);
    // showSuccessMessage(false);
  };

  const getRiverData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/bowRiverData");
      const recentEntry =
        response.data.entries[response.data.entries.length - 1];
      const [time, waterLevel, flow] = recentEntry;
      const msec = Date.parse(time);
      const entryTime = new Date(msec);
      setConditions({
        time: `${
          entryTime.getHours() > 12
            ? (entryTime.getHours() - 12).toString()
            : entryTime.getHours().toString()
        }:${entryTime.getMinutes().toString().padStart(2, "0")} ${
          entryTime.getHours() >= 12 ? "PM" : "AM"
        }`,
        waterLevel: waterLevel,
        flow: 91.3574543, // TODO: hardcoded
      });
      setLoading(false);
      setOldestEntry(response.data.entries[0][0]);
    } catch (error) {
      console.log(error);
      setConditions("Error");
      setLoading(false);
    }
  };

  const getRating = async () => {
    const response = await axios.get("/rating");
    setRating(response.data.rating);
  };

  const giveRating = () => {
    setGivingRating(true);
  };

  useEffect(() => {
    getRiverData();
    getRating();
  }, []);

  return (
    <>
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
            Gathered at {conditions["time"]}
          </Typography>
          <Typography variant="h3">
            Water level: {conditions["waterLevel"].toFixed(2)}m
          </Typography>
          <Typography variant="h3">
            Flow: {conditions["flow"].toFixed(2)} cms
          </Typography>
          <Typography variant="h3">
            Predicted rating: {rating.toFixed(1)}
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
          sx={{ mx: 1 }}
          variant="outlined"
          onClick={() => setPopup(!popup)}
        >
          Upload a photo
        </Button>
        <Button sx={{ mx: 1 }} variant="outlined" onClick={giveRating}>
          {givingRating ? "choose a rating" : "Rate the current conditions"}
        </Button>
      </Box>
      {popup && (
        <UploadModal
          open={popup}
          close={() => setPopup(false)}
          oldestEntry={oldestEntry}
        />
      )}
      {givingRating && (
        <RatingDialogue open={givingRating} close={handleRatingClose} />
      )}
      {successMessage && (
        <SuccessSnack
          message="Response recorded"
          onClose={() => showSuccessMessage(false)}
        />
      )}
    </>
  );
}
