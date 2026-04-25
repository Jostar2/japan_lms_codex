import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import "./app-shell.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element for Claritas app shell.");
}

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
