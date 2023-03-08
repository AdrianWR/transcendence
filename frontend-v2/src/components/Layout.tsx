import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout: FC = () => (
  <main className='content'>
    <Navbar />
    <Outlet />
    <Footer />
  </main>
);

export default Layout;
