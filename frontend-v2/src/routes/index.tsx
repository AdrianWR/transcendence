import { FC, ReactNode } from 'react';
import { Route, RouteProps, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';

const MyRoutes: FC<RouteProps> = () => {
  // Use the layout defined at the page level, if available
  const getLayout = (page: ReactNode) => <Layout>{page}</Layout>;

  return (
    <Routes>
      <Route path='/' element={Home.getLayout ? Home.getLayout(<Home />) : getLayout(<Home />)} />
      <Route path='/about' element={getLayout(<About />)} />
    </Routes>
  );
};

export default MyRoutes;
