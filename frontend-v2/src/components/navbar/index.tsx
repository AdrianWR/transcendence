import { Button, Flex } from '@mantine/core';
import { FC } from 'react';
import items from './items.json';

type MenuItem = {
  name: string;
  path: string;
};

const Navbar: FC = () => {
  return (
    <nav>
      <Flex w='0.8' gap='xl' justify='center' align='center'>
        {/* <Image src="/images/logo.svg" width={128} height={77} alt={""} /> */}

        {items.map((item: MenuItem) => (
          <a href={item.path} key={item.name.toLowerCase()}>
            {item.name}
          </a>
        ))}

        <a href='/login'>
          <Button>Login</Button>
        </a>
      </Flex>
    </nav>
  );
};

export default Navbar;
