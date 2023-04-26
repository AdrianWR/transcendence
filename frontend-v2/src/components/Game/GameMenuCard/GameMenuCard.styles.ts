import { createStyles } from '@mantine/core';

export interface GameMenuCardStylesParams {
  backgroundColor?: string;
}

export default createStyles((theme, { backgroundColor }: GameMenuCardStylesParams) => ({
  root: {
    backgroundColor:
      backgroundColor || theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    width: 300,
    height: 300,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.sm,
    transition: 'box-shadow 200ms ease',
    '&:hover': {
      boxShadow: theme.shadows.md,
    },
  },
}));
