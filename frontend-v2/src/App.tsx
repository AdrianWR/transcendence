import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import MyRoutes from './routes';

const App: FC = () => {
  return (
    <BrowserRouter>
      <MyRoutes />
    </BrowserRouter>
  );
};

export default App;
