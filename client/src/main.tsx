import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import "./styles/tokens.css";
import "./styles/global.css";
import "./styles/animations.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Không tìm thấy phần tử DOM #root trong index.html để khởi chạy ứng dụng React."
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
