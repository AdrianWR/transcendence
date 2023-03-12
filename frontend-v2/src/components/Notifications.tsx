import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { ReactNode } from 'react';

export const alert = (message: ReactNode, title?: string) => {
  notifications.show({
    title: title,
    message: message,
    color: 'red',
    icon: <IconX />,
  });
};

export const success = (message: ReactNode, title?: string) => {
  notifications.show({
    title: title,
    message: message,
    color: 'green',
    icon: <IconCheck />,
  });
};
