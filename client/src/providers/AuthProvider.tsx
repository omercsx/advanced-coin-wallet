import React, { createContext, ReactNode, useReducer } from "react";

interface IState {
  isAuthenticated: boolean;
  modalOpen: boolean;
  user: any;
}

export const ACTIONS = {
  USER_LOGGED_IN: "USER_LOGGED_IN",
  USER_LOGGED_OUT: "USER_LOGGED_OUT",
  MODAL_SWITCH: "MODAL_SWITCH",
};

const defaultState = {
  isAuthenticated: false,
  user: null,
  modalOpen: false,
};

const reducer = (state: IState, action: any) => {
  switch (action.type) {
    case ACTIONS.USER_LOGGED_IN:
      return {
        isAuthenticated: true,
        modalOpen: false,
        user: action.payload,
      };

    case ACTIONS.MODAL_SWITCH:
      return {
        ...state,
        modalOpen: !state.modalOpen,
      };

    case ACTIONS.USER_LOGGED_OUT:
      return defaultState;
    default:
      return state;
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
