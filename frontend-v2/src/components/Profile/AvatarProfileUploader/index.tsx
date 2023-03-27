import { Flex, Image, FileButton, LoadingOverlay } from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';
import { FC, useCallback, useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import { IUser } from '../../../context/AuthContext';
import { alert, success } from '../../Notifications';
import { AxiosError } from 'axios';

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
      <Image
        radius='50%'
        width={100}
        height={100}
        src={user?.avatarUrl || '/images/cat-pirate.jpg'}
        pos='relative'
        alt='user avatar'
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
