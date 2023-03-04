import { Button, ButtonProps } from "@mantine/core";
import { FortyTwoIcon, GoogleIcon } from "./SocialIcons";

export const GoogleButton = (props: ButtonProps) => {
  return <Button leftIcon={<GoogleIcon />} variant="default" color="gray" {...props} />;
}

export const FortyTwoButton = (props: ButtonProps) => {
  return <Button leftIcon={<FortyTwoIcon />} variant="gradient" gradient={{ from: 'teal', to: 'blue', deg: 60 }} {...props} />;
}