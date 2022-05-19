import React, { createContext, ReactNode, useReducer } from "react";
import { IExchange } from "../types";

interface IState {
  status: boolean;
  message: string | null;
  data: IExchange[] | null;
}

export const ACTIONS = {
  GET_EXCHANGES: "GET_EXCHANGES",
  FETCH_EXCHANGES: "FETCH_EXCHANGES",
};

const defaultState: IState = {
  status: false,
  message: null,
  data: null,
};

const reducer = (state: IState, action: any): IState => {
  switch (action.type) {
    case ACTIONS.FETCH_EXCHANGES:
      if (action.payload.status) {
        return { status: true, message: action.payload.message, data: action.payload.data };
      }
      return { ...state, message: action.payload.message };
    case ACTIONS.GET_EXCHANGES:
      return { ...state };

    default:
      return state;
  }
};

export const Context = createContext<{ state: IState; dispatch: React.Dispatch<any> }>({
  state: defaultState,
  dispatch: () => null,
});

const ExchangeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>;
};

export default ExchangeProvider;
