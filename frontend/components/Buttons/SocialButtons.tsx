import { Button, ButtonProps } from "@mantine/core";
import { GoogleIcon } from "./GoogleIcon";

export const GoogleButton = (props: ButtonProps) => {
  return <Button leftIcon={<GoogleIcon />} variant="default" color="gray" {...props} />;
}