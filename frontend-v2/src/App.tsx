import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { FC, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext';
import { SocketProvider } from './hooks/socket';
import MyRoutes from './routes';
import './styles/global.css';
import { myTheme } from './styles/mantineTheme';

export type FCWithLayout<P = object> = FC<P> & {
  getLayout?: (page: ReactNode) => JSX.Element;
};

const App: FC = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <ChatContextProvider>
          <SocketProvider>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={myTheme}>
              <Notifications />
              <MyRoutes />
            </MantineProvider>
          </SocketProvider>
        </ChatContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
};

export default App;
