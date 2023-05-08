import { Avatar, FileButton, Flex, LoadingOverlay } from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { FC, useCallback, useState } from 'react';
import { IUser } from '../../../context/AuthContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import { alert, success } from '../../Notifications';

const AvatarProfileUploader: FC = () => {
  const [isLoading, setLoading] = useState(false);
  const { user, updateUser } = useAuthContext();

  const uploadAvatar = useCallback(
    async (file: File | null) => {
      if (file) {
        setLoading(true);
        const payload = new FormData();

        payload.append('avatar', file);

        try {
          const { data } = await api.patch(`/users/${user?.id}/avatar`, payload);

          const { user: updatedUser }: { user: IUser } = data;

          if (user) updateUser(updatedUser);
          success('Avatar successfully updated!');
        } catch (err) {
          if (err instanceof AxiosError) alert(err.response?.data?.message);
          else alert('Error while uploading avatar :(');
        } finally {
          setLoading(false);
        }
      }
    },
    [user, updateUser],
  );

  return (
    <Flex pos='relative' justify='center' align='center' w='fit-content'>
      <Avatar
        radius='50%'
        size='xl'
        src={user?.avatarUrl}
        pos='relative'
        alt='user avatar'
        styles={(theme) => ({
          root: {
            border: `2px solid ${theme.colors.secondary[6]}`,
          },
        })}
      />
      <FileButton onChange={uploadAvatar} accept='image/png,image/jpeg,image/svg+xml'>
        {(props) => (
          <IconCamera
            {...props}
            width={36}
            height={36}
            style={{
              backgroundColor: '#F46036',
              color: 'white',
              borderRadius: '50%',
              padding: 6,
              position: 'absolute',
              bottom: -5,
              right: -5,
              cursor: 'pointer',
              ...(isLoading ? { display: 'none', backgroundColor: 'transparent' } : {}),
            }}
          />
        )}
      </FileButton>
      <LoadingOverlay radius='50%' visible={isLoading} />
    </Flex>
  );
};

export default AvatarProfileUploader;
