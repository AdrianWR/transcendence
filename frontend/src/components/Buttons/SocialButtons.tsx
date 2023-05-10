import { Button, ButtonProps } from '@mantine/core';
import { ButtonHTMLAttributes, DetailedHTMLProps, RefObject } from 'react';
import { FortyTwoIcon, GoogleIcon } from './SocialIcons';

export const GoogleButton = (
  props: JSX.IntrinsicAttributes &
    ButtonProps & { component?: 'button' | undefined } & Omit<
      Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'ref'>,
      'component' | keyof ButtonProps
    > & {
      ref?:
        | ((instance: HTMLButtonElement | null) => void)
        | RefObject<HTMLButtonElement>
        | null
        | undefined;
    },
) => {
  return <Button leftIcon={<GoogleIcon />} variant='default' color='gray' {...props} />;
};

export const FortyTwoButton = (
  props: JSX.IntrinsicAttributes &
    ButtonProps & { component?: 'button' | undefined } & Omit<
      Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'ref'>,
      'component' | keyof ButtonProps
    > & {
      ref?:
        | RefObject<HTMLButtonElement>
        | ((instance: HTMLButtonElement | null) => void)
        | null
        | undefined;
    },
) => {
  return (
    <Button
      leftIcon={<FortyTwoIcon />}
      variant='gradient'
      gradient={{ from: 'teal', to: 'blue', deg: 60 }}
      {...props}
    />
  );
};
