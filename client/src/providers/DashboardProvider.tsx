import React, { createContext, ReactNode, useReducer } from "react";
import { IWalletHistory } from "../types";

interface IState {
  status: boolean;
  message: string | null;
  data: IWalletHistory[] | null;
}

export const ACTIONS = {
  GET_WALLET_HISTORY: "GET_WALLET_HISTORY",
  FETCH_WALLET_HISTORY: "FETCH_WALLET_HISTORY",
};

const defaultState: IState = {
  status: false,
  message: null,
  data: null,
};

const reducer = (state: IState, action: any): IState => {
  switch (action.type) {
    case ACTIONS.FETCH_WALLET_HISTORY:
      if (action.payload.status) {
        return { status: true, message: action.payload.message, data: action.payload.data };
      }
      return { ...state, message: action.payload.message };
    case ACTIONS.GET_WALLET_HISTORY:
      return { ...state };

    default:
      return state;
  }
};

export const Context = createContext<{ state: IState; dispatch: React.Dispatch<any> }>({
  state: defaultState,
  dispatch: () => null,
});

const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>;
};

export default DashboardProvider;
