import { useContext } from "react";
import { Context } from "../providers/WalletProvider";

const useWallet = () => {
  return useContext(Context);
};

export default useWallet;
