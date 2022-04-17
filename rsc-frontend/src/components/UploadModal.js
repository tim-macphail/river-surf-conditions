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

  // select a file from the file system
  const fileSelectedHandler = (event) => {
    const file = event.target.files[0];
    const dateStr = file.lastModifiedDate.toISOString().split(":");
    const photoDate = `${dateStr[0]}:${dateStr[1]}`;
    console.log(photoDate);
    setPhotoDate(photoDate);
    setSelectedFile(file);
    setImageURL(URL.createObjectURL(file));
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
      await axios.post("/setRating", reqBody);
      setSelectedFile(null);
      setUserRating(0);
      setToastOpen(true);
      setPhotoDate(null);
    } catch (error) {
      console.log("Error adding rating " + error);
    }
  };

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
        <Typography mt={2} component="legend">
          Rating
        </Typography>
        <Input
          type="datetime-local"
          onChange={(e) => console.log(e.target.value)}
          // min={} // TODO: get these from what's available
          // max={}
          value={photoDate}
        />
        <Rating
          name="simple-controlled"
          value={userRating}
          precision={0.5}
          onChange={(event, newValue) => {
            setUserRating(newValue);
          }}
          sx={{ mb: 2 }}
          readOnly={!selectedFile}
        />
        {userRating}/5
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
              disabled={!selectedFile || !userRating}
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
