import "./index.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Dashboard } from "@/pages/Dashboard.tsx";
import { LoginForm } from "@/pages/LoginForm.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { SignUpForm } from "@/pages/SignUpForm.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignUpForm />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
