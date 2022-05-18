import React, { createContext, ReactNode, useReducer } from "react";
import { IWallet } from "../types";

interface IState {
  status: boolean;
  message: string | null;
  data: IWallet | null;
}

export const ACTIONS = {
  GET_WALLET: "GET_WALLET",
  FETCH_WALLET: "FETCH_WALLET",
};

const defaultState: IState = {
  status: false,
  message: null,
  data: null,
};

const reducer = (state: IState, action: any): IState => {
  switch (action.type) {
    case ACTIONS.FETCH_WALLET:
      if (action.payload.status) {
        return { status: true, message: action.payload.message, data: action.payload.data };
      }
      return { ...state, message: action.payload.message };
    case ACTIONS.GET_WALLET:
      return { ...state };

    default:
      return state;
  }
};

export const Context = createContext<{ state: IState; dispatch: React.Dispatch<any> }>({
  state: defaultState,
  dispatch: () => null,
});

const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>;
};

export default WalletProvider;
