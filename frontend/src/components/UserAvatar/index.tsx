import { Avatar, MantineNumberSize, Tooltip } from '@mantine/core';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IUser } from '../../context/AuthContext';
import { useAuthContext } from '../../hooks/useAuthContext';

interface UserAvatarProps {
  user?: IUser;
  size?: MantineNumberSize;
  radius?: MantineNumberSize;
}

export const UserAvatar: FC<UserAvatarProps> = ({ user, size = 'md' }) => {
  const { user: activeUser } = useAuthContext();
  const isActiveUser = activeUser?.id === user?.id;

  if (!user) {
    return <Avatar size={size} radius='xl' />;
  }

  return (
    <Tooltip label={`${user.firstName} ${user.lastName}`} position='top'>
      <Avatar
        component={Link}
        to={`/profile/${user.id}`}
        src={user.avatarUrl}
        size={size}
        radius='xl'
        styles={(theme) => ({
          root: {
            border: '2px solid transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              border: `2px solid ${
                isActiveUser ? theme.colors.secondary[6] : theme.colors.lightBlue[6]
              }`,
            },
          },
        })}
      />
    </Tooltip>
  );
};

interface UserAvatarGroupProps {
  users: IUser[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
}

export const UserAvatarGroup: FC<UserAvatarGroupProps> = ({ users, max = 3, size = 'md' }) => {
  const [avatars, setAvatars] = useState<JSX.Element[]>([]);
  const [more, setMore] = useState<number>(0);

  useEffect(() => {
    const avatars = users
      .slice(0, max)
      .map((user) => <UserAvatar key={user.id} user={user} size={size} />);

    setAvatars(avatars);
    setMore(users.length - max);
  }, [users]);

  return (
    <Avatar.Group spacing='lg'>
      {avatars}
      {more > 0 && (
        <Tooltip label={`${more} more`} position='top'>
          <Avatar radius='xl' size={size}>
            +{more}
          </Avatar>
        </Tooltip>
      )}
    </Avatar.Group>
  );
};

export default UserAvatar;
