import { useContext } from "react";
import { Context } from "../providers/ExchangeProvider";

const useExchanges = () => {
  return useContext(Context);
};

export default useExchanges;
