import { useContext } from "react";
import { Context } from "../providers/AuthProvider";

const useAuth = () => {
  return useContext(Context);
};

export default useAuth;
