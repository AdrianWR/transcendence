import {
  useContext,
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { IUser } from '../context/AuthContext';
import { useAuthContext } from './useAuthContext';

interface ISocketContext {
  socket: Socket;
  socketUsersList: { [userId: number]: SocketUser };
  updateSocketUserStatus(status: socketStatus): void;
}

type socketStatus = 'online' | 'offline' | 'game' | 'chat';
interface SocketUser extends IUser {
  status: socketStatus;
}

const SocketContext = createContext<ISocketContext | null>(null);

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuthContext();
  const [socket, setSocket] = useState(() =>
    io('http://localhost:8080', { transports: ['websocket'] }),
  );
  const [socketUsersList, setSocketUsersList] = useState({} as { [userId: number]: SocketUser });

  useEffect(() => {
    socket.on('usersList', (usersList: SocketUser[]) =>
      setSocketUsersList(
        usersList.reduce((indexedList, user) => ({ ...indexedList, [user.id]: user }), {}),
      ),
    );
  }, []);

  const updateSocketUserStatus = useCallback(
    (status: socketStatus) => {
      if (user) socket.emit('updateUser', { ...user, status });
    },
    [socket, user],
  );

  return (
    <SocketContext.Provider value={{ socket, socketUsersList, updateSocketUserStatus }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw Error('useSocket must be used inside an SocketProvider');
  }

  return context;
};
