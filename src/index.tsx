import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app"; // Your main App component
import { initToastContainer } from "../src/config/toastService";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

initToastContainer();

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service Worker registered:", reg))
      .catch((err) => console.error("SW registration failed:", err));
  });
}
