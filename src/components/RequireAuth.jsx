import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/UseAuth";
import { useState, useEffect } from "react";

const RequireAuth = ({ redirectPath }) => {
  const { auth } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsChecking(false);
    }, 500); // 🔹 Delay to allow auth state to load
  }, []);

  if (isChecking) {
    return null; // 🔹 Prevents flickering redirects
  }

  if (auth?.token) {
    if (location.pathname === "/signin") {
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
  }

  return <Navigate to="/signin" state={{ from: location }} replace />;
};

export default RequireAuth;
