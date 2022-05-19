import { useContext } from "react";
import { Context } from "../providers/DashboardProvider";

const useDashboard = () => {
  return useContext(Context);
};

export default useDashboard;
