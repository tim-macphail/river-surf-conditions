import {
  AppBar,
  Link,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import * as React from "react";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: "#181a1f" }}>
          <nav className="navBar">
            <Button onClick={toggleDrawer("left", true)}>
              <FiMenu
                style={{ color: "#fff", width: "40px", height: "40px" }}
              />
            </Button>
          </nav>
          <Typography
            variant="h6"
            component="div"
            align="center"
            sx={{ flexGrow: 1 }}
          >
            <Link color="inherit" href="/">
              RSC
            </Link>
          </Typography>
          <Typography>{localStorage.getItem("email")}</Typography>
          {localStorage.getItem("authToken") ? (
            <Button color="inherit" onClick={handleLogout}>
              Log out
            </Button>
          ) : (
            <Button color="inherit" href="/signin">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <React.Fragment key={"left"}>
        <Drawer
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
        >
          <List>
            <ListItem className="filler"></ListItem>
            <ListItemButton component="a" href="/">
              <ListItemText primary="Conditions" />
            </ListItemButton>
            <ListItemButton component="a" href="/upload">
              <ListItemText primary="Upload" />
            </ListItemButton>
          </List>
        </Drawer>
      </React.Fragment>
    </Box>
  );
}
