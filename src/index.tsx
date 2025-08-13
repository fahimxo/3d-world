import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app"; // Your main App component

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
import { initToastContainer } from "../src/config/toastService";

initToastContainer();
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
