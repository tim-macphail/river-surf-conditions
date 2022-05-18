import { Grid, DialogTitle, Dialog, Box, Button, Rating } from "@mui/material";
import axios from "axios";

import { useState } from "react";

export default function RatingDialogue(props) {
  const [userRating, setUserRating] = useState(0);
  const [ratingWasGiven, setRatingWasGiven] = useState(false);

  const handleChange = (e) => {
    setRatingWasGiven(true);
    setUserRating(parseFloat(e.target.value));
  };

  const handleConfirm = async () => {
    try {
      const reqBody = {
        userRating: userRating,
        entries: props.entries,
      };
      // TODO: store entry in DB
      const res = axios.post("/rateCurrent", reqBody);
      console.log((await res).status);
      if ((await res).status === 200) props.close(true);
    } catch (error) {
      console.log("Error giving rating:" + error);
      props.close(false);
      // TODO: FailureSnack
    }
  };

  const handleCancel = () => {
    props.close(false);
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={true}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <DialogTitle>Enter a rating:</DialogTitle>
        <Rating
          value={userRating}
          onChange={handleChange}
          precision={0.5}
          size="large"
          sx={{ fontSize: "4rem" }}
        />
      </Box>
      <Grid container>
        <Grid item xs={6}>
          <Button color="warning" fullWidth onClick={handleCancel}>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button fullWidth disabled={!ratingWasGiven} onClick={handleConfirm}>
            Confirm
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}
