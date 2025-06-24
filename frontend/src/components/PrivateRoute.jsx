import { Navigate, Outlet } from "react-router-dom";
import { useFetchMeQuery} from "../api/AuthSlice";

const PrivateRoute = ({ requiredRoles = [] }) => {
  const { data: user, isLoading } = useFetchMeQuery();

  if (isLoading) return <p>Loading...</p>;

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but role doesn't match
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Logged in and authorized
  return <Outlet />;
};

export default PrivateRoute;
