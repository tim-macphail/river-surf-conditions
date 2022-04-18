import {
  Modal,
  Alert,
  Box,
  Button,
  Input,
  Rating,
  Typography,
  Grid,
  Snackbar,
} from "@mui/material";

import { useState } from "react";
import axios from "axios";

export default function UploadModal(props) {
  const [selectedFile, setSelectedFile] = useState();
  const [photoDate, setPhotoDate] = useState();
  const [userRating, setUserRating] = useState(0);
  const [toastOpen, setToastOpen] = useState(false);
  const [imageURL, setImageURL] = useState();
  const [uploading, setUploading] = useState(false);
  const [ratingGiven, setRatingGiven] = useState(false);
  const [closestEntry, setClosestEntry] = useState({
    time: new Date(),
    waterLevel: 1.69,
    flow: 69.69,
  });

  // select a file from the file system
  const fileSelectedHandler = (event) => {
    const file = event.target.files[0];
    let adjustedDate = file.lastModifiedDate;
    adjustedDate.setHours(adjustedDate.getHours() - 6);
    const dateStr = adjustedDate.toISOString();
    const photoDate = dateStr.slice(0, dateStr.lastIndexOf(":"));
    setPhotoDate(photoDate);
    setSelectedFile(file);
    setImageURL(URL.createObjectURL(file));

    findNearest(photoDate);
  };

  const findNearest = async (dateStr) => {
    const reqBody = {
      dateStr: dateStr,
    };
    try {
      const response = await axios.post("/findNearest", reqBody);
      console.log("Response: " + response.data.closestEntry);
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
    // const fd = new FormData();
    // fd.append("image", selectedFile, selectedFile.name, {
    //   onUploadProgress: (progressEvent) => {
    //     console.log(
    //       "Upload Progress: " +
    //         Math.round((progressEvent.loaded / progressEvent.total) * 100) +
    //         "%"
    //     );
    //   },
    // });
    // fd.append("date", photoDate);
    // fd.append("userRating", userRating);
    // axios.post("/uploadImage", fd);
    /*
      for now we just post a rating of 4 into the db
    */
    const reqBody = { rating: userRating, date: photoDate };

    try {
      setUploading(true);
      await axios.post("/uploadPhoto", reqBody);
      setSelectedFile(null);
      setUserRating(0);
      setToastOpen(true);
      setPhotoDate(null);
      setUploading(false);
    } catch (error) {
      console.log("Error uploading photo " + error);
    }
  };

  const stringify = (date) => {
    // Adjust for UTC conversion
    let adjustedDate = date;
    adjustedDate.setHours(adjustedDate.getHours() - 6); // depends on daylight saving time?
    let dateStr = adjustedDate.toISOString();
    dateStr = dateStr.slice(0, dateStr.lastIndexOf(":"));
    return dateStr;
  };

  const oldest = stringify(new Date(props.oldestEntry));
  const today = stringify(new Date());

  const popupStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "70%",
    bgcolor: "background.paper",
    borderRadius: 10,
    boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "column",
  };

  return (
    <Modal open={props.open}>
      <Box sx={popupStyle} alignItems="center">
        {selectedFile && (
          <img src={imageURL} style={{ maxHeight: "40%" }} alt="uploaded" />
        )}
        {/* <Button variant="contained" color="secondary" onClick={() => setToastOpen(true)}>[DEV] open toast</Button><Button variant="contained" color="secondary" onClick={async () => { try { await axios.post("/clearDB"); } catch (error) { console.log("Error clearing DB" + error); } }} > [DEV] clear db </Button> */}
        <Input
          type="datetime-local"
          onChange={(e) => {
            setPhotoDate(e.target.value);
            findNearest(e.target.value);
          }}
          inputProps={{ max: `${today}`, min: `${oldest}` }} // TODO: time max not applying, see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#validation about validation
          value={photoDate}
          readOnly={!selectedFile}
        />
        {selectedFile && (
          <Typography variant="caption">
            Flow: {closestEntry.flow}, water level:{" "}
            {closestEntry.waterLevel.toFixed(2)}
          </Typography>
        )}
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
        />
        {selectedFile && `${userRating} / 5`}
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
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <Button onClick={props.close} color="warning">
              close
            </Button>
          </Grid>
          <Grid item sm={6} container justifyContent="flex-end">
            <Button
              onClick={fileUploadHandler}
              disabled={
                !selectedFile || !userRating || uploading || !ratingGiven
              }
              variant="outlined"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
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
    </Modal>
  );
}
