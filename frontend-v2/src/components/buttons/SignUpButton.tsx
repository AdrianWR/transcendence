import { Button, Group, Modal } from '@mantine/core';
import { FC, useState } from 'react';

const SignUpButton: FC = () => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)}>
        {/* <RegisterUserForm /> */}
      </Modal>

      <Group position='center'>
        <Button color='red' onClick={() => setOpened(true)}>
          Sign Up
        </Button>
      </Group>
    </>
  );
};

export default SignUpButton;
