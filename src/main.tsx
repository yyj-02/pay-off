import "./index.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Home } from "@/pages/Home";
import { LoginForm } from "@/pages/LoginForm.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { SignUpForm } from "@/pages/SignUpForm.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import { TopUp } from "@/pages/TopUp";
import { Withdraw } from "./pages/Withdraw";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/signup",
    element: <SignUpForm />,
  },
  {
    path: "/topup",
    element: <TopUp />,
  },
  {
    path: "/withdraw",
    element: <Withdraw />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
