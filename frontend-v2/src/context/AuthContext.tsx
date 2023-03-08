import { createContext, Dispatch, FC, PropsWithChildren, useEffect, useReducer } from 'react';

export type IUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  mfa_enabled: boolean;
  picture: string;
};

export type IState = {
  user?: IUser;
};

type IAuthContext = IState & {
  dispatch: Dispatch<IAction>;
};

type IAction = {
  type: string;
  payload?: any;
};

export const AuthContext = createContext<IAuthContext | null>(null);

export const authReducer = (state: IState, action: IAction) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    const user = localStorage.getItem('user');

    if (user) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(user) });
    }
  }, []);

  return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>;
};
