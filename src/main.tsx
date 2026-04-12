import React from "react";
import ReactDOM from "react-dom/client";
import App from "../geminiw";
import { I18nProvider } from "../contexts/I18nContext";
import "lenis/dist/lenis.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>,
);
