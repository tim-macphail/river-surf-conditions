import {
  Alert,
  Box,
  Button,
  Input,
  Rating,
  Typography,
  Snackbar,
} from "@mui/material";

import { uniformStyle } from "../styles/styles";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UploadPage() {
  const [entries, setEntries] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [photoDate, setPhotoDate] = useState();
  const [userRating, setUserRating] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [imageURL, setImageURL] = useState();
  const [uploading, setUploading] = useState(false);
  const [ratingGiven, setRatingGiven] = useState(false);
  const [closestEntry, setClosestEntry] = useState({
    time: new Date(),
    waterLevel: 0.0,
    flow: 0.0,
  });

  const getRiverData = async () => {
    try {
      const response = await axios.get("/bowRiverData");
      const { entries } = response.data;
      return entries;
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  const stringify = (date) => {
    // Adjust for UTC conversion
    let adjustedDate = date;
    adjustedDate.setHours(adjustedDate.getHours() - 6); // ? depends on daylight saving time?
    let dateStr = adjustedDate.toISOString();
    // Format for html input type=datetime-local
    dateStr = dateStr.slice(0, dateStr.lastIndexOf(":"));
    return dateStr;
  };

  // select a file from the file system
  const fileSelectedHandler = (event) => {
    const file = event.target.files[0];
    const photoDate = stringify(file.lastModifiedDate);
    setPhotoDate(photoDate);
    setSelectedFile(file);
    setImageURL(URL.createObjectURL(file));
    findNearest(photoDate);
  };

  const findNearest = async (dateStr) => {
    const reqBody = {
      entries: entries,
      dateStr: dateStr,
    };
    try {
      const response = await axios.post("/findNearest", reqBody);
      const [time, waterLevel, flow] = response.data.closestEntry;

      setClosestEntry({
        time: time,
        waterLevel: waterLevel,
        flow: flow,
      });
    } catch (error) {
      console.log("Error finding nearest: " + error);
    }
  };

  // upload the selected file to the db
  const fileUploadHandler = async () => {
    const fd = new FormData();
    fd.append("image", selectedFile, selectedFile.name, {
      onUploadProgress: (progressEvent) => {
        console.log(
          "Upload Progress: " +
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            "%"
        );
      },
    });
    fd.append("date", photoDate);
    fd.append("userRating", userRating);
    try {
      setUploading(true);
      await axios.post("/uploadPhoto", fd);
      setSelectedFile(null);
      setUserRating(0);
      setToastOpen(true);
      setPhotoDate(null);
      setUploading(false);
    } catch (error) {
      console.log("Error uploading photo " + error);
      setUploading(false);
    }
  };

  useEffect(() => {
    getRiverData().then((entries) => {
      setEntries(entries);
    });
  }, []);

  return (
    <Box sx={uniformStyle}>
      <Button href="/">Home</Button>
      {selectedFile && (
        <>
          <Box
            component="img"
            sx={{
              width: 350,
              border: 5,
              borderRadius: 5,
            }}
            alt="uploaded"
            src={imageURL}
          />
          <Typography variant="caption">
            Flow: {closestEntry.flow}, water level:{" "}
            {closestEntry.waterLevel.toFixed(2)}
          </Typography>
          <Input
            sx={{ color: "white" }}
            type="datetime-local"
            onChange={(e) => {
              setPhotoDate(e.target.value);
              findNearest(e.target.value);
            }}
            inputProps={{
              max: `${stringify(new Date())}`,
              min: `${stringify(new Date(entries[0][0]))}`,
            }} // TODO: time max not applying, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#validation about validation
            value={photoDate}
            readOnly={!selectedFile}
          />
          <Typography mt={2} component="legend">
            Rating
          </Typography>
          <Rating
            name="simple-controlled"
            value={userRating}
            precision={0.5}
            onChange={(event, newValue) => {
              setUserRating(newValue);
              setRatingGiven(true);
            }}
            readOnly={!selectedFile}
            sx={{
              "& .MuiRating-icon": {
                color: "#faaf00",
              },
            }}
          />
        </>
      )}
      <Button component="label">
        {selectedFile ? "Change file" : "upload file"}
        <input
          onChange={fileSelectedHandler}
          type="file"
          accept="image/*"
          hidden
        />
      </Button>
      {selectedFile && selectedFile.name}
      <Button
        onClick={fileUploadHandler}
        disabled={!selectedFile || !ratingGiven || uploading}
        variant="outlined"
      >
        Submit
      </Button>
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => {
          setToastOpen(false);
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        // key={"bottom" + "center"}
      >
        <Alert
          severity="success"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          Image uploaded successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
