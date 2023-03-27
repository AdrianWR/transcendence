import { Avatar, Button, Card, Flex, Modal, TextInput, Title, Tooltip } from '@mantine/core';
import { IconAt, IconUser, IconUserEdit } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { FC } from 'react';
import ProfileUserForm from '../ProfileUserForm';
import { useAuthContext } from '../../../hooks/useAuthContext';

const ProfileCard: FC = () => {
  const { user } = useAuthContext();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Card shadow='xl' px={20} p={16} withBorder>
      <Flex align='center' justify='space-between' mb={12}>
        <Title color='white' order={2}>
          Profile
        </Title>

        <Modal opened={opened} onClose={close} title='Edit profile'>
          <ProfileUserForm />
        </Modal>

        <Tooltip color='lightBlack' withArrow label='Edit profile' position='right'>
          <Button variant='outline' color='secondary' radius='50%' p={8} onClick={open}>
            <IconUserEdit width={18} height={18} radius='50%' />
          </Button>
        </Tooltip>
      </Flex>
      <Flex justify='space-between' align='center'>
        <Avatar
          src={user?.avatarUrl}
          size='xl'
          radius='50%'
          style={{ border: '2px solid #F46036' }}
        />
        <Flex ml={32} direction='column' align='center' justify='center'>
          <TextInput
            disabled
            label='username'
            value={user?.username}
            icon={<IconUser size='0.8rem' />}
          />
          <TextInput
            disabled
            my={4}
            label='email'
            value={user?.email}
            icon={<IconAt size='0.8rem' />}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default ProfileCard;
