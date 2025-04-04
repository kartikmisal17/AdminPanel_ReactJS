import { Navigate, Outlet } from "react-router-dom";

const Privateroute = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"; // ✅ Authentication Status Check

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />; 
  // Unauthorized Users ko Redirect Karna
};

export default Privateroute;
