import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";
export default function SuccessSnack(props) {
  const [snackOpen, setSnackOpen] = useState(true);
  return (
    <Snackbar
      open={snackOpen}
      autoHideDuration={3000}
      onClose={() => {
        setSnackOpen(false);
        props.onClose();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        severity="success"
        sx={{ width: "100%" }}
        elevation={6}
        variant="filled"
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}
