import { Navigate, Outlet } from "react-router";
import MainSection from "@comp/main/MainSection";

const ProtectedRoute = ({ isAuthenticated, redirectTo = "/auth" }) => {
  return (
    <>
      {isAuthenticated && <Outlet />}
      {isAuthenticated === null && <MainSection spin={true} />}
      {isAuthenticated === false && <Navigate to={redirectTo} replace />}
    </>
  );
};

export default ProtectedRoute;
