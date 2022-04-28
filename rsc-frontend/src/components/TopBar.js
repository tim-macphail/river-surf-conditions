import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import * as React from "react";

export default function TopBar() {
  return (
    <Box position="sticky">
      <AppBar>
        <Toolbar>
          <Typography align="center" sx={{ flexGrow: 1 }}>
            <Button sx={{ color: "white" }} href="/">
              Home
            </Button>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
