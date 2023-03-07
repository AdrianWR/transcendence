import { MantineProvider } from '@mantine/core';
import { FC, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MyRoutes from './routes';
import './styles/global.css';
import { myTheme } from './styles/mantineTheme';

export type FCWithLayout<P = object> = FC<P> & {
  getLayout?: (page: ReactNode) => JSX.Element;
};

const App: FC = () => {
  return (
    <BrowserRouter>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={myTheme}>
        <MyRoutes />
      </MantineProvider>
    </BrowserRouter>
  );
};

export default App;
