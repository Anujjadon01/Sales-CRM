import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

   if (user) {
    // role based redirect
    return user.role === "admin"
      ? <Navigate to="/dashboard" replace />
      : <Navigate to="/home" replace />;
  }

  return children;
};

export default AuthRoute;
