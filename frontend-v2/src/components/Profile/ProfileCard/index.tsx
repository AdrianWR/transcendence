import {
  Avatar,
  Button,
  Card,
  Flex,
  LoadingOverlay,
  Modal,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconAt, IconUser, IconUserEdit } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { FC, useEffect, useState } from 'react';
import ProfileUserForm from '../ProfileUserForm';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { IUser } from '../../../context/AuthContext';
import api from '../../../services/api';
import { AxiosError } from 'axios';
import { alert, success } from '../../Notifications';

interface ProfileCardProps {
  userId: number | undefined;
}

const ProfileCard: FC<ProfileCardProps> = ({ userId }) => {
  const { user } = useAuthContext();
  const [opened, { open, close }] = useDisclosure(false);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedUser, setIsLoggedUser] = useState(false);
  const notificationTitle = 'Profile';

  useEffect(() => {
    if (!userId) return;

    if (userId == user?.id) {
      setUserData(user);
      setIsLoggedUser(true);
    } else {
      setIsLoading(true);
      setIsLoggedUser(false);

      api
        .get(`/users/${userId}`)
        .then(({ data }) => {
          setUserData(data);
          success('Successfully fetched user data', notificationTitle);
        })
        .catch((err) => {
          if (err instanceof AxiosError) {
            alert(err.response?.data.message, notificationTitle);
          } else {
            alert('Error occured while fetching user data', notificationTitle);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, userId]);

  return (
    <Card shadow='xl' px={20} p={16} h={310} withBorder style={{ position: 'relative' }}>
      <LoadingOverlay
        loaderProps={{ color: 'secondary', variant: 'bars' }}
        overlayOpacity={0.2}
        visible={isLoading}
        overlayBlur={1}
      />
      <Flex align='center' justify='space-between' mb={12}>
        <Title color='white' order={2}>
          Profile
        </Title>

        {isLoggedUser && (
          <>
            <Modal opened={opened} onClose={close} title='Edit profile'>
              <ProfileUserForm />
            </Modal>

            <Tooltip color='lightBlack' withArrow label='Edit profile' position='right'>
              <Button variant='outline' color='secondary' radius='50%' p={8} onClick={open}>
                <IconUserEdit width={18} height={18} radius='50%' />
              </Button>
            </Tooltip>
          </>
        )}
      </Flex>
      <Flex justify='space-between' align='start'>
        <Avatar
          mt={30}
          src={userData?.avatarUrl || '/images/cat-pirate.jpg'}
          size='xl'
          radius='50%'
          style={{ border: '2px solid #F46036' }}
        />
        <Flex ml={32} direction='column' align='center' justify='center'>
          <TextInput
            disabled
            mt={4}
            label='username'
            value={userData?.username || ''}
            icon={<IconUser size='0.8rem' />}
          />
          <TextInput
            disabled
            label='name'
            value={userData?.firstName ? `${userData.firstName} ${userData.lastName}` : ''}
            icon={<IconUser size='0.8rem' />}
          />
          <TextInput
            disabled
            mt={4}
            label='email'
            value={userData?.email || ''}
            icon={<IconAt size='0.8rem' />}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default ProfileCard;
