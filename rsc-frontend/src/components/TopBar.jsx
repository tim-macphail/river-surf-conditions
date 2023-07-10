import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import * as React from "react";

export default function TopBar() {
  return (
    <Box
      position="absolute"
      minHeight="10vh"
      sx={{ minHeight: "50vh", backgroundColor: "red", height: "500px" }}
    >
      <AppBar>
        {/* <Toolbar> */}
        <Typography align="left" sx={{ flexGrow: 1 }}>
          <Button sx={{ color: "white" }} href="/">
            HOME
          </Button>
        </Typography>
        {/* </Toolbar> */}
      </AppBar>
    </Box>
  );
}
