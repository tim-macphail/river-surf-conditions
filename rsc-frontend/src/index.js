import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Tens from "./pages/Tens";
import PhotosPage from "./pages/PhotosPage";
import Chart from "./pages/3d-chart";
import TopBar from "./components/TopBar";
import { Box, CssBaseline } from "@mui/material";
import { uniformStyle } from './styles/styles';

const pages = [
  { path: "/", component: <HomePage /> },
  { path: "/upload", component: <UploadPage /> },
  { path: "/tens", component: <Tens /> },
  { path: "/photos", component: <PhotosPage /> },
  { path: "/chart", component: <Chart /> },
];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <CssBaseline />
    <Box
      sx={uniformStyle}
    >
      <Routes>
        {
          pages.map(page => (
            <Route path={page.path} element={page.component} />
          ))
        }
      </Routes>
    </Box>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
