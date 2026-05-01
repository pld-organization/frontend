import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getRoleDashboardPath } from "../utils/authHelpers";
import RouteStatus from "../components/shared/RouteStatus";

function PublicOnlyRoute({ children }) {
  const { isLoggedIn, isAuthResolved, user } = useAuth();

  if (!isAuthResolved) {
    return (
      <RouteStatus
        title="Loading account"
        message="Preparing the authentication screens."
      />
    );
  }

  if (isLoggedIn) {
    return <Navigate to={getRoleDashboardPath(user?.role)} replace />;
  }

  return children;
}

export default PublicOnlyRoute;
