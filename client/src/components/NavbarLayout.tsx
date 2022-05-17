import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const NavbarLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
