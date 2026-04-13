import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ role }) {
  const userRole = localStorage.getItem("role");

  if (!userRole) return <Navigate to="/" />;

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;