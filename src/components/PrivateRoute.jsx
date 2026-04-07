import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getRoleDashboardPath } from "../utils/authHelpers";
import RouteStatus from "./RouteStatus";

function PrivateRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { isAuthenticated, isAuthResolved, user } = useAuth();

  if (!isAuthResolved) {
    return (
      <RouteStatus
        title="Checking session"
        message="Restoring your authentication session."
      />
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleDashboardPath(user?.role)} replace />;
  }

  return children;
}

export default PrivateRoute;
