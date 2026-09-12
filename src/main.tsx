import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// BrowserRouter → provides routing context to the entire app
// Uses the browser's History API for clean URLs (/admin/login not #/admin/login)
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
