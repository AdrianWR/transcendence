import {
  ActionIcon,
  Avatar,
  Badge,
  Card,
  Drawer,
  Flex,
  LoadingOverlay,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { IconChecks, IconTrashX } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { FC, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { IUser } from '../../../context/AuthContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import { alert, success } from '../../Notifications';
import { IFriendRequest } from '../FriendsListCard';
import styles from './FriendRequestsModal.module.css';

interface FriendRequestsModalProps {
  opened: boolean;
  close(): void;
  friendRequestsList: IFriendRequest[];
  updateFriendRequestsList(updatedList: IFriendRequest[]): void;
  friendsList: IUser[];
  updateFriendsList(updatedList: IUser[]): void;
}

const FriendRequestsModal: FC<FriendRequestsModalProps> = ({
  opened,
  close,
  friendRequestsList,
  updateFriendRequestsList,
  friendsList,
  updateFriendsList,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const notificationTitle = 'Friend Requests';
  const { user } = useAuthContext();

  const acceptRequest = useCallback(
    async (request: IFriendRequest) => {
      setIsLoading(true);
      const {
        id: requestId,
        sender: { id: friendId },
      } = request;
      try {
        await api.post(`/friends/requests/${friendId}`);

        const updatedRequestsList = friendRequestsList.filter(({ id }) => id !== requestId);

        const updatedFriendsList = [...friendsList, request.sender].sort((a, b) => {
          if (a.firstName < b.firstName) {
            return -1;
          }
          if (a.firstName > b.firstName) {
            return 1;
          }
          return 0;
        });

        updateFriendRequestsList(updatedRequestsList);
        updateFriendsList(updatedFriendsList);

        success('Friend request accepted', notificationTitle);
      } catch (err) {
        if (err instanceof AxiosError) {
          alert(err.response?.data.message, notificationTitle);
        } else {
          alert('Failed to accept friend request', notificationTitle);
        }
      } finally {
        setTimeout(() => setIsLoading(false), 1500);
      }
    },
    [friendsList, friendRequestsList],
  );

  const rejectRequest = useCallback(
    async (request: IFriendRequest) => {
      setIsLoading(true);
      const {
        id: requestId,
        sender: { id: friendId },
      } = request;
      try {
        await api.delete(`/friends/requests/${friendId}`);

        const updatedRequestsList = friendRequestsList.filter(({ id }) => id !== requestId);
        updateFriendRequestsList(updatedRequestsList);
        success('Friend request rejected', notificationTitle);
      } catch (err) {
        if (err instanceof AxiosError) {
          alert(err.response?.data.message, notificationTitle);
        } else {
          alert('Failed to reject friend request', notificationTitle);
        }
      } finally {
        setTimeout(() => setIsLoading(false), 1500);
      }
    },
    [friendRequestsList],
  );

  return (
    <Drawer opened={opened} onClose={close} title='Friend Requests'>
      <LoadingOverlay
        loaderProps={{ color: 'secondary', variant: 'bars' }}
        overlayOpacity={0.2}
        visible={isLoading}
        overlayBlur={1}
      />
      {friendRequestsList.map((request) => {
        const requestUser = request.sender.id === user?.id ? request.recipient : request.sender;

        return (
          <Card
            key={request.id}
            my={6}
            px={10}
            radius={8}
            w='100%'
            mih={69}
            className={styles['request-card']}
          >
            <Flex align='center'>
              <Link to={`/profile/${requestUser.id}`}>
                <Avatar
                  radius='50%'
                  size={48}
                  className={styles['friend-avatar']}
                  mr={20}
                  src={requestUser.avatarUrl}
                  alt='request avatar'
                />
              </Link>
              <Flex direction='column'>
                <Title color='white' w={140} order={4} truncate>
                  {requestUser.firstName} {requestUser.lastName}
                </Title>
                <Text w={140} italic size='0.7rem' color='grey' truncate>
                  {requestUser.username}
                </Text>
              </Flex>
            </Flex>
            <Badge color='yellow'>{request.status}</Badge>
            {request.sender.id === user?.id ? (
              <Text size={12} color='yellow'>
                sent by you
              </Text>
            ) : (
              <Flex align='center'>
                <Tooltip label='accept request'>
                  <ActionIcon onClick={() => acceptRequest(request)} mr={8} color='green'>
                    <IconChecks size='1.2rem' />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label='reject request'>
                  <ActionIcon onClick={() => rejectRequest(request)} color='red'>
                    <IconTrashX size='1.2rem' />
                  </ActionIcon>
                </Tooltip>
              </Flex>
            )}
          </Card>
        );
      })}
      {!friendRequestsList.length && (
        <Text align='center' mt={24} color='white'>
          No friend requests :(
        </Text>
      )}
    </Drawer>
  );
};

export default FriendRequestsModal;
