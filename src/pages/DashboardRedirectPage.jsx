import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getRoleDashboardPath } from "../utils/authHelpers";

function DashboardRedirectPage() {
  const { user } = useAuth();

  return <Navigate to={getRoleDashboardPath(user?.role)} replace />;
}

export default DashboardRedirectPage;
