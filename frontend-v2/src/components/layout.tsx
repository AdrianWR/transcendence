import { FC, ReactNode } from 'react';
import Footer from './footer';
import Navbar from './navbar';

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }: { children: ReactNode }) => {
  return (
    <div className='content'>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
