import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getRoleDashboardPath } from "../utils/authHelpers";
import RouteStatus from "../components/shared/RouteStatus";

function PrivateRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { isLoggedIn, isAuthResolved, user } = useAuth();

  if (!isAuthResolved) {
    return (
      <RouteStatus
        title="Checking session"
        message="Restoring your authentication session."
      />
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleDashboardPath(user?.role)} replace />;
  }

  return children;
}

export default PrivateRoute;
