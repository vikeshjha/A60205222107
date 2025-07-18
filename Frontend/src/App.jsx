import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UrlShortener from "./components/UrlShortener";
import UrlStatistics from "./components/UrlStatistics";
import RedirectHandler from "./components/RedirectHandler";

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<UrlShortener />} />
          <Route path="/stats" element={<UrlStatistics />} />
          <Route path="/:shortcode" element={<RedirectHandler />} />
        </Routes>
      </div>
    </Router>
  );
}
