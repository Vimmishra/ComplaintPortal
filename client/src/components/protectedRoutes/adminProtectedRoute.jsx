import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If no user → directly go to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is not admin → redirect to home
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // If admin → allow to visit component
  return children;
};

export default AdminProtectedRoute;
