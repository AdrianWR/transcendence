import { FC, PropsWithChildren, createContext, useEffect, useState } from 'react';
import { alert } from '../components/Notifications';
import { useSocket } from '../hooks/socket';
import { IUser } from './AuthContext';

export interface IMatch {
  id: string;
  status: 'waiting' | 'playing' | 'finished' | 'aborted';
  playerOne: IUser;
  playerTwo?: IUser;
  playerOneScore: number;
  playerTwoScore: number;
  createdAt: string;
}

export type IGameContext = {
  activeMatch?: IMatch;
  currentMatches: IMatch[];
};

export const GameContext = createContext<IGameContext | null>(null);

export const GameContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentMatches, setCurrentMatches] = useState<IMatch[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    socket?.emit('listCurrentMatches', (matches: IMatch[]) => {
      setCurrentMatches(matches);
    });

    socket?.on('listCurrentMatches', (matches: IMatch[]) => setCurrentMatches(matches));

    socket?.on('apiError', (message: string) => {
      alert(message, 'Chat');
    });

    return () => {
      socket?.off('listCurrentMatches');
      socket?.off('apiError');
    };
  }, [socket]);

  return (
    <GameContext.Provider
      value={{
        currentMatches,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
