import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getRoleDashboardPath } from "../utils/authHelpers";
import RouteStatus from "./RouteStatus";

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isAuthResolved, user } = useAuth();

  if (!isAuthResolved) {
    return (
      <RouteStatus
        title="Loading account"
        message="Preparing the authentication screens."
      />
    );
  }

  if (isAuthenticated()) {
    return <Navigate to={getRoleDashboardPath(user?.role)} replace />;
  }

  return children;
}

export default PublicOnlyRoute;
