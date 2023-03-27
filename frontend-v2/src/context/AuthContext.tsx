import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
} from 'react';

export type IUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  mfaEnabled: boolean;
  picture: string;
  avatarUrl: string;
};

export type IState = {
  user?: IUser;
};

type IAuthContext = IState & {
  dispatch: Dispatch<IAction>;
  updateUser: (user: IUser) => void;
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
    case 'UPDATE':
      return { user: action.payload };
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

  const updateUser = useCallback(
    (user: IUser) => {
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({ type: 'UPDATE', payload: user });
    },
    [state],
  );

  return (
    <AuthContext.Provider value={{ ...state, updateUser, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
