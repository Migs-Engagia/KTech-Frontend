import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RedirectIfAuthenticated = () => {
  const token = localStorage.getItem("token"); // or sessionStorage.getItem("token");

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RedirectIfAuthenticated;
