import { Modal, Box, Button, Input, Rating, Typography } from "@mui/material";

import { useState } from "react";
import axios from "axios";

export default function MyModal(props) {
  const [selectedFile, setSelectedFile] = useState();
  const [photoDate, setPhotoDate] = useState();
  const [userRating, setUserRating] = useState(0);

  // select a file from the file system
  const fileSelectedHandler = (event) => {
    console.log(event.target.files);
    // TODO: find some way to have this restricted already
    if (event.target.files.length !== 1) {
      alert("Upload on only 1 file");
      return;
    }
    const file = event.target.files[0];
    if (file.type !== "image/jpeg") {
      alert("Only enter a photo");
      return;
    }
    const photoDate = file.lastModifiedDate;
    setPhotoDate(photoDate);
    setSelectedFile(file);
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
    console.log(userRating);
    const reqBody = { rating: userRating, date: photoDate };
    try {
      const response = await axios.post("/setRating", reqBody);
      setSelectedFile(null);
      setUserRating(0);
      console.log(userRating);
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
    border: "2px solid #000",
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
        {/* <Typography variant="h4">Date: {photoDate}</Typography> */}
        <Input
          type="date"
          value={photoDate && photoDate.toLocaleDateString("en-CA")} //! may cause issues in other regions ?
          readOnly
          // onChange={(e) => console.log(e.target.valueAsDate)}
          // value={null}
        />
        <Input
          type="time"
          value={
            photoDate &&
            photoDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          }
          readOnly
          // onChange={(e) => console.log(e.target.value)}
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
          }}
          sx={{ mb: 2 }}
        />
        {userRating}
        <Input
          type="file"
          // style={{ display: "none" }}	// hide this input later?
          onChange={fileSelectedHandler}
          sx={{ mb: 2 }}
        />
        <Button
          onClick={fileUploadHandler}
          disabled={!selectedFile && userRating}
        >
          Submit
        </Button>
        <Button onClick={props.submit} color="warning">
          close
        </Button>
      </Box>
    </Modal>
  );
}
