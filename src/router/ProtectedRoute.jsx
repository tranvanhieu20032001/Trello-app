import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/NavBar";

const ProtectedRoute = () => {
  const user = useSelector((state) => state.auth.user);
  return <div>
    <Navbar/>
    {user ? <Outlet /> : <Navigate to="login" />}
  </div>
};

export default ProtectedRoute;
