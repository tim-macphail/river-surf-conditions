import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LiveConditions from "./pages/LiveConditions";
import UploadPage from "./pages/UploadPage";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import TopBar from "./components/TopBar";
import Tens from "./pages/Tens";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    {/* <TopBar /> */}
    <Routes>
      <Route path="/" element={<LiveConditions />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/tens" element={<Tens />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
