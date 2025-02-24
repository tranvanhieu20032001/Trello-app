import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./store/index.js";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx"; // Import Home
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import GoogleCallBack from "./components/GoogleCallBack.jsx";
import HomeSection from "./components/Home/Section/HomeSection.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <Home />,
            children: [
              { path: "/", element: <HomeSection /> },

            ],
          },
        ],
      },
      { path: "callback", element: <GoogleCallBack /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={3000} />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
