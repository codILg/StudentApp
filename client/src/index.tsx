//import { StrictMode } from 'react'
//import { createRoot } from 'react-dom/client'
//import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes.tsx";
import ReactDOM from "react-dom/client";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastContainer position="bottom-right" hideProgressBar theme="colored" />

    {/* //<Provider> */}
    <RouterProvider router={router} />
    {/* //</Provider> */}
  </React.StrictMode>
);
