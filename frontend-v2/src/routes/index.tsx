import { FC } from 'react';
import { Route, RouteProps, Routes } from 'react-router-dom';
import About from '../pages/About';
import Home from '../pages/Home';

const MyRoutes: FC<RouteProps> = () => (
  <Routes>
    <Route path='/' element={<Home />} />
    <Route path='/about' element={<About />} />
  </Routes>
);

export default MyRoutes;
