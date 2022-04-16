import { useState, useEffect } from "react";
import { Button, CircularProgress, Rating, Typography } from "@mui/material";
import { Box } from "@mui/system";
import MyModal from "./MyModal";
const axios = require("axios");

export default function MyComponent() {
  const [conditions, setConditions] = useState({
    time: 0,
    waterLevel: 0,
    flow: 0,
  });
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(false);

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

  useEffect(() => {
    getRiverData();
    getRating();
  }, []);

  return (
    <>
      <Button variant="contained" onClick={getRiverData}>
        {loading ? "Loading..." : "Refresh"}
      </Button>
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
            precision={0.5}
            size="large"
            sx={{ fontSize: "4rem" }}
            readOnly
          />
        </Box>
      )}
      <Button variant="outlined" onClick={() => setPopup(!popup)}>
        Upload
      </Button>
      {popup && <MyModal open={popup} submit={() => setPopup(false)} />}
    </>
  );
}
