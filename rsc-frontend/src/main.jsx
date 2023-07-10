import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LiveConditions from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import "./index.css";
import Tens from "./pages/Tens";
import PhotosPage from "./pages/PhotosPage";
import TopBar from "./components/TopBar";
import { Box } from "@mui/material";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3001";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    {/* <CssBaseline /> */}
    <TopBar />
    {/* <h1 style={{ position: "absolute" }}>INside the router</h1> */}
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 4,
        backgroundColor: "#282c34",
        color: "white",
      }}
    >
      <Routes>
        <Route path="/" element={<LiveConditions />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/tens" element={<Tens />} />
        <Route path="/photos" element={<PhotosPage />} />
      </Routes>
    </Box>
  </Router>
);
 