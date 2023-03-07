import { BackgroundImage } from '@mantine/core';
import { FC, ReactNode } from 'react';
import Footer from '../Footer';
import Navbar from '../Navbar';

interface Props {
  children: ReactNode;
  imageSrc?: string;
  imageHeight?: string;
}

const Layout: FC<Props> = ({ children, imageSrc = '/images/webb-deep-field.png' }: Props) => {
  return (
    <>
      <BackgroundImage style={{ display: 'flex', flexDirection: 'column', flex: 1 }} src={imageSrc}>
        <Navbar />
        {children}
      </BackgroundImage>
      <Footer />
    </>
  );
};

export default Layout;
