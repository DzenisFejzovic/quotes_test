import React from "react";

import { Route, Routes, Navigate } from "react-router-dom";
import Input from "./components/input";
import Quotes from "./components/quotes";
import "./bodyStyle.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Input />} />
      <Route path="/quotes" element={<Quotes />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
