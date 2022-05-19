import React, { createContext, ReactNode, useReducer } from "react";
import { ICrypto } from "../types";

interface IState {
  status: boolean;
  message: string | null;
  data: {
    balance: number;
    cryptos: ICrypto[];
  };
}

export const ACTIONS = {
  GET_WALLET: "GET_WALLET",
  FETCH_WALLET: "FETCH_WALLET",
  ADD_COIN: "ADD_COIN",
  DELETE_COIN: "DELETE_COIN",
};

const defaultState: IState = {
  status: false,
  message: null,
  data: {
    balance: 0,
    cryptos: [],
  },
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

    case ACTIONS.ADD_COIN:
      return {
        status: true,
        message: action.payload.message,
        data: {
          balance: state.data.balance + action.payload.data.balance,
          cryptos: [...state.data.cryptos, action.payload.data.newUserCrypto],
        },
      };

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
