import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Toast } from "../components/toastify";

let showToastFn: (text: string, type: "success" | "warning" | "failed") => void;

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<
    { text: string; type: "success" | "warning" | "failed" }[]
  >([]);

  showToastFn = (text, type) => {
    setToasts((prev) => [...prev, { text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 3000);
  };

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
      {toasts.map((toast, i) => (
        <Toast key={i} text={toast.text} type={toast.type} />
      ))}
    </div>
  );
};

export function showToast(
  text: string,
  type: "success" | "warning" | "failed"
) {
  if (showToastFn) {
    showToastFn(text, type);
  }
}

// Mount container once
export function initToastContainer() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<ToastContainer />);
}
