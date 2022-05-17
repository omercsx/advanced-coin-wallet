import React, { createContext, ReactNode, useReducer } from "react";

interface IState {
  isAuthenticated: boolean;
  user: any;
}

export const ACTIONS = {
  USER_LOGGED_IN: "USER_LOGGED_IN",
  USER_LOGGED_OUT: "USER_LOGGED_OUT",
};

const defaultState = {
  isAuthenticated: false,
  user: null,
};

const reducer = (state: IState, action: any) => {
  switch (action.type) {
    case ACTIONS.USER_LOGGED_IN:
      return {
        isAuthenticated: true,
        user: action.payload,
      };
    case ACTIONS.USER_LOGGED_OUT:
      return defaultState;
    default:
      return defaultState;
  }
};

export const Context = createContext<{ state: IState; dispatch: React.Dispatch<any> }>({
  state: defaultState,
  dispatch: () => null,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  return <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>;
};

export default AuthProvider;
