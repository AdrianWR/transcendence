import { createStyles, MantineNumberSize } from '@mantine/core';

// Styles params are optional
export interface SidebarStylesParams {
  radius?: MantineNumberSize;
}

export default createStyles((theme, { radius }: SidebarStylesParams) => ({
  // add all styles as usual
  root: { borderRadius: theme.fn.radius(radius) },
  title: { fontSize: theme.fontSizes.sm },
  description: { fontSize: theme.fontSizes.xs },
}));
