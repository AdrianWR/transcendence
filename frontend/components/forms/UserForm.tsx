import { Anchor, Button, Container, Divider, Group, Paper, PaperProps, Text } from "@mantine/core";
import { upperFirst, useToggle } from "@mantine/hooks";
import Link from "next/link";
import { useRef } from "react";
import useAuth from "../../lib/hooks/useAuth";
import { FortyTwoButton, GoogleButton } from "../buttons/SocialButtons";
import { LoginUserForm } from "./LoginUserForm";
import { RegisterUserForm } from "./RegisterUserForm";

export const UserForm = (props: PaperProps) => {
  const { setAuth } = useAuth();
  const [type, toggle] = useToggle(['login', 'register']);
  const submitRef = useRef<HTMLElement>();

  return (
    <Container size="xs">
      <Paper radius="md" p="md" withBorder {...props}>
        <Text size="lg" weight={500}>
          Welcome to Transcendence, {type} with
        </Text>

        <Group position="center" mt="md">
          <Link href="/api/auth/google"><GoogleButton type="button">Login with Google</GoogleButton></Link>
          <Link href="/api/auth/intra"><FortyTwoButton type="button">Login with 42</FortyTwoButton></Link>
        </Group>

        <Divider label="Or continue with your email" labelPosition="center" my="lg" />

        {
          type === "register" ?
            <RegisterUserForm submitRef={submitRef} />
            : <LoginUserForm />
        }

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button onClick={() => submitRef.current.click()}>{upperFirst(type)}</Button>
        </Group>

      </Paper>
    </Container >
  );
}

export default UserForm;