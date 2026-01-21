import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default Layout;
