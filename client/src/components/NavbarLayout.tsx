import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const NavbarLayout = () => {
  return (
    <div className=' flex flex-col mx-auto w-full max-w-screen-xl 2xl:max-w-screen-3xl'>
      <Navbar />
      <Outlet />
    </div>
  );
};
