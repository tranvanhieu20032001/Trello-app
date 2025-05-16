import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store";
import "./index.css";
import { ToastContainer } from "react-toastify";
import AppRoutesWrapper from "./router/AppRoutesWrapper";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <AppRoutesWrapper />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
