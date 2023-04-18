import { createContext, FC, PropsWithChildren, useCallback, useState } from 'react';

export type IUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  mfaEnabled: boolean;
  avatarUrl: string;
};

export type IState = {
  user?: IUser;
};

type IAuthContext = {
  user: IUser | null;
  updateUser: (user: IUser | null) => void;
};

export const AuthContext = createContext<IAuthContext | null>(null);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const storageUser = localStorage.getItem('user');
    if (storageUser) return JSON.parse(storageUser) as IUser;
    return null;
  });

  const updateUser = useCallback(
    (updatedUser: IUser | null) => {
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    },
    [user],
  );

  return <AuthContext.Provider value={{ user, updateUser }}>{children}</AuthContext.Provider>;
};
