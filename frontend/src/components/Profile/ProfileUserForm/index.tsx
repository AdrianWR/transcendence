import {
  Box,
  Button,
  Flex,
  Group,
  List,
  Loader,
  Modal,
  PasswordInput,
  Switch,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck, IconX } from '@tabler/icons-react';
import { AxiosError } from 'axios';
import { FC, FormEvent, useCallback, useState } from 'react';
import QRCode from 'react-qr-code';
import { IUser } from '../../../context/AuthContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import api from '../../../services/api';
import { alert, success } from '../../Notifications';
import AvatarProfileUploader from '../AvatarProfileUploader';

type QrCodemodalProps = {
  url: string;
  opened: boolean;
  onClose: () => void;
};

type UpdateUserFormType = Omit<IUser | undefined, 'id'> | { password?: string };

const QrCodeModal: FC<QrCodemodalProps> = ({ opened, onClose, url }) => {
  return (
    <Modal
      title='Instructions for setting up 2FA'
      opened={opened}
      onClose={onClose}
      centered
      size='lg'
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 40,
        },
      }}
    >
      <List size='md' mb='md'>
        <List.Item>
          Open a 2FA app on your phone, like Google Authenticator or Authy, and tap the{' '}
          <strong>+</strong> button to add a new account.
        </List.Item>
        <List.Item>
          Select the option to scan a QR code. Hold your phone up to the QR code displayed on the
          screen. Make sure the entire QR code is within the camera frame.
        </List.Item>
        <List.Item>
          Enter the 6-digit code that appears on your phone into the input field on the screen.
        </List.Item>
        <List.Item>
          Click on the &quot;Verify&quot; button to complete the registration process.
        </List.Item>
      </List>
      <QRCode
        size={250}
        value={url}
        style={{
          padding: '1rem',
          backgroundColor: 'white',
        }}
      />
    </Modal>
  );
};

const ProfileUserForm: FC = () => {
  const theme = useMantineTheme();
  const { user, updateUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const form = useForm<UpdateUserFormType>({
    initialValues: {
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      password: '',
    },

    validate: {
      email: (value: string | undefined) =>
        /^\S+@\S+$/.test(value || '') ? null : 'Invalid email',
    },
  });

  const handleSubmit = useCallback(
    async (values: UpdateUserFormType, event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        setIsLoading(true);
        const payload = { ...values };
        if (!payload.password) delete payload['password'];

        const response = await api.patch(`/users/${user?.id}`, payload);

        updateUser(response.data);
        success('User profile successfully updated!');
      } catch (err) {
        console.error(err);
        if (err instanceof AxiosError) alert(err.response?.data?.message);
        else alert('Failed to update user profile');
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  const handle2faChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsLoading(true);
      try {
        if (event.target.checked) {
          setIsLoading(true);
          const { data } = await api.post('/auth/2fa/generate');
          setQrCodeUrl(data);
        }

        const response = await api.patch(`/users/${user?.id}`, {
          mfaEnabled: event.target.checked,
        });
        updateUser(response.data);
        success('2FA successfully updated!');
      } catch (err) {
        console.error(err);
        if (err instanceof AxiosError) alert(err.response?.data?.message);
        else alert('Failed to update 2FA');
      } finally {
        setIsLoading(false);
      }
    },
    [user?.mfaEnabled],
  );

  return (
    <Flex direction='row' gap={'lg'}>
      <Box sx={{ minWidth: 250, minHeight: 500 }} mx='auto' w={'100%'}>
        {isLoading ? (
          <Flex h={450} align='center' justify='center'>
            <Loader size='xl' />
          </Flex>
        ) : (
          <form onSubmit={form.onSubmit(async (values, event) => handleSubmit(values, event))}>
            <Group position='center'>
              <AvatarProfileUploader />
            </Group>
            <TextInput my={3} label='Username' {...form.getInputProps('username')} />

            <TextInput my={3} label='FirstName' {...form.getInputProps('firstName')} />

            <TextInput my={3} label='LastName' {...form.getInputProps('lastName')} />

            <TextInput
              my={3}
              label='Email'
              placeholder='your@email.com'
              {...form.getInputProps('email')}
            />

            <PasswordInput
              my={3}
              label='Password'
              placeholder='Your password'
              {...form.getInputProps('password')}
            />

            <Flex direction={'row'} align={'center'} justify={'space-around'} mt='xl'>
              <Switch
                checked={user?.mfaEnabled}
                label={user?.mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                labelPosition='left'
                color='jade'
                onChange={handle2faChange}
                thumbIcon={
                  user?.mfaEnabled ? (
                    <IconCheck
                      size='0.8rem'
                      color={theme.colors.jade[theme.fn.primaryShade()]}
                      stroke={4}
                    />
                  ) : (
                    <IconX
                      size='0.8rem'
                      color={theme.colors.red[theme.fn.primaryShade()]}
                      stroke={4}
                    />
                  )
                }
              >
                {user?.mfaEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </Switch>
              <Button color='secondary' type='submit'>
                Save Changes
              </Button>
            </Flex>
          </form>
        )}
      </Box>
      <QrCodeModal url={qrCodeUrl} opened={!!qrCodeUrl} onClose={() => setQrCodeUrl('')} />
    </Flex>
  );
};

export default ProfileUserForm;
